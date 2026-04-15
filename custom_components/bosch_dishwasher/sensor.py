"""Sensor platform for the Bosch Dishwasher integration."""

from __future__ import annotations

from dataclasses import dataclass

from aiohomeconnect.model import EventKey, StatusKey

from homeassistant.components.sensor import (
    SensorDeviceClass,
    SensorEntity,
    SensorEntityDescription,
    SensorStateClass,
)
from homeassistant.const import PERCENTAGE
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from .common import setup_home_connect_entry
from .const import (
    BSH_EVENT_STATE_CONFIRMED,
    BSH_EVENT_STATE_OFF,
    BSH_EVENT_STATE_PRESENT,
    BSH_OPERATION_STATE_ACTION_REQUIRED,
    BSH_OPERATION_STATE_DELAYED_START,
    BSH_OPERATION_STATE_PAUSE,
    BSH_OPERATION_STATE_RUN,
)
from .coordinator import (
    BoschDishwasherConfigEntry,
    HomeConnectApplianceCoordinator,
)
from .entity import HomeConnectEntity


@dataclass(frozen=True, kw_only=True)
class HomeConnectSensorEntityDescription(SensorEntityDescription):
    """Describe a Home Connect sensor."""

    appliance_status: bool = False


OPERATION_STATE_OPTIONS = [
    "inactive",
    "ready",
    "delayed_start",
    "run",
    "pause",
    "action_required",
    "finished",
    "error",
    "aborting",
]

DOOR_STATE_OPTIONS = ["open", "closed", "locked"]

EVENT_PRESENCE_OPTIONS = ["off", "present", "confirmed"]


SENSOR_DESCRIPTIONS: tuple[HomeConnectSensorEntityDescription, ...] = (
    HomeConnectSensorEntityDescription(
        key=StatusKey.BSH_COMMON_OPERATION_STATE.value,
        translation_key="operation_state",
        device_class=SensorDeviceClass.ENUM,
        options=OPERATION_STATE_OPTIONS,
        appliance_status=True,
    ),
    HomeConnectSensorEntityDescription(
        key=StatusKey.BSH_COMMON_DOOR_STATE.value,
        translation_key="door_state",
        device_class=SensorDeviceClass.ENUM,
        options=DOOR_STATE_OPTIONS,
        appliance_status=True,
    ),
    HomeConnectSensorEntityDescription(
        key=EventKey.BSH_COMMON_OPTION_PROGRAM_PROGRESS.value,
        translation_key="program_progress",
        native_unit_of_measurement=PERCENTAGE,
        state_class=SensorStateClass.MEASUREMENT,
    ),
    HomeConnectSensorEntityDescription(
        key=EventKey.BSH_COMMON_OPTION_REMAINING_PROGRAM_TIME.value,
        translation_key="remaining_program_time",
        device_class=SensorDeviceClass.TIMESTAMP,
    ),
    HomeConnectSensorEntityDescription(
        key=EventKey.BSH_COMMON_EVENT_PROGRAM_FINISHED.value,
        translation_key="program_finished",
        device_class=SensorDeviceClass.ENUM,
        options=EVENT_PRESENCE_OPTIONS,
    ),
    HomeConnectSensorEntityDescription(
        key=EventKey.BSH_COMMON_EVENT_PROGRAM_ABORTED.value,
        translation_key="program_aborted",
        device_class=SensorDeviceClass.ENUM,
        options=EVENT_PRESENCE_OPTIONS,
    ),
    HomeConnectSensorEntityDescription(
        key=EventKey.BSH_COMMON_OPTION_START_IN_RELATIVE.value,
        translation_key="start_in_relative",
        device_class=SensorDeviceClass.TIMESTAMP,
    ),
)


def _get_entities(
    coordinator: HomeConnectApplianceCoordinator,
) -> list[HomeConnectEntity]:
    """Build the sensor list for a single dishwasher."""
    return [HomeConnectSensor(coordinator, desc) for desc in SENSOR_DESCRIPTIONS]


async def async_setup_entry(
    hass: HomeAssistant,
    entry: BoschDishwasherConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    """Set up the Bosch Dishwasher sensor platform."""
    setup_home_connect_entry(hass, entry, _get_entities, async_add_entities)


class HomeConnectSensor(HomeConnectEntity, SensorEntity):
    """A sensor backed by a Home Connect status or event."""

    entity_description: HomeConnectSensorEntityDescription

    def update_native_value(self) -> None:
        """Recompute native value from coordinator state."""
        desc = self.entity_description
        key = desc.key

        if desc.appliance_status:
            status_key = StatusKey(key)
            if status_key is StatusKey.UNKNOWN:
                self._attr_native_value = None
                return
            status = self.appliance.status.get(status_key)
            self._attr_native_value = self._enum_from_bsh(
                status.value if status else None
            )
            return

        event_key = EventKey(key)
        if event_key is EventKey.UNKNOWN:
            self._attr_native_value = None
            return

        # TIMESTAMP-class events (RemainingProgramTime, StartInRelative) are
        # gated on the current operation state and read their absolute value
        # from the coordinator's pre-computed timestamps so they don't drift
        # forward on every update.
        if desc.device_class is SensorDeviceClass.TIMESTAMP:
            op_state = self._op_state()
            if event_key is EventKey.BSH_COMMON_OPTION_START_IN_RELATIVE:
                if op_state != BSH_OPERATION_STATE_DELAYED_START:
                    self._attr_native_value = None
                    return
            elif event_key is EventKey.BSH_COMMON_OPTION_REMAINING_PROGRAM_TIME:
                if op_state not in (
                    BSH_OPERATION_STATE_RUN,
                    BSH_OPERATION_STATE_PAUSE,
                    BSH_OPERATION_STATE_ACTION_REQUIRED,
                    BSH_OPERATION_STATE_DELAYED_START,
                ):
                    self._attr_native_value = None
                    return
            self._attr_native_value = self.appliance.computed_timestamps.get(event_key)
            return

        event = self.appliance.events.get(event_key)
        if event is None:
            # ENUM presence sensors default to "off" when no event has arrived yet.
            if (
                desc.device_class is SensorDeviceClass.ENUM
                and desc.options is not None
                and "off" in desc.options
            ):
                self._attr_native_value = "off"
            else:
                self._attr_native_value = None
            return

        if desc.device_class is SensorDeviceClass.ENUM and isinstance(event.value, str):
            self._attr_native_value = self._presence_from_bsh(event.value)
            return

        self._attr_native_value = event.value

    def _op_state(self) -> str | None:
        """Return the current raw OperationState value (e.g. the full BSH enum)."""
        op = self.appliance.status.get(StatusKey.BSH_COMMON_OPERATION_STATE)
        return op.value if op and isinstance(op.value, str) else None

    @staticmethod
    def _enum_from_bsh(raw: str | None) -> str | None:
        """Translate a BSH enum like 'BSH.Common.EnumType.X.Run' to 'run'."""
        if not isinstance(raw, str):
            return None
        suffix = raw.rsplit(".", 1)[-1]
        out: list[str] = []
        for i, ch in enumerate(suffix):
            if ch.isupper() and i and not suffix[i - 1].isupper():
                out.append("_")
            out.append(ch.lower())
        return "".join(out)

    @staticmethod
    def _presence_from_bsh(raw: str) -> str | None:
        """Translate an event present-state value to off/present/confirmed."""
        if raw == BSH_EVENT_STATE_PRESENT:
            return "present"
        if raw == BSH_EVENT_STATE_CONFIRMED:
            return "confirmed"
        if raw == BSH_EVENT_STATE_OFF:
            return "off"
        return None
