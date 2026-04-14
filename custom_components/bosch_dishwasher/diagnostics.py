"""Diagnostics support for the Bosch Dishwasher integration."""

from __future__ import annotations

from typing import Any

from homeassistant.components.diagnostics import async_redact_data
from homeassistant.core import HomeAssistant

from .coordinator import BoschDishwasherConfigEntry

TO_REDACT = {
    "access_token",
    "refresh_token",
    "client_id",
    "client_secret",
    "haId",
    "ha_id",
    "serial_number",
    "serialnumber",
    "mac",
    "ip_address",
}


async def async_get_config_entry_diagnostics(
    hass: HomeAssistant, entry: BoschDishwasherConfigEntry
) -> dict[str, Any]:
    """Return redacted diagnostics for a config entry."""
    runtime = entry.runtime_data
    appliances: list[dict[str, Any]] = []
    for ha_id, coord in runtime.appliance_coordinators.items():
        data = coord.data
        appliances.append(
            {
                "ha_id": ha_id,
                "type": data.info.type,
                "brand": data.info.brand,
                "vib": data.info.vib,
                "connected": data.info.connected,
                "settings_count": len(data.settings),
                "status_count": len(data.status),
                "events_count": len(data.events),
                "commands_count": len(data.commands),
                "programs_count": len(data.programs),
                "options_count": len(data.options),
                "last_update_success": coord.last_update_success,
            }
        )

    payload = {
        "entry": {
            "title": entry.title,
            "version": entry.version,
            "domain": entry.domain,
        },
        "appliance_count": len(appliances),
        "appliances": appliances,
    }
    return async_redact_data(payload, TO_REDACT)
