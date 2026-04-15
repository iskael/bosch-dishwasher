"""The Bosch Dishwasher integration."""

from __future__ import annotations

import logging
import os

import aiohttp
from aiohomeconnect.client import Client as HomeConnectClient

from homeassistant.components.http import StaticPathConfig
from homeassistant.const import EVENT_HOMEASSISTANT_STARTED, Platform
from homeassistant.core import Event, HomeAssistant
from homeassistant.exceptions import ConfigEntryAuthFailed, ConfigEntryNotReady
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers.config_entry_oauth2_flow import (
    ImplementationUnavailableError,
    OAuth2Session,
    async_get_config_entry_implementation,
)
from homeassistant.loader import async_get_integration

from .api import AsyncConfigEntryAuth
from .const import CARD_URL, DOMAIN, PLATFORMS
from .coordinator import (
    BoschDishwasherConfigEntry,
    HomeConnectRuntimeData,
)

_LOGGER = logging.getLogger(__name__)

_CARD_REGISTERED_KEY = f"{DOMAIN}_card_registered"
_LOVELACE_RESOURCE_KEY = f"{DOMAIN}_resource_added"
_ICON_URL = f"/api/{DOMAIN}/icon.png"

# Matches manifest.json version — bump together.
_CARD_VERSION = "0.1.2"


async def async_setup(hass: HomeAssistant, config: dict) -> bool:
    """Set up the Bosch Dishwasher component (YAML not supported)."""
    return True


async def async_setup_entry(
    hass: HomeAssistant, entry: BoschDishwasherConfigEntry
) -> bool:
    """Set up Bosch Dishwasher from a config entry."""
    try:
        implementation = await async_get_config_entry_implementation(hass, entry)
    except ImplementationUnavailableError as err:
        raise ConfigEntryNotReady from err

    session = OAuth2Session(hass, entry, implementation)
    auth = AsyncConfigEntryAuth(hass, session)
    try:
        await auth.async_get_access_token()
    except aiohttp.ClientResponseError as err:
        if 400 <= err.status < 500:
            raise ConfigEntryAuthFailed from err
        raise ConfigEntryNotReady from err
    except aiohttp.ClientError as err:
        raise ConfigEntryNotReady from err

    runtime = HomeConnectRuntimeData(hass, entry, HomeConnectClient(auth))
    await runtime.setup_appliance_coordinators()
    entry.runtime_data = runtime

    appliance_identifiers = {
        (DOMAIN, ha_id) for ha_id in runtime.appliance_coordinators
    }
    device_registry = dr.async_get(hass)
    for device in dr.async_entries_for_config_entry(device_registry, entry.entry_id):
        if not device.identifiers.intersection(appliance_identifiers):
            device_registry.async_update_device(
                device.id, remove_config_entry_id=entry.entry_id
            )

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

    for coordinator in runtime.appliance_coordinators.values():
        entry.async_create_background_task(
            hass,
            coordinator.async_refresh(),
            f"{DOMAIN}-initial-refresh-{coordinator.data.info.ha_id}",
        )

    runtime.start_event_listener()

    await _async_register_frontend_card(hass)

    return True


async def async_unload_entry(
    hass: HomeAssistant, entry: BoschDishwasherConfigEntry
) -> bool:
    """Unload a Bosch Dishwasher config entry."""
    await entry.runtime_data.async_shutdown()
    return await hass.config_entries.async_unload_platforms(entry, PLATFORMS)


async def async_migrate_entry(
    hass: HomeAssistant, entry: BoschDishwasherConfigEntry
) -> bool:
    """Migrate old entries forward."""
    _LOGGER.debug("Migrating from version %s.%s", entry.version, entry.minor_version)
    return True


