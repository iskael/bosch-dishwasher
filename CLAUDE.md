# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build step

Source lives in `src/bosch-dishwasher-card.js` — **this is what you edit**. The root `bosch-dishwasher-card.js` is a build artifact produced by esbuild (Lit is bundled in, no CDN).

```bash
npm install                 # one-time
npm run build               # minified ESM bundle → ./bosch-dishwasher-card.js
npm run build:dev           # sourcemapped, non-minified (for dev/test.html)
```

**Never hand-edit the root `bosch-dishwasher-card.js`.** `dev/test.html` loads it, so after editing the source you must rebuild to see changes. Commit the rebuilt bundle alongside source changes — HACS downloads from `main`, not release assets.

## Development

```bash
# Local dev server (required — file:// blocks ES module imports)
python3 -m http.server 8080
# Open http://localhost:8080/dev/test.html
```

`dev/test.html` has 5 scenario buttons (Running / Idle / Finished / Aborted / Warnings) that swap a mock `hass` object. Use the browser console to verify `callService` calls when clicking controls.

After deploying a new version of `bosch-dishwasher-card.js` to HA, browsers aggressively cache the resource — either hard refresh (Cmd+Shift+R) or bump the resource URL version query (`/local/bosch-dishwasher-card.js?v=N`).

## Architecture

**Source file:** `src/bosch-dishwasher-card.js` — a LitElement custom element registered as `bosch-dishwasher-card`. Lit is imported as `from 'lit'` and bundled by esbuild into the root `bosch-dishwasher-card.js`.

**Entity ID convention:** All entity IDs are constructed from `entity_prefix` config:
```
${domain}.${entity_prefix}_${suffix}
```
e.g. `sensor.lavavajillas_operation_state`. The helpers `_entity(domain, suffix)`, `_state(domain, suffix)`, `_attr(domain, suffix, attr)`, and `_call(domain, service, suffix, data)` encapsulate this pattern — never construct entity IDs directly in templates.

**render() pattern:** All derived state is computed as `const` variables at the top of `render()` before the template. Never call `_state()` / `_isWarning()` / etc. inline inside the lit-html template — this breaks the established pattern and causes double evaluation.

**Re-render filtering (`shouldUpdate`):** HA fires a `hass` property update for *every* entity change in the system, not just ours. `shouldUpdate(changedProps)` compares the state-object references of the entities listed in `_watchedEntities()` (returns `false` if none changed). HA produces new state objects on every update, so reference equality is sufficient — no deep comparison needed. **When you add a new entity to the card, add it to `_watchedEntities()` or the card will look stale.**

**State helpers:**
- `_operationState()` → lowercased string from `sensor.{prefix}_operation_state`
- `_isRunning()` → `true` for `'run'` or `'running'`
- `_badge()` → `{text, cls}` for the status badge; unknown states surface as `s.toUpperCase()` (not silently as IDLE)
- `_isDoorOpen()` → `true` when door state is `'open'`
- `_isWarning(domain, suffix)` → `true` for state `'on'` or `'true'` (used for salt/rinse aid)
- `_finishTime()` → raw string from `program_finish_time`, or `null` if `'0'`/unavailable. **Check the actual HA sensor format** — if it returns an ISO timestamp or epoch instead of a human-readable string, format it here.

**Program labels:** The Home Connect integration exposes program keys like `dishcare_dishwasher_program_eco_50`. The module-level `PROGRAM_NAMES` map + `programLabel(key)` function translate them to human-readable strings (e.g. `'Eco 50°C'`). `programLabel` is used both for the header display and for the `<select>` options. It has an early-return guard: for `null` / `'unavailable'` / `'unknown'` it returns the key as-is — the header caller adds a second layer to show `'Detenido'` instead.

**Header program resolution:** `displayProgram` prefers `active_program`, falls back to `selected_program` when active is `unavailable` **or** `'unknown'` (the Bosch integration uses `unknown` when idle), and finally shows `'Detenido'` if both are unusable.

**Silence button (`silence_on_demand`):** The Bosch integration reports this switch as `unavailable` while the dishwasher is off/idle — it only becomes controllable mid-cycle. The button must stay disabled (`silenceAvailable` const) when the state is `unavailable`, otherwise users see a toggle that does nothing.

## Dishwasher SVG illustration (`_renderDishwasher`)

Inline 72×100 SVG in the card header — front view inspired by Bosch Series 6 (no branding / trademarks). State is passed in (`'running' | 'finished' | 'aborted' | 'idle'`) and drives CSS animations via a class on the `<svg>`:

- **running** → cyan LED pulse (`led-pulse`), blinking digital display (`blink-text`), 6 falling water drops with staggered `animation-delay` (`drop-fall`)
- **finished** → steady green LED, `"DONE"` on display
- **aborted** → steady red LED, `"STOP"` on display
- **idle** → `opacity: 0.55`, grey LED, no animation

All animation is pure CSS on elements referenced by class — no JS timers. `content-visibility: auto` on `ha-card` pauses paint/compositing when the card scrolls off-screen, so animations don't waste cycles.

**Do not add external image assets.** The SVG is intentionally self-contained so the card is still a single-file deliverable. If you need to modify the illustration, edit the SVG markup inside `_renderDishwasher()` directly.

## Consumed entities (verified against live HA)

The card expects these entities on `sensor.{prefix}_*` / `switch.{prefix}_*` / etc.:

| Domain | Suffix | Notes |
|--------|--------|-------|
| `switch` | `power` | Power toggle |
| `switch` | `vario_speed` | Turbo |
| `switch` | `silence_on_demand` | `unavailable` when idle |
| `switch` | `extra_dry` | Extra dry option |
| `switch` | `half_load` | Half load option |
| `select` | `active_program` | Read-only; `'unknown'` when idle |
| `select` | `selected_program` | Header fallback + dropdown source |
| `sensor` | `door` | `'open'` / `'closed'` |
| `sensor` | `operation_state` | `'run'` / `'ready'` / `'finished'` / `'aborting'` / ... |
| `sensor` | `program_progress` | 0–100 or `'unavailable'` |
| `sensor` | `program_finish_time` | human-readable string or `'unavailable'` |
| `sensor` | `salt_nearly_empty` | `'on'` → warning |
| `sensor` | `rinse_aid_nearly_empty` | `'on'` → warning |
| `binary_sensor` | `remote_control` | Remote enable indicator |
| `button` | `stop_program` | Stop button (press service) |

**Live-HA verification tip:** `sensor.{prefix}_operation_state` may return variants (`'run'` vs `'running'`, etc.) depending on Home Connect firmware. `_isRunning()` and `_badge()` currently handle both — extend them if you see new strings in HA Developer Tools → States.

## HA Installation & dashboard width

1. Copy `bosch-dishwasher-card.js` → `<HA config>/www/`
2. Register resource: Settings → Dashboards → ⋮ → Resources → `/local/bosch-dishwasher-card.js` (JavaScript module)
3. Add card:
```yaml
type: custom:bosch-dishwasher-card
entity_prefix: lavavajillas
name: Lavavajillas
```

**Full-width on Sections layout (HA 2024.3+):** add `grid_columns: full` to the card config.

**Full-width on Masonry layout:** wrap the card in a single-column `grid`:
```yaml
type: grid
columns: 1
cards:
  - type: custom:bosch-dishwasher-card
    entity_prefix: lavavajillas
    name: Lavavajillas
```
