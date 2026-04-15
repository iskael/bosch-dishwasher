"""Coordinator and runtime data for the Bosch Dishwasher integration."""

from __future__ import annotations

import asyncio
import contextlib
from dataclasses import dataclass, field
from datetime import timedelta
import logging
from typing import Any

from aiohomeconnect.client import Client as HomeConnectClient
from aiohomeconnect.model import (
    ArrayOfEvents,
    CommandKey,
    Event,
    EventKey,
    EventMessage,
    EventType,
    GetSetting,
    HomeAppliance,
    OptionKey,
    ProgramKey,
    SettingKey,
    Status,
    StatusKey,
)
from aiohomeconnect.model.error import (
    HomeConnectError,
    TooManyRequestsError,
    UnauthorizedError,
)
from aiohomeconnect.model.program import EnumerateProgram, ProgramDefinitionOption

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import CALLBACK_TYPE, HomeAssistant, callback
from homeassistant.exceptions import ConfigEntryAuthFailed, ConfigEntryNotReady
from homeassistant.helpers.update_coordinator import (
    DataUpdateCoordinator,
    UpdateFailed,
)

from .const import (
    API_DEFAULT_RETRY_AFTER,
    BSH_OPERATION_STATE_FINISHED,
    BSH_OPERATION_STATE_INACTIVE,
    BSH_OPERATION_STATE_READY,
    DISHWASHER_APPLIANCE_TYPE,
    DOMAIN,
)

# Event keys whose values become meaningless once a program is no longer
# running. Home Connect does NOT push new values for these when the cycle
# ends — it just flips OperationState — so we clear them ourselves.
_PROGRAM_RUNTIME_EVENT_KEYS: tuple[EventKey, ...] = (
    EventKey.BSH_COMMON_OPTION_PROGRAM_PROGRESS,
    EventKey.BSH_COMMON_OPTION_REMAINING_PROGRAM_TIME,
    EventKey.BSH_COMMON_OPTION_ESTIMATED_TOTAL_PROGRAM_TIME,
    EventKey.BSH_COMMON_OPTION_ELAPSED_PROGRAM_TIME,
    EventKey.BSH_COMMON_OPTION_START_IN_RELATIVE,
)

_IDLE_OPERATION_STATES: frozenset[str] = frozenset(
    {
        BSH_OPERATION_STATE_INACTIVE,
        BSH_OPERATION_STATE_READY,
        BSH_OPERATION_STATE_FINISHED,
    }
)

_LOGGER = logging.getLogger(__name__)

EVENT_STREAM_RECONNECT_DELAY = 30
EVENT_STREAM_MAX_BACKOFF = 300

type BoschDishwasherConfigEntry = ConfigEntry["HomeConnectRuntimeData"]


@dataclass
class HomeConnectApplianceData:
    """All state we track for a single dishwasher."""

    info: HomeAppliance
    settings: dict[SettingKey, GetSetting] = field(default_factory=dict)
    status: dict[StatusKey, Status] = field(default_factory=dict)
    events: dict[EventKey, Event] = field(default_factory=dict)
    commands: set[CommandKey] = field(default_factory=set)
    programs: list[EnumerateProgram] = field(default_factory=list)
    options: dict[OptionKey, ProgramDefinitionOption] = field(default_factory=dict)


