"""Select platform for the Bosch Dishwasher integration."""

from __future__ import annotations

from dataclasses import dataclass
import re

from aiohomeconnect.model import EventKey, ProgramKey
from aiohomeconnect.model.error import HomeConnectError

from homeassistant.components.select import SelectEntity, SelectEntityDescription
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


@dataclass(frozen=True, kw_only=True)
class HomeConnectSelectEntityDescription(SelectEntityDescription):
    """Describe a Home Connect program selector."""

    is_active: bool


PROGRAM_SELECTS: tuple[HomeConnectSelectEntityDescription, ...] = (
    HomeConnectSelectEntityDescription(
        key=EventKey.BSH_COMMON_ROOT_ACTIVE_PROGRAM.value,
        translation_key="active_program",
        is_active=True,
    ),
    HomeConnectSelectEntityDescription(
        key=EventKey.BSH_COMMON_ROOT_SELECTED_PROGRAM.value,
        translation_key="selected_program",
        is_active=False,
    ),
)


def _program_to_slug(value: str) -> str:
    """Convert a Home Connect program key to a snake_case slug.

    Matches the slug format used by HA core's home_connect integration so that
    strings.json state translations align correctly.

    Examples:
      Dishcare.Dishwasher.Program.Super60  -> dishcare_dishwasher_program_super_60
      Dishcare.Dishwasher.Program.AutoHalfLoad -> dishcare_dishwasher_program_auto_half_load
    """
    # Replace dots/dashes with underscores first.
    s = value.replace(".", "_").replace("-", "_")
    # Insert underscore between a lowercase letter and an uppercase letter (CamelCase split).
    s = re.sub(r"([a-z])([A-Z])", r"\1_\2", s)
    # Insert underscore between a run of uppercase letters and a following uppercase+lowercase.
    s = re.sub(r"([A-Z]+)([A-Z][a-z])", r"\1_\2", s)
    # Insert underscore between a letter and a digit sequence.
    s = re.sub(r"([a-zA-Z])(\d)", r"\1_\2", s)
    # Insert underscore between a digit sequence and a letter.
    s = re.sub(r"(\d)([a-zA-Z])", r"\1_\2", s)
    return s.lower()


def _get_entities(
    coordinator: HomeConnectApplianceCoordinator,
) -> list[HomeConnectEntity]:
    """Build the program selector entities for a single dishwasher."""
    return [HomeConnectProgramSelect(coordinator, desc) for desc in PROGRAM_SELECTS]


async def async_setup_entry(
    hass: HomeAssistant,
    entry: BoschDishwasherConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    """Set up the Bosch Dishwasher select platform."""
    setup_home_connect_entry(hass, entry, _get_entities, async_add_entities)


class HomeConnectProgramSelect(HomeConnectEntity, SelectEntity):
    """Select entity that exposes the active or selected program."""

    entity_description: HomeConnectSelectEntityDescription

    def update_native_value(self) -> None:
        """Recompute current option from cached events."""
        event_key = EventKey(self.entity_description.key)
        if event_key is EventKey.UNKNOWN:
            self._attr_current_option = None
            self._attr_options = []
            return

        event = self.appliance.events.get(event_key)
        if (
            event
            and isinstance(event.value, str)
            and event.value != ProgramKey.UNKNOWN.value
        ):
            self._attr_current_option = _program_to_slug(event.value)
        else:
            self._attr_current_option = None

        self._attr_options = sorted(
            _program_to_slug(program.key.value)
            for program in self.appliance.programs
            if program.key and program.key is not ProgramKey.UNKNOWN
        )

    async def async_select_option(self, option: str) -> None:
        """Set the active or selected program."""
        program_key = next(
            (
                program.key
                for program in self.appliance.programs
                if program.key and _program_to_slug(program.key.value) == option
            ),
            None,
        )
        if program_key is None:
            raise HomeAssistantError(
                translation_domain=DOMAIN,
                translation_key="unknown_program",
                translation_placeholders={"program": option},
            )
        try:
            if self.entity_description.is_active:
                await self.coordinator.client.start_program(
                    self.appliance.info.ha_id, program_key=program_key
                )
            else:
                await self.coordinator.client.set_selected_program(
                    self.appliance.info.ha_id, program_key=program_key
                )
        except HomeConnectError as err:
            raise HomeAssistantError(
                translation_domain=DOMAIN,
                translation_key="select_program",
                translation_placeholders={"error": str(err)},
            ) from err
