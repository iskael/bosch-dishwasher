# Bosch Dishwasher Card

Home Assistant Lovelace card for Bosch dishwashers via the Home Connect integration. Dark industrial UI with an animated spray arm, status badge, sensor tiles, and inline program/option controls.

![preview](https://raw.githubusercontent.com/iskael/bosch-dishwasher/main/docs/images/card-running.png)

## Features

- Animated SVG illustration that reacts to operation state (door, running, warnings)
- State-driven status badge (Running / Ready / Finished / Aborting / unknown states surfaced verbatim)
- Sensor tiles for door, progress, finish time, salt and rinse aid levels
- Inline controls: power, program selector, stop, Silence on Demand, Vario Speed, Extra Dry, Half Load
- Responsive, dark industrial theme tuned for wall-mounted dashboards

## ⚠️ Prerequisites — Home Connect integration

This card is a UI layer on top of the official Home Assistant **Home Connect** integration. **The integration must be installed, authorized, and paired with your Bosch dishwasher before installing the card.** Without it, none of the `sensor.{prefix}_*` / `switch.{prefix}_*` entities the card reads from will exist.

Authoritative docs: https://www.home-assistant.io/integrations/home_connect/

End-to-end checklist (defer to the HA docs if anything diverges):

1. **Register a Home Connect Developer Portal application** (one-time):
   - Sign up at https://developer.home-connect.com using the **same lowercase email** as your Bosch Home Connect mobile app.
   - Create an application with OAuth flow **Authorization Code Grant Flow** and redirect URI `https://my.home-assistant.io/redirect/oauth`.
   - Save the **Client ID** and **Client Secret**.
2. **Add Application Credentials in Home Assistant**: Settings → Devices & Services → ⋮ → Application Credentials → Add application → pick *Home Connect* → paste Client ID and Secret.
3. **Add the Home Connect integration**: Settings → Devices & Services → Add Integration → *Home Connect* → complete the OAuth flow in the browser.
4. **Pair the dishwasher in the Home Connect mobile app first** if it isn't already — the HA integration only sees appliances visible to your Home Connect account.
5. **Verify entities exist**: Developer Tools → States → search for `operation_state`. You should see `sensor.<something>_operation_state`. The `<something>` part is your **`entity_prefix`** for the card config.

The Home Connect integration currently supports **one Home Connect account per HA instance**.

The card reads the subset of entities the integration exposes for dishwashers (operation state, door, program progress, finish time, salt / rinse aid warnings, active and selected program, power, and the option switches for Vario Speed, Silence on Demand, Extra Dry and Half Load). Additional dishwasher options some models expose (Intensiv Zone, Brilliance Dry, Hygiene Plus, Eco Dry, Zeolite Dry) are **not** surfaced by this card — use a separate entities card alongside it if you need them.

## Installation via HACS (Custom Repository)

1. Make sure [HACS](https://hacs.xyz) is installed.
2. HACS → Frontend → ⋮ (top right) → **Custom repositories**.
3. Repository: `https://github.com/iskael/bosch-dishwasher`, Category: **Lovelace**.
4. Click **Add** → find "Bosch Dishwasher Card" in the list → **Download** → restart / refresh if prompted.
5. HACS registers the resource automatically. If the custom element is not found, hard refresh the dashboard (Cmd/Ctrl+Shift+R).

## Manual installation

1. Copy `bosch-dishwasher-card.js` into your HA config:
   ```
   config/www/bosch-dishwasher-card.js
   ```
2. Register the resource: Settings → Dashboards → ⋮ → Resources → Add
   - URL: `/local/bosch-dishwasher-card.js`
   - Type: JavaScript module

## Adding the card to a dashboard

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

## Required entities

These entities are provided automatically by the Home Connect integration when it pairs with your dishwasher. You do not create them manually. Some are only populated while a program is running (e.g. `program_finish_time`, `program_progress`) — per the HA docs, finish time is available only while the program is running.

Where `{prefix}` is your `entity_prefix`:

| Entity | Description |
|--------|-------------|
| `switch.{prefix}_power` | Power on/off |
| `switch.{prefix}_silence_on_demand` | Silence mode |
| `switch.{prefix}_vario_speed` | Turbo (Vario Speed+) |
| `switch.{prefix}_extra_dry` | Extra Dry option |
| `switch.{prefix}_half_load` | Half Load option |
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

## Troubleshooting

- **"Custom element not found: bosch-dishwasher-card"** — hard refresh the dashboard; verify HACS registered the resource under Settings → Dashboards → Resources.
- **SILENCIO button appears disabled** — normal. The Home Connect integration reports `silence_on_demand` as `unavailable` when the dishwasher is off or idle and only exposes it mid-cycle.
- **Program shows "Detenido"** — no active or selected program. Pick one in the card.
- **Finish time or progress are blank** — normal; those sensors only populate while a cycle is running.
- **After an update, old UI is shown** — browser cache. Hard refresh or bump the resource URL version (`?v=N`).
- **Missing entities or programs that exist in the Bosch app** — Home Connect API limitation, not a card bug. See the [HA Home Connect docs](https://www.home-assistant.io/integrations/home_connect/) and the underlying [aiohomeconnect](https://github.com/MartinHjelmare/aiohomeconnect) library.

## Development

```bash
npm install
npm run build        # minified production bundle at repo root
npm run build:dev    # sourcemapped non-minified build (for dev/test.html)

# Local dev server — file:// blocks ES module imports
python3 -m http.server 8080
# Open http://localhost:8080/dev/test.html
```

`dev/test.html` has scenario buttons that simulate Running / Idle / Finished / Aborted / Warnings by swapping a mock `hass` object.

**Source lives in `src/bosch-dishwasher-card.js`.** The root `bosch-dishwasher-card.js` is a build artifact — never hand-edit it. Commit the rebuilt bundle alongside source changes; HACS downloads from `main`.

## License

MIT — see [LICENSE](LICENSE).

## Credits & disclaimer

Not affiliated with or endorsed by BSH Hausgeräte GmbH. "Bosch" is a registered trademark; the SVG illustration is a generic front view of a dishwasher, not a reproduction of any branded product.
