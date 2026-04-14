# Bosch Dishwasher Card

Custom Home Assistant Lovelace card for Bosch dishwashers. Dark industrial UI with animated spray arm, sensor grid, and inline controls.

## Installation

1. Copy `bosch-dishwasher-card.js` to your HA config's `www/` directory:
   ```
   config/www/bosch-dishwasher-card.js
   ```

2. Register as a dashboard resource:  
   Settings → Dashboards → ⋮ → Resources → Add  
   - URL: `/local/bosch-dishwasher-card.js`  
   - Type: JavaScript module

3. Add to a dashboard (Manual card):
   ```yaml
   type: custom:bosch-dishwasher-card
   entity_prefix: lavavajillas
   name: Lavavajillas
   ```

## Configuration

| Option | Required | Description |
|--------|----------|-------------|
| `entity_prefix` | Yes | Prefix shared by all dishwasher entities (e.g. `lavavajillas`) |
| `name` | No | Card title. Defaults to `entity_prefix`. |

## Required Entities

The card expects these entities to exist, where `{prefix}` is your `entity_prefix`:

| Entity | Description |
|--------|-------------|
| `switch.{prefix}_power` | Power on/off |
| `switch.{prefix}_silence_on_demand` | Silence mode |
| `switch.{prefix}_vario_speed` | Turbo (Vario Speed+) |
| `select.{prefix}_active_program` | Currently running program (read-only) |
| `select.{prefix}_selected_program` | Program selector |
| `button.{prefix}_stop_program` | Stop button |
| `sensor.{prefix}_door` | Door state (`Closed` / `Open`) |
| `sensor.{prefix}_operation_state` | Run / Ready / Finished / Aborting |
| `sensor.{prefix}_program_progress` | 0–100 |
| `sensor.{prefix}_program_finish_time` | Estimated finish time |
| `sensor.{prefix}_salt_nearly_empty` | `on` when low |
| `sensor.{prefix}_rinse_aid_nearly_empty` | `on` when low |
| `binary_sensor.{prefix}_remote_control` | Remote control enabled |

## Local Development

```bash
# Serve locally (required — file:// doesn't work with ES modules)
python3 -m http.server 8080
# Open http://localhost:8080/dev/test.html
```

Use the scenario buttons to simulate Running / Idle / Finished / Aborted / Warnings states.
