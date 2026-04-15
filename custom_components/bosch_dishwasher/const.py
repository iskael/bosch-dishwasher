"""Constants for the Bosch Dishwasher integration."""

from __future__ import annotations

from homeassistant.const import Platform

DOMAIN = "bosch_dishwasher"

PLATFORMS: list[Platform] = [
    Platform.BINARY_SENSOR,
    Platform.BUTTON,
    Platform.SELECT,
    Platform.SENSOR,
    Platform.SWITCH,
]

DISHWASHER_APPLIANCE_TYPE = "Dishwasher"

API_DEFAULT_RETRY_AFTER = 60

# Frontend card resource URL
CARD_URL = "/api/bosch_dishwasher/card.js"

# BSH Common enum values
BSH_POWER_ON = "BSH.Common.EnumType.PowerState.On"
BSH_POWER_OFF = "BSH.Common.EnumType.PowerState.Off"
BSH_POWER_STANDBY = "BSH.Common.EnumType.PowerState.Standby"

BSH_OPERATION_STATE_INACTIVE = "BSH.Common.EnumType.OperationState.Inactive"
BSH_OPERATION_STATE_READY = "BSH.Common.EnumType.OperationState.Ready"
BSH_OPERATION_STATE_DELAYED_START = "BSH.Common.EnumType.OperationState.DelayedStart"
BSH_OPERATION_STATE_RUN = "BSH.Common.EnumType.OperationState.Run"
BSH_OPERATION_STATE_PAUSE = "BSH.Common.EnumType.OperationState.Pause"
BSH_OPERATION_STATE_ACTION_REQUIRED = "BSH.Common.EnumType.OperationState.ActionRequired"
BSH_OPERATION_STATE_FINISHED = "BSH.Common.EnumType.OperationState.Finished"
BSH_OPERATION_STATE_ERROR = "BSH.Common.EnumType.OperationState.Error"
BSH_OPERATION_STATE_ABORTING = "BSH.Common.EnumType.OperationState.Aborting"

BSH_DOOR_STATE_OPEN = "BSH.Common.EnumType.DoorState.Open"
BSH_DOOR_STATE_CLOSED = "BSH.Common.EnumType.DoorState.Closed"
BSH_DOOR_STATE_LOCKED = "BSH.Common.EnumType.DoorState.Locked"

BSH_EVENT_STATE_PRESENT = "BSH.Common.EnumType.EventPresentState.Present"
BSH_EVENT_STATE_CONFIRMED = "BSH.Common.EnumType.EventPresentState.Confirmed"
BSH_EVENT_STATE_OFF = "BSH.Common.EnumType.EventPresentState.Off"
