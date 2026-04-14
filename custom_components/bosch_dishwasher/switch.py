"""Switch platform for the Bosch Dishwasher integration."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from aiohomeconnect.model import EventKey, OptionKey, SettingKey
from aiohomeconnect.model.error import HomeConnectError

from homeassistant.components.switch import (
    SwitchEntity,
    SwitchEntityDescription,
)
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from .common import setup_home_connect_entry, should_add_option_entity
from .const import BSH_POWER_OFF, BSH_POWER_ON, DOMAIN
from .coordinator import (
    BoschDishwasherConfigEntry,
    HomeConnectApplianceCoordinator,
)
from .entity import HomeConnectEntity, HomeConnectOptionEntity


@dataclass(frozen=True, kw_only=True)
class HomeConnectSwitchEntityDescription(SwitchEntityDescription):
    """Describe a Home Connect switch."""


SETTING_SWITCHES: tuple[HomeConnectSwitchEntityDescription, ...] = (
    HomeConnectSwitchEntityDescription(
        key=SettingKey.BSH_COMMON_CHILD_LOCK.value,
        translation_key="child_lock",
    ),
)

POWER_SWITCH = HomeConnectSwitchEntityDescription(
    key=SettingKey.BSH_COMMON_POWER_STATE.value,
    translation_key="power",
)

OPTION_SWITCHES: tuple[HomeConnectSwitchEntityDescription, ...] = (
    HomeConnectSwitchEntityDescription(
        key=OptionKey.DISHCARE_DISHWASHER_INTENSIV_ZONE.value,
        translation_key="intensiv_zone",
    ),
    HomeConnectSwitchEntityDescription(
        key=OptionKey.DISHCARE_DISHWASHER_BRILLIANCE_DRY.value,
        translation_key="brilliance_dry",
    ),
    HomeConnectSwitchEntityDescription(
        key=OptionKey.DISHCARE_DISHWASHER_VARIO_SPEED_PLUS.value,
        translation_key="vario_speed_plus",
    ),
    HomeConnectSwitchEntityDescription(
        key=OptionKey.DISHCARE_DISHWASHER_SILENCE_ON_DEMAND.value,
        translation_key="silence_on_demand",
    ),
    HomeConnectSwitchEntityDescription(
        key=OptionKey.DISHCARE_DISHWASHER_HALF_LOAD.value,
        translation_key="half_load",
    ),
    HomeConnectSwitchEntityDescription(
        key=OptionKey.DISHCARE_DISHWASHER_EXTRA_DRY.value,
        translation_key="extra_dry",
    ),
    HomeConnectSwitchEntityDescription(
        key=OptionKey.DISHCARE_DISHWASHER_HYGIENE_PLUS.value,
        translation_key="hygiene_plus",
    ),
    HomeConnectSwitchEntityDescription(
        key=OptionKey.DISHCARE_DISHWASHER_ECO_DRY.value,
        translation_key="eco_dry",
    ),
    HomeConnectSwitchEntityDescription(
        key=OptionKey.DISHCARE_DISHWASHER_ZEOLITE_DRY.value,
        translation_key="zeolite_dry",
    ),
)


def _get_entities(
    coordinator: HomeConnectApplianceCoordinator,
) -> list[HomeConnectEntity]:
    """Build the always-on switch list for a single dishwasher."""
    entities: list[HomeConnectEntity] = [HomeConnectPowerSwitch(coordinator, POWER_SWITCH)]
    for desc in SETTING_SWITCHES:
        if SettingKey(desc.key) in coordinator.data.settings:
            entities.append(HomeConnectSettingSwitch(coordinator, desc))
    return entities


def _get_option_entities(
    coordinator: HomeConnectApplianceCoordinator,
    entity_registry: er.EntityRegistry,
) -> list[HomeConnectEntity]:
    """Build dishwasher option switches that the appliance currently exposes."""
    return [
        HomeConnectOptionSwitch(coordinator, desc)
        for desc in OPTION_SWITCHES
        if should_add_option_entity(
            desc, coordinator.data, entity_registry, Platform.SWITCH
        )
    ]


async def async_setup_entry(
    hass: HomeAssistant,
    entry: BoschDishwasherConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    """Set up the Bosch Dishwasher switch platform."""
    setup_home_connect_entry(
        hass,
        entry,
        _get_entities,
        async_add_entities,
        _get_option_entities,
    )


class HomeConnectSettingSwitch(HomeConnectEntity, SwitchEntity):
    """Switch backed by a boolean Home Connect setting (e.g. child lock)."""

    entity_description: HomeConnectSwitchEntityDescription

    def update_native_value(self) -> None:
        """Recompute on/off from the cached setting."""
        try:
            setting = self.appliance.settings.get(SettingKey(self.bsh_key))
        except ValueError:
            setting = None
        self._attr_is_on = bool(setting.value) if setting else None

    async def async_turn_on(self, **kwargs: Any) -> None:
        """Turn the setting on."""
        await self._async_set(True)

    async def async_turn_off(self, **kwargs: Any) -> None:
        """Turn the setting off."""
        await self._async_set(False)

    async def _async_set(self, value: bool) -> None:
        try:
            await self.coordinator.client.set_setting(
                self.appliance.info.ha_id,
                setting_key=SettingKey(self.bsh_key),
                value=value,
            )
        except HomeConnectError as err:
            raise HomeAssistantError(
                translation_domain=DOMAIN,
                translation_key="set_setting",
                translation_placeholders={"error": str(err)},
            ) from err


class HomeConnectPowerSwitch(HomeConnectEntity, SwitchEntity):
    """Power switch — translates an enum power-state setting to a bool toggle."""

    entity_description: HomeConnectSwitchEntityDescription

    def update_native_value(self) -> None:
        """Recompute is_on based on power-state enum value."""
        setting = self.appliance.settings.get(SettingKey.BSH_COMMON_POWER_STATE)
        self._attr_is_on = setting is not None and setting.value == BSH_POWER_ON

    async def async_turn_on(self, **kwargs: Any) -> None:
        """Power on."""
        await self._async_set_power(BSH_POWER_ON)

    async def async_turn_off(self, **kwargs: Any) -> None:
        """Power off."""
        await self._async_set_power(BSH_POWER_OFF)

    async def _async_set_power(self, value: str) -> None:
        try:
            await self.coordinator.client.set_setting(
                self.appliance.info.ha_id,
                setting_key=SettingKey.BSH_COMMON_POWER_STATE,
                value=value,
            )
        except HomeConnectError as err:
            raise HomeAssistantError(
                translation_domain=DOMAIN,
                translation_key="set_power",
                translation_placeholders={"error": str(err)},
            ) from err


class HomeConnectOptionSwitch(HomeConnectOptionEntity, SwitchEntity):
    """Switch backed by a boolean program option (e.g. ExtraDry, HalfLoad)."""

    entity_description: HomeConnectSwitchEntityDescription

    def update_native_value(self) -> None:
        """Recompute is_on from the cached option event."""
        value = self.option_value
        self._attr_is_on = bool(value) if value is not None else None

    async def async_turn_on(self, **kwargs: Any) -> None:
        """Turn the option on."""
        await self.async_set_option(True)

    async def async_turn_off(self, **kwargs: Any) -> None:
        """Turn the option off."""
        await self.async_set_option(False)
