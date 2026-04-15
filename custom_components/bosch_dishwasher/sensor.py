"""Sensor platform for the Bosch Dishwasher integration."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import timedelta

from aiohomeconnect.model import EventKey, OptionKey, StatusKey

from homeassistant.components.sensor import (
    SensorDeviceClass,
    SensorEntity,
    SensorEntityDescription,
    SensorStateClass,
)
from homeassistant.const import PERCENTAGE
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback
from homeassistant.util import dt as dt_util

from .common import setup_home_connect_entry
from .const import (
    BSH_EVENT_STATE_CONFIRMED,
    BSH_EVENT_STATE_OFF,
    BSH_EVENT_STATE_PRESENT,
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
        key=OptionKey.BSH_COMMON_OPTION_START_IN_RELATIVE.value,
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
            try:
                status_key = StatusKey(key)
            except ValueError:
                self._attr_native_value = None
                return
            status = self.appliance.status.get(status_key)
            self._attr_native_value = self._enum_from_bsh(
                status.value if status else None
            )
            return

        try:
            event_key = EventKey(key)
        except ValueError:
            self._attr_native_value = None
            return

        event = self.appliance.events.get(event_key)
        if event is None:
            self._attr_native_value = None
            return

        if desc.device_class is SensorDeviceClass.TIMESTAMP:
            seconds = event.value
            if seconds in (None, 0, "0"):
                self._attr_native_value = None
                return
            try:
                self._attr_native_value = dt_util.utcnow() + timedelta(
                    seconds=int(seconds)
                )
            except (TypeError, ValueError):
                self._attr_native_value = None
            return

        if desc.device_class is SensorDeviceClass.ENUM and isinstance(event.value, str):
            self._attr_native_value = self._presence_from_bsh(event.value)
            return

        self._attr_native_value = event.value

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