class HomeConnectApplianceCoordinator(
    DataUpdateCoordinator[HomeConnectApplianceData]
):
    """Per-appliance coordinator with event-key-scoped listeners."""

    config_entry: BoschDishwasherConfigEntry

    def __init__(
        self,
        hass: HomeAssistant,
        entry: BoschDishwasherConfigEntry,
        client: HomeConnectClient,
        appliance: HomeAppliance,
    ) -> None:
        """Initialize coordinator for a single dishwasher."""
        super().__init__(
            hass,
            _LOGGER,
            config_entry=entry,
            name=f"{DOMAIN}-{appliance.ha_id}",
            update_interval=timedelta(minutes=30),
        )
        self.client = client
        self.data = HomeConnectApplianceData(info=appliance)

    @callback
    def async_add_listener(
        self,
        update_callback: CALLBACK_TYPE,
        context: Any = None,
    ) -> CALLBACK_TYPE:
        """Listen for updates, optionally filtered by EventKey context."""
        return super().async_add_listener(update_callback, context)

    @callback
    def _async_dispatch_event_keys(self, keys: set[EventKey]) -> None:
        """Run listeners whose context matches any of the given event keys."""
        for update_callback, context in list(self._listeners.values()):
            if context is None:
                update_callback()
                continue
            if isinstance(context, EventKey):
                if context in keys:
                    update_callback()
            elif isinstance(context, (tuple, set, list)):
                if any(k in keys for k in context):
                    update_callback()

    async def _async_update_data(self) -> HomeConnectApplianceData:
        """Refresh all dishwasher state from the API."""
        ha_id = self.data.info.ha_id

        try:
            self.data.info.connected = (
                await self.client.get_specific_appliance(ha_id)
            ).connected
            settings = await self.client.get_settings(ha_id)
            status = await self.client.get_status(ha_id)
            commands = await self.client.get_available_commands(ha_id)
            all_programs = await self.client.get_all_programs(ha_id)
        except UnauthorizedError as err:
            self.config_entry.async_start_reauth(self.hass)
            raise ConfigEntryAuthFailed from err
        except TooManyRequestsError as err:
            delay = err.retry_after or API_DEFAULT_RETRY_AFTER
            raise UpdateFailed(
                f"Home Connect rate-limited; retry in {delay}s"
            ) from err
        except HomeConnectError as err:
            raise UpdateFailed(f"Cannot refresh dishwasher: {err}") from err

        self.data.settings = {item.key: item for item in settings.settings}
        self.data.status = {item.key: item for item in status.status}
        self.data.commands = {item.key for item in commands.commands}
        self.data.programs = [
            program
            for program in all_programs.programs
            if program.key and program.key != ProgramKey.UNKNOWN
        ]

        # Store active/selected program keys in the events dict so select entities
        # can read them at initial load (before any SSE event arrives).
        if all_programs.active and all_programs.active.key:
            active_key = EventKey.BSH_COMMON_ROOT_ACTIVE_PROGRAM
            self.data.events[active_key] = Event(
                key=active_key,
                raw_key=active_key.value,
                timestamp=0,
                level="",
                handling="",
                value=all_programs.active.key.value,
                name=None,
                display_value=None,
                unit=None,
            )
        if all_programs.selected and all_programs.selected.key:
            selected_key = EventKey.BSH_COMMON_ROOT_SELECTED_PROGRAM
            self.data.events[selected_key] = Event(
                key=selected_key,
                raw_key=selected_key.value,
                timestamp=0,
                level="",
                handling="",
                value=all_programs.selected.key.value,
                name=None,
                display_value=None,
                unit=None,
            )

        active_or_selected = all_programs.active or all_programs.selected
        if active_or_selected and active_or_selected.key:
            self.data.options = await self._fetch_program_options(
                active_or_selected.key
            )
            for option in active_or_selected.options or []:
                event_key = EventKey(option.key)
                if event_key is EventKey.UNKNOWN:
                    continue
                self.data.events[event_key] = Event(
                    key=event_key,
                    raw_key=option.key,
                    timestamp=0,
                    level="",
                    handling="",
                    value=option.value,
                    name=option.name,
                    display_value=option.display_value,
                    unit=option.unit,
                )
        else:
            self.data.options = {}

        self._clear_stale_runtime_events(set())

        return self.data

    async def _fetch_program_options(
        self, program_key: ProgramKey
    ) -> dict[OptionKey, ProgramDefinitionOption]:
        """Fetch program option definitions."""
        try:
            program = await self.client.get_available_program(
                self.data.info.ha_id, program_key=program_key
            )
        except HomeConnectError as err:
            _LOGGER.debug("Cannot fetch options for %s: %s", program_key, err)
            return {}
        return {opt.key: opt for opt in program.options or []}

    async def async_apply_event_message(self, message: EventMessage) -> None:
        """Apply an SSE event message and dispatch listeners."""
        data = self.data
        touched: set[EventKey] = set()

        if message.type == EventType.DISCONNECTED:
            data.info.connected = False
            self.async_set_updated_data(data)
            return

        if message.type in (EventType.CONNECTED, EventType.PAIRED):
            data.info.connected = True
            await self.async_request_refresh()
            return

        items = self._safe_items(message.data)

        # Note: aiohomeconnect's StatusKey/EventKey/SettingKey/OptionKey
        # enums return the <cls>.UNKNOWN member for unrecognised raw keys
        # instead of raising ValueError, so we must filter UNKNOWN
        # explicitly — otherwise stray events would overwrite each other
        # on the single UNKNOWN dict slot.
        if message.type == EventType.STATUS:
            for event in items:
                status_key = StatusKey(event.key)
                if status_key is StatusKey.UNKNOWN:
                    continue
                data.status[status_key] = Status(
                    key=status_key,
                    raw_key=status_key.value,
                    value=event.value,
                    name=event.name,
                )
                event_key = EventKey(event.key)
                if event_key is not EventKey.UNKNOWN:
                    touched.add(event_key)
        elif message.type == EventType.NOTIFY:
            program_changed = False
            for event in items:
                setting_key = SettingKey(event.key)
                if setting_key is not SettingKey.UNKNOWN:
                    data.settings[setting_key] = GetSetting(
                        key=setting_key,
                        raw_key=setting_key.value,
                        value=event.value,
                        name=event.name,
                    )
                    event_key = EventKey(event.key)
                    if event_key is not EventKey.UNKNOWN:
                        touched.add(event_key)
                    continue
                event_key = EventKey(event.key)
                if event_key is EventKey.UNKNOWN:
                    continue
                data.events[event_key] = event
                touched.add(event_key)
                if event_key in (
                    EventKey.BSH_COMMON_ROOT_ACTIVE_PROGRAM,
                    EventKey.BSH_COMMON_ROOT_SELECTED_PROGRAM,
                ):
                    program_changed = isinstance(event.value, str)
            if program_changed:
                await self._refresh_options_after_program_change()
        elif message.type == EventType.EVENT:
            for event in items:
                event_key = EventKey(event.key)
                if event_key is EventKey.UNKNOWN:
                    continue
                data.events[event_key] = event
                touched.add(event_key)

        self._clear_stale_runtime_events(touched)

        self.async_set_updated_data(data)
        if touched:
            self._async_dispatch_event_keys(touched)

    def _clear_stale_runtime_events(self, touched: set[EventKey]) -> None:
        """Drop program-runtime events once OperationState leaves a running state.

        Home Connect only emits ProgramProgress / RemainingProgramTime while a
        cycle is active and silently stops updating them when it ends — so
        without this, sensors would keep reporting the last known values (e.g.
        92% / 11 min) forever after the dishwasher finishes.
        """
        op_status = self.data.status.get(StatusKey.BSH_COMMON_OPERATION_STATE)
        if op_status is None or not isinstance(op_status.value, str):
            return
        if op_status.value not in _IDLE_OPERATION_STATES:
            return
        for stale_key in _PROGRAM_RUNTIME_EVENT_KEYS:
            if self.data.events.pop(stale_key, None) is not None:
                touched.add(stale_key)

    @staticmethod
    def _safe_items(payload: ArrayOfEvents | None) -> list[Event]:
        """Return items from an ArrayOfEvents payload, tolerating None."""
        if payload is None:
            return []
        return list(payload.items or [])

    async def _refresh_options_after_program_change(self) -> None:
        """Reload option definitions after the active/selected program changes."""
        for event_key in (
            EventKey.BSH_COMMON_ROOT_ACTIVE_PROGRAM,
            EventKey.BSH_COMMON_ROOT_SELECTED_PROGRAM,
        ):
            event = self.data.events.get(event_key)
            if event is None or not isinstance(event.value, str):
                continue
            try:
                program_key = ProgramKey(event.value)
            except ValueError:
                continue
            self.data.options = await self._fetch_program_options(program_key)
            return
        self.data.options = {}


