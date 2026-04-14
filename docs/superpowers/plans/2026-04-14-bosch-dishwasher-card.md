# Bosch Dishwasher Card — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-file LitElement custom card for Home Assistant that shows Bosch dishwasher state with animated spray arm, sensor grid, and inline controls — dark industrial style.

**Architecture:** One file (`bosch-dishwasher-card.js`) using LitElement imported via CDN. No build step. A local dev harness (`dev/test.html`) mocks the HA `hass` object for browser-only development. Deployed by copying to `<HA config>/www/`.

**Tech Stack:** LitElement (`https://unpkg.com/lit?module`), vanilla CSS animations, HA service calls via `hass.callService`.

---

## File Map

| File | Purpose |
|------|---------|
| `bosch-dishwasher-card.js` | The deliverable. Single LitElement custom element. |
| `dev/test.html` | Local browser test harness. Mock `hass` object. NOT shipped. |
| `README.md` | Installation instructions for HA. |

---

## Task 1: Scaffold — skeleton card + dev test harness

**Files:**
- Create: `bosch-dishwasher-card.js`
- Create: `dev/test.html`

- [ ] **Step 1: Create skeleton card**

Create `bosch-dishwasher-card.js`:

```js
import { LitElement, html, css } from 'https://unpkg.com/lit?module';

class BoschDishwasherCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    config: { attribute: false },
  };

  setConfig(config) {
    if (!config.entity_prefix) throw new Error('entity_prefix is required');
    this.config = config;
  }

  getCardSize() { return 4; }

  // Returns the full HA state object for a given domain + suffix.
  // Full entity_id: ${domain}.${entity_prefix}_${suffix}
  _entity(domain, suffix) {
    const id = `${domain}.${this.config.entity_prefix}_${suffix}`;
    return this.hass?.states[id];
  }

  // Returns .state string, defaulting to 'unavailable'
  _state(domain, suffix) {
    return this._entity(domain, suffix)?.state ?? 'unavailable';
  }

  // Returns an attribute value
  _attr(domain, suffix, attr) {
    return this._entity(domain, suffix)?.attributes?.[attr];
  }

  // Calls a HA service. suffix is used to construct the entity_id.
  _call(domain, service, suffix, data = {}) {
    const entity_id = `${domain}.${this.config.entity_prefix}_${suffix}`;
    this.hass.callService(domain, service, { entity_id, ...data });
  }

  render() {
    if (!this.hass || !this.config) return html``;
    return html`
      <ha-card>
        <div class="card-content">
          <p style="color:#e6edf3">Bosch Dishwasher Card — ${this.config.entity_prefix}</p>
        </div>
      </ha-card>
    `;
  }

  static styles = css`
    ha-card {
      background: #0d1117;
      border-radius: 12px;
      overflow: hidden;
    }
    .card-content { padding: 16px; }
  `;
}

customElements.define('bosch-dishwasher-card', BoschDishwasherCard);
```

- [ ] **Step 2: Create dev test harness**