async def _async_register_frontend_card(hass: HomeAssistant) -> None:
    """Register the static path that serves the Lovelace card bundle."""
    if hass.data.get(_CARD_REGISTERED_KEY):
        return

    card_path = hass.config.path(
        f"custom_components/{DOMAIN}/www/bosch-dishwasher-card.js"
    )
    if not os.path.exists(card_path):
        _LOGGER.warning(
            "Bosch Dishwasher card bundle not found at %s; the integration will "
            "still work but the Lovelace card will not be available",
            card_path,
        )
        hass.data[_CARD_REGISTERED_KEY] = True
        return

    try:
        await hass.http.async_register_static_paths(
            [StaticPathConfig(CARD_URL, card_path, cache_headers=False)]
        )
    except (RuntimeError, ValueError) as err:
        _LOGGER.debug("Static path for card already registered: %s", err)

    hass.data[_CARD_REGISTERED_KEY] = True

    # Also register the integration icon so it shows in the HA UI.
    icon_path = hass.config.path(f"custom_components/{DOMAIN}/icon.png")
    if os.path.exists(icon_path):
        try:
            await hass.http.async_register_static_paths(
                [StaticPathConfig(_ICON_URL, icon_path, cache_headers=True)]
            )
        except (RuntimeError, ValueError):
            pass

    # Schedule Lovelace resource registration — defer until HA is fully started
    # so that hass.data["lovelace"]["resources"] is guaranteed to be available.
    if hass.is_running:
        await _async_register_lovelace_resource(hass)
    else:
        async def _on_started(event: Event) -> None:
            await _async_register_lovelace_resource(hass)

        hass.bus.async_listen_once(EVENT_HOMEASSISTANT_STARTED, _on_started)


async def _async_register_lovelace_resource(hass: HomeAssistant) -> None:
    """Auto-add the card as a Lovelace resource so users don't have to."""
    # Guard: skip if already registered in this HA session.
    if hass.data.get(_LOVELACE_RESOURCE_KEY):
        return

    try:
        await async_get_integration(hass, "lovelace")
    except Exception:  # noqa: BLE001
        _LOGGER.debug("Lovelace integration not available; skipping resource registration")
        return

    # In HA ≥ 2024.11 hass.data["lovelace"] is a LovelaceData dataclass
    # (attribute access), not a dict. Fall back to dict-style for older cores.
    lovelace_data = hass.data.get("lovelace")
    resources = getattr(lovelace_data, "resources", None)
    if resources is None and isinstance(lovelace_data, dict):
        resources = lovelace_data.get("resources")

    if resources is None:
        _LOGGER.warning(
            "Lovelace resource store not available; add %s manually as a "
            "JavaScript module in Settings → Dashboards → Resources",
            CARD_URL,
        )
        return

    # YAML-mode dashboards use ResourceYAMLCollection which has no
    # async_create_item — tell the user and bail out cleanly.
    if not hasattr(resources, "async_create_item"):
        _LOGGER.warning(
            "Lovelace is in YAML mode; add the card resource to your YAML: "
            "url: %s?v=%s, type: module",
            CARD_URL,
            _CARD_VERSION,
        )
        hass.data[_LOVELACE_RESOURCE_KEY] = True
        return

    try:
        await resources.async_load()
        existing = [r for r in resources.async_items() if CARD_URL in r.get("url", "")]
        if existing:
            _LOGGER.debug("Lovelace resource %s already registered", CARD_URL)
            hass.data[_LOVELACE_RESOURCE_KEY] = True
            return

        await resources.async_create_item(
            {"res_type": "module", "url": f"{CARD_URL}?v={_CARD_VERSION}"}
        )
        hass.data[_LOVELACE_RESOURCE_KEY] = True
        _LOGGER.info(
            "Bosch Dishwasher card registered as Lovelace resource at %s", CARD_URL
        )
    except Exception as err:  # noqa: BLE001
        _LOGGER.warning(
            "Could not auto-register Lovelace resource for the Bosch Dishwasher card "
            "(%s). Add it manually: URL=%s?v=%s, Type=JavaScript module. Error: %s",
            CARD_URL,
            CARD_URL,
            _CARD_VERSION,
            err,
        )