GlobalListener = tuple[CALLBACK_TYPE, tuple[EventKey, ...]]


class HomeConnectRuntimeData:
    """Runtime data shared across the integration's platforms."""

    def __init__(
        self,
        hass: HomeAssistant,
        entry: BoschDishwasherConfigEntry,
        client: HomeConnectClient,
    ) -> None:
        """Initialize runtime data."""
        self.hass = hass
        self.entry = entry
        self.client = client
        self.appliance_coordinators: dict[str, HomeConnectApplianceCoordinator] = {}
        self.global_listeners: dict[int, GlobalListener] = {}
        self._next_listener_id = 0
        self._event_task: asyncio.Task | None = None

    async def setup_appliance_coordinators(self) -> None:
        """Discover dishwashers and create per-appliance coordinators."""
        try:
            appliances = await self.client.get_home_appliances()
        except UnauthorizedError as err:
            raise ConfigEntryAuthFailed from err
        except HomeConnectError as err:
            raise ConfigEntryNotReady(
                f"Cannot list Home Connect appliances: {err}"
            ) from err

        for appliance in appliances.homeappliances:
            _LOGGER.debug(
                "Found Home Connect appliance: ha_id=%s type=%s name=%s",
                appliance.ha_id,
                appliance.type,
                appliance.name,
            )
            if appliance.type.lower() != DISHWASHER_APPLIANCE_TYPE.lower():
                _LOGGER.debug("Skipping non-dishwasher appliance: %s (%s)", appliance.name, appliance.type)
                continue
            coordinator = HomeConnectApplianceCoordinator(
                self.hass, self.entry, self.client, appliance
            )
            self.appliance_coordinators[appliance.ha_id] = coordinator

        if not self.appliance_coordinators:
            _LOGGER.warning(
                "No dishwashers found in this Home Connect account. "
                "Found appliances: %s. The integration will still load and "
                "listen for new appliances being paired.",
                [f"{a.name} ({a.type})" for a in appliances.homeappliances],
            )

    @callback
    def async_add_global_listener(
        self,
        update_callback: CALLBACK_TYPE,
        event_keys: tuple[EventKey, ...],
    ) -> CALLBACK_TYPE:
        """Register a callback that fires when any listed global event arrives."""
        listener_id = self._next_listener_id
        self._next_listener_id += 1
        self.global_listeners[listener_id] = (update_callback, event_keys)

        @callback
        def _remove() -> None:
            self.global_listeners.pop(listener_id, None)

        return _remove

    @callback
    def _dispatch_global_event(self, event_key: EventKey) -> None:
        """Fire any global listeners interested in this event key."""
        for callback_fn, keys in list(self.global_listeners.values()):
            if event_key in keys:
                callback_fn()

    def start_event_listener(self) -> None:
        """Start the SSE event-stream task."""
        self._event_task = self.entry.async_create_background_task(
            self.hass,
            self._event_listener(),
            f"{DOMAIN}-event-listener-{self.entry.entry_id}",
        )

    async def async_shutdown(self) -> None:
        """Cancel the SSE task on unload and wait for it to finish."""
        if self._event_task and not self._event_task.done():
            self._event_task.cancel()
            with contextlib.suppress(asyncio.CancelledError, Exception):
                await self._event_task
        self._event_task = None

    async def _event_listener(self) -> None:
        """Long-lived task that consumes Home Connect SSE events."""
        backoff = EVENT_STREAM_RECONNECT_DELAY
        while True:
            try:
                async for message in self.client.stream_all_events():
                    backoff = EVENT_STREAM_RECONNECT_DELAY
                    await self._handle_event_message(message)
            except UnauthorizedError:
                _LOGGER.warning("Home Connect SSE unauthorized; starting reauth")
                self.entry.async_start_reauth(self.hass)
                return
            except TooManyRequestsError as err:
                delay = err.retry_after or API_DEFAULT_RETRY_AFTER
                _LOGGER.warning(
                    "Home Connect SSE rate-limited, retrying in %s s", delay
                )
                await asyncio.sleep(delay)
            except HomeConnectError as err:
                _LOGGER.warning(
                    "Home Connect SSE interrupted: %s; retrying in %s s",
                    err,
                    backoff,
                )
                await asyncio.sleep(backoff)
                backoff = min(backoff * 2, EVENT_STREAM_MAX_BACKOFF)
            except asyncio.CancelledError:
                raise
            except Exception:  # noqa: BLE001
                _LOGGER.exception("Unexpected error in Home Connect event listener")
                await asyncio.sleep(backoff)
                backoff = min(backoff * 2, EVENT_STREAM_MAX_BACKOFF)

    async def _handle_event_message(self, message: EventMessage) -> None:
        """Route an SSE message to the right coordinator and global listeners."""
        if message.type == EventType.PAIRED:
            await self._handle_paired_event(message)
            self._dispatch_global_event(EventKey.BSH_COMMON_APPLIANCE_PAIRED)
            return
        if message.type == EventType.DEPAIRED:
            self._handle_depaired_event(message)
            self._dispatch_global_event(EventKey.BSH_COMMON_APPLIANCE_DEPAIRED)
            return

        coordinator = self.appliance_coordinators.get(message.ha_id)
        if coordinator is None:
            return

        was_connected = coordinator.data.info.connected
        await coordinator.async_apply_event_message(message)
        is_connected = coordinator.data.info.connected
        if message.type == EventType.CONNECTED or (not was_connected and is_connected):
            self._dispatch_global_event(EventKey.BSH_COMMON_APPLIANCE_CONNECTED)

    async def _handle_paired_event(self, message: EventMessage) -> None:
        """Add a newly paired dishwasher to the registry."""
        if message.ha_id in self.appliance_coordinators:
            return
        try:
            appliance = await self.client.get_specific_appliance(message.ha_id)
        except HomeConnectError as err:
            _LOGGER.warning("Cannot fetch newly paired appliance: %s", err)
            return
        if appliance.type != DISHWASHER_APPLIANCE_TYPE:
            return
        coordinator = HomeConnectApplianceCoordinator(
            self.hass, self.entry, self.client, appliance
        )
        self.appliance_coordinators[message.ha_id] = coordinator
        # Inside the SSE loop: use async_refresh, not first_refresh.
        # first_refresh raises ConfigEntryNotReady on failure which is not
        # appropriate for a running entry and would bubble up past the
        # HomeConnectError handler in _event_listener.
        await coordinator.async_refresh()

    def _handle_depaired_event(self, message: EventMessage) -> None:
        """Drop a removed dishwasher from the registry."""
        self.appliance_coordinators.pop(message.ha_id, None)
