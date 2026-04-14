"""Binary sensor platform for the Bosch Dishwasher integration."""

from __future__ import annotations

from dataclasses import dataclass

from aiohomeconnect.model import EventKey, StatusKey

from homeassistant.components.binary_sensor import (
    BinarySensorDeviceClass,
    BinarySensorEntity,
    BinarySensorEntityDescription,
)
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from .common import setup_home_connect_entry
from .const import BSH_EVENT_STATE_CONFIRMED, BSH_EVENT_STATE_PRESENT
from .coordinator import (
    BoschDishwasherConfigEntry,
    HomeConnectApplianceCoordinator,
)
from .entity import HomeConnectEntity


@dataclass(frozen=True, kw_only=True)
class HomeConnectBinarySensorEntityDescription(BinarySensorEntityDescription):
    """Describe a Home Connect binary sensor."""

    source: str  # "status" | "event" | "connected"


BINARY_SENSOR_DESCRIPTIONS: tuple[HomeConnectBinarySensorEntityDescription, ...] = (
    HomeConnectBinarySensorEntityDescription(
        key=StatusKey.BSH_COMMON_REMOTE_CONTROL_ACTIVE.value,
        translation_key="remote_control",
        source="status",
    ),
    HomeConnectBinarySensorEntityDescription(
        key=StatusKey.BSH_COMMON_REMOTE_CONTROL_START_ALLOWED.value,
        translation_key="remote_control_start_allowed",
        source="status",
    ),
    HomeConnectBinarySensorEntityDescription(
        key=StatusKey.BSH_COMMON_LOCAL_CONTROL_ACTIVE.value,
        translation_key="local_control",
        source="status",
    ),
    HomeConnectBinarySensorEntityDescription(
        key=EventKey.DISHCARE_DISHWASHER_EVENT_SALT_NEARLY_EMPTY.value,
        translation_key="salt_nearly_empty",
        device_class=BinarySensorDeviceClass.PROBLEM,
        source="event",
    ),
    HomeConnectBinarySensorEntityDescription(
        key=EventKey.DISHCARE_DISHWASHER_EVENT_RINSE_AID_NEARLY_EMPTY.value,
        translation_key="rinse_aid_nearly_empty",
        device_class=BinarySensorDeviceClass.PROBLEM,
        source="event",
    ),
    HomeConnectBinarySensorEntityDescription(
        key="connected",
        translation_key="connected",
        device_class=BinarySensorDeviceClass.CONNECTIVITY,
        source="connected",
    ),
)


def _get_entities(
    coordinator: HomeConnectApplianceCoordinator,
) -> list[HomeConnectEntity]:
    """Build binary sensors for a single dishwasher."""
    return [
        HomeConnectBinarySensor(coordinator, desc)
        for desc in BINARY_SENSOR_DESCRIPTIONS
    ]


async def async_setup_entry(
    hass: HomeAssistant,
    entry: BoschDishwasherConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    """Set up the Bosch Dishwasher binary sensor platform."""
    setup_home_connect_entry(hass, entry, _get_entities, async_add_entities)


class HomeConnectBinarySensor(HomeConnectEntity, BinarySensorEntity):
    """A binary sensor backed by a Home Connect status, event, or connectivity."""

    entity_description: HomeConnectBinarySensorEntityDescription

    @property
    def available(self) -> bool:
        """Connectivity sensor is always available; others follow base rules."""
        if self.entity_description.source == "connected":
            return True
        return super().available

    def update_native_value(self) -> None:
        """Recompute is_on from coordinator state."""
        desc = self.entity_description

        if desc.source == "connected":
            self._attr_is_on = self.appliance.info.connected
            return

        if desc.source == "status":
            try:
                status_key = StatusKey(desc.key)
            except ValueError:
                self._attr_is_on = None
                return
            status = self.appliance.status.get(status_key)
            self._attr_is_on = bool(status.value) if status else None
            return

        try:
            event_key = EventKey(desc.key)
        except ValueError:
            self._attr_is_on = None
            return
        event = self.appliance.events.get(event_key)
        if event is None:
            self._attr_is_on = False
            return
        self._attr_is_on = event.value in (
            BSH_EVENT_STATE_PRESENT,
            BSH_EVENT_STATE_CONFIRMED,
        )