Create `dev/test.html`:

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Bosch Dishwasher Card — Dev Harness</title>
  <style>
    body { background: #1a1a2e; display: flex; gap: 20px; padding: 20px; flex-wrap: wrap; }
    .scenario { display: flex; flex-direction: column; gap: 6px; }
    .scenario label { color: #8b949e; font: 11px/1 monospace; }
  </style>
</head>
<body>

<!-- Scenario buttons to switch mock state -->
<div style="position:fixed;top:10px;right:10px;display:flex;flex-direction:column;gap:6px;z-index:100;">
  <button onclick="setState('running')">▶ Running</button>
  <button onclick="setState('idle')">⏸ Idle</button>
  <button onclick="setState('finished')">✓ Finished</button>
  <button onclick="setState('aborted')">⚠ Aborted</button>
  <button onclick="setState('warnings')">⚠ Warnings</button>
</div>

<div class="scenario">
  <label>CURRENT STATE</label>
  <bosch-dishwasher-card id="card"></bosch-dishwasher-card>
</div>

<script type="module">
  import '../bosch-dishwasher-card.js';

  const BASE_STATES = {
    'switch.lavavajillas_power':             { state: 'on',      attributes: {} },
    'switch.lavavajillas_silence_on_demand': { state: 'off',     attributes: {} },
    'switch.lavavajillas_vario_speed':       { state: 'off',     attributes: {} },
    'select.lavavajillas_active_program':    { state: 'Eco 50°', attributes: {} },
    'select.lavavajillas_selected_program':  {
      state: 'Eco 50°',
      attributes: { options: ['Auto 45-65°', 'Eco 50°', 'Intensivo 70°', 'Rápido 45°', 'Pre-lavado'] }
    },
    'button.lavavajillas_stop_program':      { state: 'unknown', attributes: {} },
    'sensor.lavavajillas_door':              { state: 'Closed',  attributes: {} },
    'sensor.lavavajillas_operation_state':   { state: 'Run',     attributes: {} },
    'sensor.lavavajillas_program_aborted':   { state: 'false',   attributes: {} },
    'sensor.lavavajillas_program_finish_time': { state: '42 min', attributes: {} },
    'sensor.lavavajillas_program_finished':  { state: 'false',   attributes: {} },
    'sensor.lavavajillas_program_progress':  { state: '65',      attributes: {} },
    'binary_sensor.lavavajillas_remote_control': { state: 'on', attributes: {} },
    'binary_sensor.lavavajillas_remote_start':   { state: 'off', attributes: {} },
    'sensor.lavavajillas_rinse_aid_nearly_empty': { state: 'off', attributes: {} },
    'sensor.lavavajillas_salt_nearly_empty': { state: 'off',     attributes: {} },
  };

  const SCENARIOS = {
    running:  { 'sensor.lavavajillas_operation_state': { state: 'Run' },    'sensor.lavavajillas_program_progress': { state: '65' } },
    idle:     { 'sensor.lavavajillas_operation_state': { state: 'Ready' },  'sensor.lavavajillas_program_progress': { state: '0'  }, 'sensor.lavavajillas_program_finish_time': { state: '0' } },
    finished: { 'sensor.lavavajillas_operation_state': { state: 'Finished' }, 'sensor.lavavajillas_program_progress': { state: '100' } },
    aborted:  { 'sensor.lavavajillas_operation_state': { state: 'Aborting' }, 'sensor.lavavajillas_program_progress': { state: '30' } },
    warnings: {
      'sensor.lavavajillas_operation_state':       { state: 'Run' },
      'sensor.lavavajillas_salt_nearly_empty':     { state: 'on' },
      'sensor.lavavajillas_rinse_aid_nearly_empty':{ state: 'on' },
      'sensor.lavavajillas_door':                  { state: 'Open' },
    },
  };

  function makeHass(overrides = {}) {
    const states = {};
    for (const [id, val] of Object.entries(BASE_STATES)) {
      states[id] = { ...val, attributes: { ...val.attributes } };
    }
    for (const [id, patch] of Object.entries(overrides)) {
      states[id] = { ...(states[id] || {}), attributes: {}, ...patch };
    }
    return {
      states,
      callService(domain, service, data) {
        console.log('callService:', domain, service, data);
      }
    };
  }

  const card = document.getElementById('card');
  card.setConfig({ entity_prefix: 'lavavajillas', name: 'Lavavajillas' });
  card.hass = makeHass();

  window.setState = (scenario) => {
    card.hass = makeHass(SCENARIOS[scenario] || {});
  };
</script>
</body>
</html>
```

- [ ] **Step 3: Open harness in browser**

```bash
open dev/test.html
# or: python3 -m http.server 8080  (then open http://localhost:8080/dev/test.html)
```

Expected: dark card renders with text "Bosch Dishwasher Card — lavavajillas". No JS errors in console.

- [ ] **Step 4: Commit**

```bash
git add bosch-dishwasher-card.js dev/test.html
git commit -m "feat: scaffold LitElement card + dev test harness"
```

---

## Task 2: Header zone — icon box, spray arm animation, badge, progress

**Files:**
- Modify: `bosch-dishwasher-card.js`

- [ ] **Step 1: Update test harness expectation**

Open `dev/test.html` in browser and click "▶ Running". Currently you see only text — after this task you should see the spray arm icon animating, a cyan "RUNNING" badge, a 65% progress bar, and "Eco 50° · 42 min" below the name.

- [ ] **Step 2: Add state helper methods**

Replace the `render()` method stub and add helpers. Replace everything after `_attr(...)` through the existing `render()`:

```js
  _operationState() {
    return this._state('sensor', 'operation_state').toLowerCase();
  }

  _isRunning() {
    const s = this._operationState();
    return s === 'run' || s === 'running';
  }

  _badge() {
    const s = this._operationState();
    if (s === 'run' || s === 'running')   return { text: '● RUNNING',  cls: 'badge-running'  };
    if (s === 'finished' || s === 'finish') return { text: '✓ FINISHED', cls: 'badge-finished' };
    if (s === 'aborting' || s === 'aborted') return { text: '⚠ ABORTED', cls: 'badge-aborted'  };
    return { text: 'IDLE', cls: 'badge-idle' };
  }

  _progress() {
    const raw = this._state('sensor', 'program_progress');
    const n = parseInt(raw, 10);
    return isNaN(n) ? 0 : n;
  }

  _finishTime() {
    const s = this._state('sensor', 'program_finish_time');
    if (!s || s === 'unavailable' || s === '0') return null;
    return s;
  }

  _renderSprayArm() {
    return html`
      <svg class="spray-arm" viewBox="0 0 48 48" width="36" height="36">
        <g class="arm-group">
          <rect x="4" y="22" width="40" height="4" rx="2" fill="#00b4d8"/>
          <ellipse cx="6" cy="18" rx="3" ry="5" fill="#48cae4" class="nozzle nozzle-left"/>
          <ellipse cx="42" cy="18" rx="3" ry="5" fill="#48cae4" class="nozzle nozzle-right"/>
        </g>
        <circle cx="24" cy="24" r="3" fill="#0077b6"/>
      </svg>
    `;
  }
```

- [ ] **Step 3: Replace render() with header zone**

```js
  render() {
    if (!this.hass || !this.config) return html``;

    const name        = this.config.name ?? this.config.entity_prefix;
    const running     = this._isRunning();
    const badge       = this._badge();
    const progress    = this._progress();
    const finishTime  = this._finishTime();
    const activeProgram   = this._state('select', 'active_program');
    const selectedProgram = this._state('select', 'selected_program');
    const displayProgram  = (activeProgram !== 'unavailable' ? activeProgram : selectedProgram);

    return html`
      <ha-card>
        <div class="card-content">

          <!-- Header zone -->
          <div class="header">
            <div class="icon-box ${running ? 'running' : ''}">
              ${running
                ? this._renderSprayArm()
                : html`<span class="icon-static">🍽️</span>`}
            </div>
            <div class="header-info">
              <div class="header-top">
                <span class="card-name">${name}</span>
                <span class="badge ${badge.cls}">${badge.text}</span>
              </div>
              <div class="program-line">
                ${displayProgram}${finishTime ? html` · ${finishTime}` : ''}
              </div>
              <div class="progress-bar">
                <div class="progress-fill" style="width:${progress}%"></div>
              </div>
              <div class="progress-label">${progress}%</div>
            </div>
          </div>

          <!-- Sensors and controls — placeholder for next tasks -->
          <div style="color:#444c56;font-size:11px;">sensors + controls coming…</div>

        </div>
      </ha-card>
    `;
  }
```

- [ ] **Step 4: Add header styles to static styles**

Replace the existing `static styles` block with:

```js
  static styles = css`
    ha-card {
      background: #0d1117;
      color: #e6edf3;
      border-radius: 12px;
      overflow: hidden;
    }
    .card-content {
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    /* ── Header ── */
    .header { display: flex; align-items: flex-start; gap: 12px; }

    .icon-box {
      width: 56px; height: 56px;
      background: #161b22;
      border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
      border: 1px solid #21262d;
      transition: box-shadow .3s;
    }
    .icon-box.running {
      border-color: #00b4d830;
      animation: pulse-glow 2s ease-in-out infinite;
    }
    .icon-static { font-size: 28px; opacity: 0.4; }

    .header-info { flex: 1; min-width: 0; }
    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2px;
    }
    .card-name { font-weight: 700; font-size: 15px; }

    /* Badges */
    .badge {
      font-size: 10px; padding: 2px 8px;
      border-radius: 10px; font-weight: 700; letter-spacing: .5px;
    }
    .badge-running  { background: #00b4d8; color: #000; animation: blink-badge 1s step-end infinite; }
    .badge-finished { background: #34d39920; color: #34d399; border: 1px solid #34d39940; }
    .badge-aborted  { background: #ef444420; color: #ef4444; border: 1px solid #ef444440; }
    .badge-idle     { background: #21262d; color: #8b949e; }

    .program-line { color: #8b949e; font-size: 12px; margin-bottom: 5px; }

    /* Progress bar */
    .progress-bar {
      background: #21262d; height: 4px; border-radius: 2px;
      overflow: hidden; margin-bottom: 3px;
    }
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #00b4d8, #0077b6);
      border-radius: 2px;
      transition: width .5s ease;
    }
    .progress-label { font-size: 11px; color: #8b949e; }

    /* Spray arm SVG */
    .spray-arm .arm-group {
      transform-origin: 24px 24px;
      animation: spin 2s linear infinite;
    }
    .nozzle-left  { animation: spray 1s ease-in-out infinite; }
    .nozzle-right { animation: spray 1s ease-in-out infinite .5s; }

    /* Keyframes */
    @keyframes spin {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }
    @keyframes spray {
      0%, 100% { opacity: 0.9; }
      50%      { opacity: 0.3; }
    }
    @keyframes pulse-glow {
      0%, 100% { box-shadow: 0 0 8px #00b4d8; }
      50%      { box-shadow: 0 0 20px #00b4d8, 0 0 40px #0077b640; }
    }
    @keyframes blink-badge {
      0%, 100% { opacity: 1; }
      50%      { opacity: 0.65; }
    }
  `;
```

- [ ] **Step 5: Verify in browser**

Reload `dev/test.html`. Click each scenario button and verify:
- **▶ Running:** spray arm SVG rotates, cyan glow on icon box, "● RUNNING" badge blinks, progress bar at 65%, "Eco 50° · 42 min".
- **⏸ Idle:** static 🍽️ icon dimmed, "IDLE" grey badge, progress 0%.
- **✓ Finished:** static icon, green "✓ FINISHED" badge, progress 100%.
- **⚠ Aborted:** static icon, red "⚠ ABORTED" badge.

No console errors.

- [ ] **Step 6: Commit**

```bash
git add bosch-dishwasher-card.js
git commit -m "feat: header zone with spray arm animation, badge and progress bar"
```

---

## Task 3: Sensors grid (2×2)

**Files:**
- Modify: `bosch-dishwasher-card.js`

- [ ] **Step 1: Add sensor helper**

Add this method after `_finishTime()`:

```js
  _isWarning(domain, suffix) {
    const s = this._state(domain, suffix).toLowerCase();
    return s === 'on' || s === 'true';
  }
```

- [ ] **Step 2: Replace the sensors placeholder in render()**

Find `<!-- Sensors and controls — placeholder for next tasks -->` and replace with:

```js
          <!-- Sensors grid -->
          <div class="sensors">
            <div class="sensor ${this._state('sensor','door').toLowerCase() === 'open' ? 'warn' : ''}">
              <span class="sensor-icon">🚪</span>
              <span class="sensor-label">Puerta</span>
              <span class="sensor-value">${this._state('sensor','door').toLowerCase() === 'open' ? '⚠ Abierta' : 'Cerrada'}</span>
            </div>
            <div class="sensor ${this._isWarning('sensor','salt_nearly_empty') ? 'warn' : ''}">
              <span class="sensor-icon">🧂</span>
              <span class="sensor-label">Sal</span>
              <span class="sensor-value">${this._isWarning('sensor','salt_nearly_empty') ? '⚠ Baja' : 'OK'}</span>
            </div>
            <div class="sensor ${this._isWarning('sensor','rinse_aid_nearly_empty') ? 'warn' : ''}">
              <span class="sensor-icon">💧</span>
              <span class="sensor-label">Abrillantador</span>
              <span class="sensor-value">${this._isWarning('sensor','rinse_aid_nearly_empty') ? '⚠ Bajo' : 'OK'}</span>
            </div>
            <div class="sensor">
              <span class="sensor-icon">📡</span>
              <span class="sensor-label">Remoto</span>
              <span class="sensor-value">${this._state('binary_sensor','remote_control') === 'on' ? 'ON' : 'OFF'}</span>
            </div>
          </div>

          <!-- Controls — placeholder -->
          <div style="color:#444c56;font-size:11px;">controls coming…</div>
```

- [ ] **Step 3: Add sensor styles to static styles**

Append inside the `css\`...\`` block (before the closing backtick):

```css
    /* ── Sensors ── */
    .sensors {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px;
    }
    .sensor {
      background: #161b22;
      border-radius: 6px;
      padding: 6px 8px;
      display: flex;
      align-items: center;
      gap: 6px;
      border: 1px solid #21262d;
    }
    .sensor.warn { border-color: #f59e0b40; }
    .sensor-icon  { font-size: 14px; }
    .sensor-label { color: #8b949e; font-size: 11px; flex: 1; }
    .sensor-value { font-size: 11px; color: #e6edf3; }
    .sensor.warn .sensor-value { color: #f59e0b; }
```

- [ ] **Step 4: Verify in browser**

Reload `dev/test.html`. Click "⚠ Warnings". Verify:
- 🚪 Puerta row shows "⚠ Abierta" in amber with amber border.
- 🧂 Sal row shows "⚠ Baja" in amber.
- 💧 Abrillantador row shows "⚠ Bajo" in amber.
- 📡 Remoto shows "ON".
- Click "▶ Running" — all sensors back to OK (except 📡).

- [ ] **Step 5: Commit**

```bash
git add bosch-dishwasher-card.js
git commit -m "feat: sensors grid with door/salt/rinse-aid warning states"
```

---

## Task 4: Controls zone

**Files:**
- Modify: `bosch-dishwasher-card.js`

- [ ] **Step 1: Replace controls placeholder in render()**

Find `<!-- Controls — placeholder -->` and replace with:

```js
          <!-- Controls -->
          <div class="controls">
            <div class="controls-label">CONTROLES</div>
            <div class="controls-row">
              <button
                class="ctrl-btn ${this._state('switch','power') === 'on' ? 'active' : ''}"
                @click=${() => this._call('switch','toggle','power')}>
                ⏻ ${this._state('switch','power') === 'on' ? 'ON' : 'OFF'}
              </button>
              <select
                class="ctrl-select"
                @change=${(e) => this._call('select','select_option','selected_program',{ option: e.target.value })}>
                ${(this._attr('select','selected_program','options') ?? []).map(opt => html`
                  <option value=${opt} ?selected=${opt === this._state('select','selected_program')}>${opt}</option>
                `)}
              </select>
              <button
                class="ctrl-btn danger"
                ?disabled=${!this._isRunning()}
                @click=${() => this._call('button','press','stop_program')}>
                ⏹ STOP
              </button>
            </div>
            <div class="controls-row">
              <button
                class="ctrl-btn ${this._state('switch','vario_speed') === 'on' ? 'active' : ''}"
                @click=${() => this._call('switch','toggle','vario_speed')}>
                ⚡ TURBO
              </button>
              <button
                class="ctrl-btn ${this._state('switch','silence_on_demand') === 'on' ? 'active' : ''}"
                @click=${() => this._call('switch','toggle','silence_on_demand')}>
                🔇 SILENCIO
              </button>
            </div>
          </div>
```

- [ ] **Step 2: Add controls styles**

Append inside the `css\`...\`` block:

```css
    /* ── Controls ── */
    .controls { border-top: 1px solid #21262d; padding-top: 10px; }
    .controls-label {
      color: #444c56; font-size: 10px;
      letter-spacing: 1px; margin-bottom: 6px;
    }
    .controls-row { display: flex; gap: 6px; margin-bottom: 6px; }
    .controls-row:last-child { margin-bottom: 0; }

    .ctrl-btn {
      background: #21262d;
      border: 1px solid #30363d;
      border-radius: 6px;
      color: #8b949e;
      font-size: 11px;
      padding: 6px 10px;
      cursor: pointer;
      flex: 1;
      transition: border-color .15s, color .15s, background .15s;
    }
    .ctrl-btn:hover:not(:disabled) { border-color: #00b4d8; color: #00b4d8; }
    .ctrl-btn.active { background: #00b4d820; border-color: #00b4d850; color: #00b4d8; }
    .ctrl-btn.danger { color: #ef4444; border-color: #ef444440; }
    .ctrl-btn.danger:hover:not(:disabled) { background: #ef444420; border-color: #ef4444; }
    .ctrl-btn:disabled { opacity: 0.3; cursor: not-allowed; }

    .ctrl-select {
      flex: 2;
      background: #21262d;
      border: 1px solid #30363d;
      border-radius: 6px;
      color: #00b4d8;
      font-size: 11px;
      padding: 6px 8px;
      cursor: pointer;
      outline: none;
    }
    .ctrl-select:focus { border-color: #00b4d8; }
```

- [ ] **Step 3: Verify in browser**

Reload `dev/test.html`. Verify:
- **▶ Running:** STOP button is enabled (not dimmed), clicking it logs `button.press` on `button.lavavajillas_stop_program` to console.
- **⏸ Idle:** STOP button is dimmed/disabled.
- Power button shows "⏻ ON" in cyan when power is on.
- Program dropdown shows the program options; selecting one logs `select.select_option` to console.
- TURBO and SILENCIO buttons show cyan highlight when active.

- [ ] **Step 4: Commit**

```bash
git add bosch-dishwasher-card.js
git commit -m "feat: controls zone — power, program select, stop, turbo, silence"
```

---

## Task 5: HA integration — deploy and verify live

**Files:**
- Copy: `bosch-dishwasher-card.js` → `<HA config>/www/bosch-dishwasher-card.js`

> **Before this task:** check the actual `operation_state` values from your HA instance.  
> Go to HA → Developer Tools → States → search `lavavajillas_operation_state` → note the exact state string.  
> If it differs from `"Run"` update `_isRunning()` and `_badge()` accordingly.

- [ ] **Step 1: Check actual operation_state value**

In HA Developer Tools → States, find `sensor.lavavajillas_operation_state` and note the `state` value. Common variants from Bosch integration: `"Run"`, `"Running"`, `"run"`. If needed, update the helpers in `bosch-dishwasher-card.js`:

```js
  _isRunning() {
    const s = this._operationState();
    // Add any actual value observed in HA:
    return s === 'run' || s === 'running';
  }

  _badge() {
    const s = this._operationState();
    if (s === 'run' || s === 'running')      return { text: '● RUNNING',  cls: 'badge-running'  };
    if (s === 'finished' || s === 'finish')  return { text: '✓ FINISHED', cls: 'badge-finished' };
    if (s === 'aborting' || s === 'aborted') return { text: '⚠ ABORTED',  cls: 'badge-aborted'  };
    return { text: s.toUpperCase() || 'IDLE', cls: 'badge-idle' };
  }
```

- [ ] **Step 2: Similarly check salt/rinse aid state values**

In HA Developer Tools → States, find `sensor.lavavajillas_salt_nearly_empty`. If the state is not `"on"` / `"true"` (e.g. it's `"Low"` or `"1"`), update `_isWarning()`:

```js
  _isWarning(domain, suffix) {
    const s = this._state(domain, suffix).toLowerCase();
    // Adjust the list to match actual HA state values:
    return s === 'on' || s === 'true' || s === '1' || s === 'low';
  }
```

- [ ] **Step 3: Copy card to HA**

```bash
# Replace with your actual HA config path
cp bosch-dishwasher-card.js /path/to/homeassistant/www/bosch-dishwasher-card.js
```

- [ ] **Step 4: Register resource in HA**

1. Open HA → Settings → Dashboards → ⋮ menu → Resources
2. Click "Add resource"
3. URL: `/local/bosch-dishwasher-card.js`
4. Type: JavaScript module
5. Save

- [ ] **Step 5: Add card to dashboard**

In your dashboard, add a Manual card with:

```yaml
type: custom:bosch-dishwasher-card
entity_prefix: lavavajillas
name: Lavavajillas
```

- [ ] **Step 6: Verify all sensors and controls**

Walk through the verification checklist from the spec:
- [ ] All sensor values display correctly (door, salt, rinse aid, remote)
- [ ] Start a wash cycle → spray arm animation activates, badge shows RUNNING
- [ ] Progress bar updates in real time
- [ ] Stop button is enabled only while running
- [ ] Clicking Stop calls `button.press` on `button.lavavajillas_stop_program`
- [ ] Toggling Power, Turbo, Silence changes switch state in HA
- [ ] Selecting a program calls `select.select_option`
- [ ] Open door → 🚪 row shows amber warning

- [ ] **Step 7: Commit any fixes**

```bash
git add bosch-dishwasher-card.js
git commit -m "fix: adjust operation_state values to match live HA integration"
```

---

## Task 6: README — installation instructions

**Files:**
- Create: `README.md`

- [ ] **Step 1: Write README**

Create `README.md`:

```markdown
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
# Open test harness in browser (no HA needed)
open dev/test.html
# or serve locally:
python3 -m http.server 8080
# then open http://localhost:8080/dev/test.html
```

Use the scenario buttons to simulate Running / Idle / Finished / Aborted / Warnings states.
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add installation and configuration README"
```

---

## Verification Checklist (end-to-end)

After all tasks are complete, verify in the live HA instance:

- [ ] Card loads without errors in browser console
- [ ] Spray arm animates when `operation_state` matches running
- [ ] Badge changes correctly for all 4 states
- [ ] Progress bar reflects `program_progress` percentage in real time
- [ ] Program name shows from `active_program` (if running) or `selected_program` (if idle)
- [ ] Finish time shows when available, hidden when `0` or unavailable
- [ ] Door open triggers amber warning on sensor row
- [ ] Salt low triggers amber warning
- [ ] Rinse aid low triggers amber warning
- [ ] Power toggle updates switch state in HA
- [ ] Program dropdown calls `select.select_option` correctly
- [ ] Stop button enabled only when running, calls `button.press` on stop entity
- [ ] Turbo toggle works
- [ ] Silence toggle works
