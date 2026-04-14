# Bosch Dishwasher Card — Design Spec

**Date:** 2026-04-14  
**Status:** Approved

---

## Context

Home Assistant doesn't provide a native card that visually represents the state of a Bosch dishwasher in a meaningful way. The default entity cards show raw sensor values without context. This custom card consolidates all dishwasher entities into a single, visually rich card with a dark industrial aesthetic, animated state feedback, and inline controls.

---

## Architecture

### Technology
- **LitElement** — single `.js` file, no bundler required. Lit imported via CDN (`https://unpkg.com/lit`).
- **No build step** for development — edit file, reload browser.

### File structure
```
bosch-dishwasher-card.js   # single deliverable, goes in config/www/
```

### Installation
1. Copy `bosch-dishwasher-card.js` to `<HA config>/www/`
2. Register in HA dashboard: Settings → Dashboards → Resources → Add `/local/bosch-dishwasher-card.js` (type: JavaScript module)
3. Add card to dashboard YAML

### Card YAML config
```yaml
type: custom:bosch-dishwasher-card
entity_prefix: lavavajillas   # required — prefix for all entity IDs
name: Lavavajillas            # optional — overrides card title
```

The card auto-constructs all entity IDs from the prefix:
- `switch.{prefix}_power`
- `switch.{prefix}_silence_on_demand`
- `switch.{prefix}_vario_speed`
- `select.{prefix}_active_program`
- `select.{prefix}_selected_program`
- `button.{prefix}_stop_program`
- `sensor.{prefix}_door`
- `sensor.{prefix}_operation_state`
- `sensor.{prefix}_program_aborted`
- `sensor.{prefix}_program_finish_time`
- `sensor.{prefix}_program_finished`
- `sensor.{prefix}_program_progress`
- `binary_sensor.{prefix}_remote_control`
- `binary_sensor.{prefix}_remote_start`
- `sensor.{prefix}_rinse_aid_nearly_empty`
- `sensor.{prefix}_salt_nearly_empty`

---

## Visual Design

### Style
- **Theme:** Dark Industrial
- **Background:** `#0d1117`
- **Surface/cards:** `#161b22`
- **Borders:** `#21262d` / `#30363d`
- **Primary accent:** `#00b4d8` (cyan)
- **Secondary accent:** `#0077b6` (deep cyan)
- **Text primary:** `#e6edf3`
- **Text secondary:** `#8b949e`
- **Warning:** `#f59e0b`
- **Success:** `#34d399`
- **Danger:** `#ef4444`

---

## Layout — Compact (Horizontal)

```
┌─────────────────────────────────────────────────────┐
│  [ANIM]  Lavavajillas              [RUNNING badge]  │
│  48×48   Eco 50° · 42 min restantes                 │
│          ████████████░░░░░░ 65%                     │
├─────────────────────────────────────────────────────┤
│  🚪 Puerta: Cerrada   │  🧂 Sal: ⚠ Bajo            │
│  💧 Abrillantador: OK │  📡 Remoto: ON              │
├─────────────────────────────────────────────────────┤
│  CONTROLES                                          │
│  [⏻ Power]  [Eco 50° ▾]  [⏹ STOP]                 │
│  [⚡ TURBO toggle]  [🔇 SILENCIO toggle]            │
└─────────────────────────────────────────────────────┘
```

---

## Animation

### Running state (`operation_state = "Run"`)
- **SVG spray arm:** horizontal bar rotating 360° (`@keyframes spin`, 2s linear infinite)
- **Nozzles:** two small ellipses at arm ends, pulsing opacity (`@keyframes spray`, 1s ease-in-out, offset 0.5s between them)
- **Icon background:** `box-shadow: 0 0 8px #00b4d8` pulsing glow (`@keyframes pulse-glow`, 2s)
- **Running badge:** `● RUNNING` with blinking dot (`@keyframes blink`, 1s step-end infinite)

### Other states
| `operation_state` | Animation | Badge | Color |
|-------------------|-----------|-------|-------|
| `Run` | Spray arm spinning + glow | `● RUNNING` | cyan |
| `Finished` | Static icon, full opacity | `✓ FINISHED` | green (`#34d399`) |
| `Ready` / `Off` / `Inactive` | Static icon, 40% opacity | `IDLE` / `OFF` | grey |
| `Aborting` | Static icon, 40% opacity | `⚠ ABORTED` | red (`#ef4444`) |

> **Note:** Verify actual `operation_state` values from your HA instance — the Bosch integration may use `"Run"`, `"Running"`, or lowercase variants. Check with Developer Tools → States before implementing the conditional logic.

---

## Sensors Grid

| Sensor | Entity | Warning condition |
|--------|--------|-------------------|
| 🚪 Puerta | `sensor.{prefix}_door` | State = `Open` → amber |
| 🧂 Sal | `sensor.{prefix}_salt_nearly_empty` | State `"on"` or `"true"` → amber + ⚠ |
| 💧 Abrillantador | `sensor.{prefix}_rinse_aid_nearly_empty` | State `"on"` or `"true"` → amber + ⚠ |
| 📡 Remoto | `binary_sensor.{prefix}_remote_control` | None |

---

## Controls (always visible)

**Row 1:**
- **Power toggle** (`switch.{prefix}_power`) — calls `switch.toggle`
- **Program selector** (`select.{prefix}_selected_program`) — `<select>` styled dropdown, calls `select.select_option`
- **Stop button** (`button.{prefix}_stop_program`) — red, calls `button.press`. Disabled when not running.

**Row 2:**
- **Turbo toggle** (`switch.{prefix}_vario_speed`) — calls `switch.toggle`
- **Silence toggle** (`switch.{prefix}_silence_on_demand`) — calls `switch.toggle`

The active program (`select.{prefix}_active_program`) is shown as read-only text in the header, not as a control.

---

## LitElement Implementation Pattern

```js
import { LitElement, html, css } from 'https://unpkg.com/lit?module';

class BoschDishwasherCard extends LitElement {
  static properties = { hass: {}, config: {} };

  setConfig(config) {
    if (!config.entity_prefix) throw new Error('entity_prefix is required');
    this.config = config;
  }

  getCardSize() { return 4; }

  // helpers — full entity_id must include domain
  _entity(domain, suffix) {
    return this.hass.states[`${domain}.${this.config.entity_prefix}_${suffix}`];
  }
  _call(domain, service, entity_id, data = {}) {
    this.hass.callService(domain, service, { entity_id, ...data });
  }

  render() { /* template */ }
  static styles = css`/* dark industrial styles */`;
}

customElements.define('bosch-dishwasher-card', BoschDishwasherCard);
```

---

## Verification

1. Copy `bosch-dishwasher-card.js` to `config/www/`
2. Register as JS module resource in HA
3. Add card with `entity_prefix: lavavajillas` to a dashboard
4. Verify all sensor values display correctly
5. Start a wash cycle → confirm spray arm animation activates
6. Verify progress bar updates in real time
7. Confirm Stop button calls `button.press` on `button.lavavajillas_stop_program`
8. Toggle Power, Turbo, Silence and verify switch state changes in HA
9. Select a program and verify `select.select_option` is called
10. Open door → confirm 🚪 row shows warning color
