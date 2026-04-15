"""Shared platform setup helpers for the Bosch Dishwasher integration."""

from __future__ import annotations

from collections import defaultdict
from collections.abc import Callable
from functools import partial
from typing import cast

from aiohomeconnect.model import EventKey

from homeassistant.const import Platform
from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.entity import EntityDescription
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from .const import DOMAIN
from .coordinator import (
    BoschDishwasherConfigEntry,
    HomeConnectApplianceCoordinator,
    HomeConnectApplianceData,
)
from .entity import HomeConnectEntity


def should_add_option_entity(
    description: EntityDescription,
    appliance: HomeConnectApplianceData,
    entity_registry: er.EntityRegistry,
    platform: Platform,
) -> bool:
    """Return True if this option entity should be created for the appliance."""
    description_key = description.key
    return description_key in appliance.options or (
        entity_registry.async_get_entity_id(
            platform, DOMAIN, f"{appliance.info.ha_id}-{description_key}"
        )
        is not None
    )


def _create_option_entities(
    entity_registry: er.EntityRegistry,
    appliance_coordinator: HomeConnectApplianceCoordinator,
    known_entity_unique_ids: dict[str, str],
    get_option_entities_for_appliance: Callable[
        [HomeConnectApplianceCoordinator, er.EntityRegistry],
        list[HomeConnectEntity],
    ],
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    """Add any new option entities surfaced by a program change."""
    option_entities_to_add = [
        entity
        for entity in get_option_entities_for_appliance(
            appliance_coordinator, entity_registry
        )
        if entity.unique_id not in known_entity_unique_ids
    ]
    known_entity_unique_ids.update(
        {
            cast(str, entity.unique_id): appliance_coordinator.data.info.ha_id
            for entity in option_entities_to_add
        }
    )
    async_add_entities(option_entities_to_add)


def _handle_paired_or_connected_appliance(
    hass: HomeAssistant,
    entry: BoschDishwasherConfigEntry,
    known_entity_unique_ids: dict[str, str],
    get_entities_for_appliance: Callable[
        [HomeConnectApplianceCoordinator], list[HomeConnectEntity]
    ],
    get_option_entities_for_appliance: Callable[
        [HomeConnectApplianceCoordinator, er.EntityRegistry],
        list[HomeConnectEntity],
    ]
    | None,
    changed_options_listener_remove_callbacks: dict[str, list[Callable[[], None]]],
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    """Add entities for newly paired or reconnected dishwashers."""
    entities: list[HomeConnectEntity] = []
    entity_registry = er.async_get(hass)
    for appliance_coordinator in entry.runtime_data.appliance_coordinators.values():
        appliance_ha_id = appliance_coordinator.data.info.ha_id
        entities_to_add = [
            entity
            for entity in get_entities_for_appliance(appliance_coordinator)
            if entity.unique_id not in known_entity_unique_ids
        ]
        if get_option_entities_for_appliance:
            entities_to_add.extend(
                entity
                for entity in get_option_entities_for_appliance(
                    appliance_coordinator, entity_registry
                )
                if entity.unique_id not in known_entity_unique_ids
            )
            for event_key in (
                EventKey.BSH_COMMON_ROOT_ACTIVE_PROGRAM,
                EventKey.BSH_COMMON_ROOT_SELECTED_PROGRAM,
            ):
                remove_cb = appliance_coordinator.async_add_listener(
                    partial(
                        _create_option_entities,
                        entity_registry,
                        appliance_coordinator,
                        known_entity_unique_ids,
                        get_option_entities_for_appliance,
                        async_add_entities,
                    ),
                    event_key,
                )
                entry.async_on_unload(remove_cb)
                changed_options_listener_remove_callbacks[appliance_ha_id].append(
                    remove_cb
                )
        known_entity_unique_ids.update(
            {cast(str, e.unique_id): appliance_ha_id for e in entities_to_add}
        )
        entities.extend(entities_to_add)
    async_add_entities(entities)


def _handle_depaired_appliance(
    entry: BoschDishwasherConfigEntry,
    known_entity_unique_ids: dict[str, str],
    changed_options_listener_remove_callbacks: dict[str, list[Callable[[], None]]],
) -> None:
    """Drop tracking for an appliance that has been removed from the account."""
    for unique_id, appliance_id in known_entity_unique_ids.copy().items():
        if appliance_id not in entry.runtime_data.appliance_coordinators:
            known_entity_unique_ids.pop(unique_id, None)
            if appliance_id in changed_options_listener_remove_callbacks:
                for remove_cb in changed_options_listener_remove_callbacks.pop(
                    appliance_id
                ):
                    remove_cb()


def setup_home_connect_entry(
    hass: HomeAssistant,
    entry: BoschDishwasherConfigEntry,
    get_entities_for_appliance: Callable[
        [HomeConnectApplianceCoordinator], list[HomeConnectEntity]
    ],
    async_add_entities: AddConfigEntryEntitiesCallback,
    get_option_entities_for_appliance: Callable[
        [HomeConnectApplianceCoordinator, er.EntityRegistry],
        list[HomeConnectEntity],
    ]
    | None = None,
) -> None:
    """Wire up paired/depaired callbacks and add entities for existing appliances."""
    known_entity_unique_ids: dict[str, str] = {}
    changed_options_listener_remove_callbacks: dict[str, list[Callable[[], None]]] = (
        defaultdict(list)
    )

    # Add entities for appliances that are already known at setup time.
    # Without this, entities only appear after the next PAIRED/CONNECTED SSE event.
    _handle_paired_or_connected_appliance(
        hass,
        entry,
        known_entity_unique_ids,
        get_entities_for_appliance,
        get_option_entities_for_appliance,
        changed_options_listener_remove_callbacks,
        async_add_entities,
    )

    entry.async_on_unload(
        entry.runtime_data.async_add_global_listener(
            partial(
                _handle_paired_or_connected_appliance,
                hass,
                entry,
                known_entity_unique_ids,
                get_entities_for_appliance,
                get_option_entities_for_appliance,
                changed_options_listener_remove_callbacks,
                async_add_entities,
            ),
            (
                EventKey.BSH_COMMON_APPLIANCE_PAIRED,
                EventKey.BSH_COMMON_APPLIANCE_CONNECTED,
            ),
        )
    )
    entry.async_on_unload(
        entry.runtime_data.async_add_global_listener(
            partial(
                _handle_depaired_appliance,
                entry,
                known_entity_unique_ids,
                changed_options_listener_remove_callbacks,
            ),
            (EventKey.BSH_COMMON_APPLIANCE_DEPAIRED,),
        )
    )
