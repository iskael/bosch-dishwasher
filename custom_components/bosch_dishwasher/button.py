"""Button platform for the Bosch Dishwasher integration."""

from __future__ import annotations

from dataclasses import dataclass

from aiohomeconnect.model import CommandKey
from aiohomeconnect.model.error import HomeConnectError

from homeassistant.components.button import ButtonEntity, ButtonEntityDescription
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from .common import setup_home_connect_entry
from .const import DOMAIN
from .coordinator import (
    BoschDishwasherConfigEntry,
    HomeConnectApplianceCoordinator,
)
from .entity import HomeConnectEntity


STOP_PROGRAM_KEY = "stop_program"


@dataclass(frozen=True, kw_only=True)
class HomeConnectCommandButtonDescription(ButtonEntityDescription):
    """Describe a Home Connect command button."""

    command_key: CommandKey | None = None  # None → synthetic stop_program


COMMAND_BUTTONS: tuple[HomeConnectCommandButtonDescription, ...] = (
    HomeConnectCommandButtonDescription(
        key=CommandKey.BSH_COMMON_OPEN_DOOR.value,
        translation_key="open_door",
        command_key=CommandKey.BSH_COMMON_OPEN_DOOR,
    ),
    HomeConnectCommandButtonDescription(
        key=CommandKey.BSH_COMMON_PARTLY_OPEN_DOOR.value,
        translation_key="partly_open_door",
        command_key=CommandKey.BSH_COMMON_PARTLY_OPEN_DOOR,
    ),
    HomeConnectCommandButtonDescription(
        key=CommandKey.BSH_COMMON_PAUSE_PROGRAM.value,
        translation_key="pause_program",
        command_key=CommandKey.BSH_COMMON_PAUSE_PROGRAM,
    ),
    HomeConnectCommandButtonDescription(
        key=CommandKey.BSH_COMMON_RESUME_PROGRAM.value,
        translation_key="resume_program",
        command_key=CommandKey.BSH_COMMON_RESUME_PROGRAM,
    ),
)

STOP_BUTTON = HomeConnectCommandButtonDescription(
    key=STOP_PROGRAM_KEY,
    translation_key="stop_program",
    command_key=None,
)


def _get_entities(
    coordinator: HomeConnectApplianceCoordinator,
) -> list[HomeConnectEntity]:
    """Build the button list for a single dishwasher."""
    entities: list[HomeConnectEntity] = [
        HomeConnectCommandButton(coordinator, desc)
        for desc in COMMAND_BUTTONS
        if desc.command_key in coordinator.data.commands
    ]
    entities.append(HomeConnectStopProgramButton(coordinator, STOP_BUTTON))
    return entities


async def async_setup_entry(
    hass: HomeAssistant,
    entry: BoschDishwasherConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    """Set up the Bosch Dishwasher button platform."""
    setup_home_connect_entry(hass, entry, _get_entities, async_add_entities)


class _HomeConnectButtonBase(HomeConnectEntity, ButtonEntity):
    """Base class for Home Connect buttons."""

    entity_description: HomeConnectCommandButtonDescription

    def update_native_value(self) -> None:  # buttons have no native value
        """Buttons don't track a value."""


class HomeConnectCommandButton(_HomeConnectButtonBase):
    """Button that issues a Home Connect command (open door, pause, resume)."""

    async def async_press(self) -> None:
        """Send the command to the appliance."""
        if self.entity_description.command_key is None:
            return
        try:
            await self.coordinator.client.put_command(
                self.appliance.info.ha_id,
                command_key=self.entity_description.command_key,
                value=True,
            )
        except HomeConnectError as err:
            raise HomeAssistantError(
                translation_domain=DOMAIN,
                translation_key="press_command",
                translation_placeholders={"error": str(err)},
            ) from err


class HomeConnectStopProgramButton(_HomeConnectButtonBase):
    """Button that aborts the active program."""

    async def async_press(self) -> None:
        """Stop the active program."""
        try:
            await self.coordinator.client.stop_program(self.appliance.info.ha_id)
        except HomeConnectError as err:
            raise HomeAssistantError(
                translation_domain=DOMAIN,
                translation_key="stop_program",
                translation_placeholders={"error": str(err)},
            ) from err
