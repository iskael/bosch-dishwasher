"""Base entity for the Bosch Dishwasher integration."""

from __future__ import annotations

from abc import abstractmethod
import contextlib
from typing import Any, cast

from aiohomeconnect.model import EventKey, OptionKey
from aiohomeconnect.model.error import ActiveProgramNotSetError, HomeConnectError

from homeassistant.core import callback
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.entity import EntityDescription
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .const import DOMAIN
from .coordinator import HomeConnectApplianceCoordinator


class HomeConnectEntity(CoordinatorEntity[HomeConnectApplianceCoordinator]):
    """Base class for all Bosch Dishwasher entities."""

    _attr_has_entity_name = True

    def __init__(
        self,
        coordinator: HomeConnectApplianceCoordinator,
        desc: EntityDescription,
        context_override: Any | None = None,
    ) -> None:
        """Initialize the entity."""
        appliance_ha_id = coordinator.data.info.ha_id
        context = EventKey(desc.key) if context_override is None else context_override
        super().__init__(coordinator, context)
        self.appliance = coordinator.data
        self.entity_description = desc
        self._attr_unique_id = f"{appliance_ha_id}-{desc.key}"
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, appliance_ha_id)},
        )
        self.update_native_value()

    @abstractmethod
    def update_native_value(self) -> None:
        """Recompute the entity's native value from coordinator state."""

    @callback
    def _handle_coordinator_update(self) -> None:
        """Handle updated data from the coordinator."""
        self.update_native_value()
        self.async_write_ha_state()

    @property
    def bsh_key(self) -> str:
        """Return the BSH key for this entity."""
        return self.entity_description.key

    @property
    def available(self) -> bool:
        """Return True when the appliance is connected."""
        return self.appliance.info.connected and super().available

    async def async_set_option_with_key(
        self, option_key: OptionKey, value: Any
    ) -> None:
        """Set a program option, falling back from active to selected program."""
        try:
            with contextlib.suppress(ActiveProgramNotSetError):
                await self.coordinator.client.set_active_program_option(
                    self.appliance.info.ha_id, option_key=option_key, value=value
                )
                return

            await self.coordinator.client.set_selected_program_option(
                self.appliance.info.ha_id, option_key=option_key, value=value
            )
        except HomeConnectError as err:
            raise HomeAssistantError(
                translation_domain=DOMAIN,
                translation_key="set_option",
                translation_placeholders={"error": str(err)},
            ) from err


class HomeConnectOptionEntity(HomeConnectEntity):
    """Base for entities that expose program options."""

    @property
    def available(self) -> bool:
        """Return True if the option is currently exposed by the appliance."""
        return super().available and self.bsh_key in self.appliance.options

    @property
    def option_value(self) -> str | int | float | bool | None:
        """Return the current option value from the event stream."""
        if event := self.appliance.events.get(EventKey(self.bsh_key)):
            return event.value
        return None

    async def async_set_option(self, value: Any) -> None:
        """Set this option's value."""
        await super().async_set_option_with_key(self.bsh_key, value)

    @property
    def bsh_key(self) -> OptionKey:
        """Return the BSH option key for this entity."""
        return cast(OptionKey, self.entity_description.key)
