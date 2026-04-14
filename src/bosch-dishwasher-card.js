import { LitElement, html, css } from 'lit';

// Maps Home Connect internal program keys to human-readable labels.
// Keys from the Bosch integration use the dishcare_dishwasher_program_* namespace.
const PROGRAM_NAMES = {
  dishcare_dishwasher_program_intensiv_70:   'Intensive 70°C',
  dishcare_dishwasher_program_auto_2:        'Auto 2',
  dishcare_dishwasher_program_eco_50:        'Eco 50°C',
  dishcare_dishwasher_program_pre_rinse:     'Pre-rinse',
  dishcare_dishwasher_program_night_wash:    'Night wash',
  dishcare_dishwasher_program_kurz_60:       'Speed 60°C',
  dishcare_dishwasher_program_machine_care:  'Machine care',
  dishcare_dishwasher_program_quick_45:      'Quick 45°C',
  dishcare_dishwasher_program_intensiv_power:'Intensive power',
  dishcare_dishwasher_program_super_60:      'Super 60°C',
  dishcare_dishwasher_program_mixed_load:    'Mixed load',
  dishcare_dishwasher_program_glas_40:       'Glass 40°C',
};

// Returns a human-readable label for a program key.
// Falls back to a formatted version of the key for unknown programs.
function programLabel(key) {
  if (!key || key === 'unavailable' || key === 'unknown') return key;
  if (PROGRAM_NAMES[key]) return PROGRAM_NAMES[key];
  // Fallback: strip common prefix, format remainder
  return key
    .replace(/^.*_program_/, '')       // strip dishcare_..._program_
    .replace(/_(\d+)$/, ' $1°C')       // trailing number → " 70°C"
    .replace(/_/g, ' ')                // underscores → spaces
    .replace(/\b\w/g, c => c.toUpperCase()); // Title Case
}

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

  // Entity IDs this card consumes. Used by shouldUpdate() to skip
  // re-renders triggered by unrelated hass state changes.
  _watchedEntities() {
    const p = this.config.entity_prefix;
    return [
      `switch.${p}_power`,
      `switch.${p}_vario_speed`,
      `switch.${p}_silence_on_demand`,
      `switch.${p}_extra_dry`,
      `switch.${p}_half_load`,
      `select.${p}_active_program`,
      `select.${p}_selected_program`,
      `sensor.${p}_door`,
      `sensor.${p}_operation_state`,
      `sensor.${p}_program_progress`,
      `sensor.${p}_program_finish_time`,
      `sensor.${p}_salt_nearly_empty`,
      `sensor.${p}_rinse_aid_nearly_empty`,
      `binary_sensor.${p}_remote_control`,
    ];
  }

  // HA fires hass updates for every entity change in the system.
  // We only care about our ~14 entities, so skip renders when none of
  // their state-object references changed (HA creates new state objects
  // on every state/attribute change, so reference equality is sufficient).
  shouldUpdate(changedProps) {
    if (changedProps.has('config')) return true;
    if (!changedProps.has('hass')) return false;
    const oldHass = changedProps.get('hass');
    if (!oldHass) return true;
    for (const id of this._watchedEntities()) {
      if (oldHass.states[id] !== this.hass.states[id]) return true;
    }
    return false;
  }

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
    if (!this.hass) return;
    const entity_id = `${domain}.${this.config.entity_prefix}_${suffix}`;
    this.hass.callService(domain, service, { entity_id, ...data });
  }

  // NOTE: Displayed as-is. The Bosch HA integration typically returns a human-readable
  // string (e.g. "42 min"). If your integration returns an ISO timestamp or epoch
  // integer, format it here before returning.
  _finishTime() {
    const s = this._state('sensor', 'program_finish_time');
    if (!s || s === 'unavailable' || s === '0') return null;
    return s;
  }

  _isWarning(domain, suffix) {
    const s = this._state(domain, suffix).toLowerCase();
    return s === 'on' || s === 'true';
  }

  _isDoorOpen() {
    return this._state('sensor', 'door').toLowerCase() === 'open';
  }

  _operationState() {
    return this._state('sensor', 'operation_state').toLowerCase();
  }

  _isRunning() {
    const s = this._operationState();
    return s === 'run' || s === 'running';
  }

  _badge() {
    const s = this._operationState();
    if (s === 'run' || s === 'running')      return { text: '● RUNNING',  cls: 'badge-running'  };
    if (s === 'finished' || s === 'finish')  return { text: '✓ FINISHED', cls: 'badge-finished' };
    if (s === 'aborting' || s === 'aborted') return { text: '⚠ ABORTED',  cls: 'badge-aborted'  };
    return { text: s ? s.toUpperCase() : 'IDLE', cls: 'badge-idle' };
  }

  _progress() {
    const raw = this._state('sensor', 'program_progress');
    const n = parseInt(raw, 10);
    return isNaN(n) ? 0 : Math.min(100, Math.max(0, n));
  }

  // Front-view illustration of a built-in dishwasher inspired by
  // Bosch Series 6 (no branding / trademarks). State-driven:
  //   running:  cyan LED pulse, blinking digital display, falling water drops
  //   finished: steady green LED, "DONE" on display
  //   aborted:  steady red LED, "STOP" on display
  //   idle:     dim grey, no animation
  _renderDishwasher(state) {
    const displayText =
      state === 'running'  ? '••••' :
      state === 'finished' ? 'DONE' :
      state === 'aborted'  ? 'STOP' : '----';
    return html`
      <svg class="bosch-dw ${state}" viewBox="0 0 80 110" width="72" height="100" aria-hidden="true">
        <defs>
          <linearGradient id="dw-door" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stop-color="#2a3441"/>
            <stop offset="50%"  stop-color="#1f2833"/>
            <stop offset="100%" stop-color="#161b22"/>
          </linearGradient>
          <linearGradient id="dw-gloss" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stop-color="#ffffff" stop-opacity="0.1"/>
            <stop offset="40%"  stop-color="#ffffff" stop-opacity="0"/>
          </linearGradient>
          <linearGradient id="dw-handle" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stop-color="#555d66"/>
            <stop offset="50%"  stop-color="#8b949e"/>
            <stop offset="100%" stop-color="#30363d"/>
          </linearGradient>
          <clipPath id="dw-door-clip">
            <rect x="6" y="26" width="68" height="74" rx="2"/>
          </clipPath>
        </defs>

        <!-- ground shadow -->
        <ellipse cx="40" cy="106" rx="32" ry="1.8" fill="#000" opacity="0.35"/>

        <!-- feet -->
        <rect x="10" y="100" width="5" height="4" fill="#0d1117"/>
        <rect x="65" y="100" width="5" height="4" fill="#0d1117"/>

        <!-- main door -->
        <rect x="6" y="26" width="68" height="74" rx="2"
              fill="url(#dw-door)" stroke="#30363d" stroke-width="1"/>
        <rect x="6" y="26" width="68" height="74" rx="2" fill="url(#dw-gloss)"/>

        <!-- falling water drops (only rendered when running) -->
        <g clip-path="url(#dw-door-clip)" class="water-drops">
          <circle class="drop d1" cx="18" cy="30" r="1.2" fill="#48cae4"/>
          <circle class="drop d2" cx="32" cy="28" r="1.0" fill="#48cae4"/>
          <circle class="drop d3" cx="48" cy="31" r="1.3" fill="#48cae4"/>
          <circle class="drop d4" cx="62" cy="29" r="1.0" fill="#48cae4"/>
          <circle class="drop d5" cx="24" cy="32" r="1.1" fill="#48cae4"/>
          <circle class="drop d6" cx="56" cy="30" r="1.2" fill="#48cae4"/>
        </g>

        <!-- subtle brand accent strip -->
        <rect x="32" y="62" width="16" height="0.8" fill="#8b949e" opacity="0.25"/>

        <!-- control panel (top strip) -->
        <rect x="6" y="6" width="68" height="16" rx="1.5"
              fill="#0d1117" stroke="#30363d" stroke-width="1"/>

        <!-- status LED -->
        <circle cx="12" cy="14" r="1.8" class="led"/>
        <circle cx="12" cy="14" r="2.8" class="led-glow"/>

        <!-- digital display -->
        <rect x="28" y="10" width="24" height="8" rx="0.8" fill="#001015"
              stroke="#00b4d830" stroke-width="0.4"/>
        <text x="40" y="16" text-anchor="middle"
              font-size="5" font-family="monospace"
              font-weight="bold" fill="#00b4d8"
              class="display-text">${displayText}</text>

        <!-- program indicator dots -->
        <circle cx="60" cy="12" r="0.8" fill="#30363d"/>
        <circle cx="64" cy="12" r="0.8" fill="#30363d"/>
        <circle cx="68" cy="12" r="0.8" fill="#30363d"/>
        <circle cx="60" cy="16" r="0.8" fill="#30363d"/>
        <circle cx="64" cy="16" r="0.8" fill="#30363d"/>
        <circle cx="68" cy="16" r="0.8" fill="#30363d"/>

        <!-- handle (below control panel) -->
        <rect x="14" y="29" width="52" height="4" rx="2" fill="url(#dw-handle)"/>
      </svg>
    `;
  }

  render() {
    if (!this.hass || !this.config) return html``;

    const name        = this.config.name ?? this.config.entity_prefix;
    const running     = this._isRunning();
    const badge       = this._badge();
    const dwState     = running                          ? 'running'
                      : badge.cls === 'badge-finished'   ? 'finished'
                      : badge.cls === 'badge-aborted'    ? 'aborted'
                      :                                    'idle';
    const progress    = this._progress();
    const finishTime  = this._finishTime();
    const activeProgram   = this._state('select', 'active_program');
    const selectedProgram = this._state('select', 'selected_program');
    const _programKey = (activeProgram && activeProgram !== 'unavailable' && activeProgram !== 'unknown')
      ? activeProgram
      : selectedProgram;
    const displayProgram = (!_programKey || _programKey === 'unavailable' || _programKey === 'unknown')
      ? 'Detenido'
      : programLabel(_programKey);
    const doorOpen   = this._isDoorOpen();
    const saltWarn   = this._isWarning('sensor', 'salt_nearly_empty');
    const rinseWarn  = this._isWarning('sensor', 'rinse_aid_nearly_empty');
    const remoteOn   = this._state('binary_sensor', 'remote_control') === 'on';

    const powerOn          = this._state('switch', 'power') === 'on';
    const turboOn          = this._state('switch', 'vario_speed') === 'on';
    const silenceState     = this._state('switch', 'silence_on_demand');
    const silenceOn        = silenceState === 'on';
    const silenceAvailable = silenceState !== 'unavailable';
    const extraDryOn       = this._state('switch', 'extra_dry') === 'on';
    const halfLoadOn       = this._state('switch', 'half_load') === 'on';
    const programOptions   = this._attr('select', 'selected_program', 'options') ?? [];

    return html`
      <ha-card>
        <div class="card-content">

          <!-- Header zone -->
          <div class="header">
            <div class="dw-illustration">
              ${this._renderDishwasher(dwState)}
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

          <!-- Sensors grid -->
          <div class="sensors">
            <div class="sensor ${doorOpen ? 'warn' : ''}">
              <span class="sensor-icon">🚪</span>
              <span class="sensor-label">Puerta</span>
              <span class="sensor-value">${doorOpen ? '⚠ Abierta' : 'Cerrada'}</span>
            </div>
            <div class="sensor ${saltWarn ? 'warn' : ''}">
              <span class="sensor-icon">🧂</span>
              <span class="sensor-label">Sal</span>
              <span class="sensor-value">${saltWarn ? '⚠ Baja' : 'OK'}</span>
            </div>
            <div class="sensor ${rinseWarn ? 'warn' : ''}">
              <span class="sensor-icon">💧</span>
              <span class="sensor-label">Abrillantador</span>
              <span class="sensor-value">${rinseWarn ? '⚠ Bajo' : 'OK'}</span>
            </div>
            <div class="sensor">
              <span class="sensor-icon">📡</span>
              <span class="sensor-label">Remoto</span>
              <span class="sensor-value">${remoteOn ? 'ON' : 'OFF'}</span>
            </div>
          </div>

          <!-- Controls -->
          <div class="controls">
            <div class="controls-label">CONTROLES</div>
            <div class="controls-row">
              <button
                class="ctrl-btn ${powerOn ? 'active' : ''}"
                @click=${() => this._call('switch','toggle','power')}>
                ⏻ ${powerOn ? 'ON' : 'OFF'}
              </button>
              <select
                class="ctrl-select"
                .value=${selectedProgram}
                @change=${(e) => this._call('select','select_option','selected_program',{ option: e.target.value })}>
                ${programOptions.length === 0
                  ? html`<option disabled>—</option>`
                  : programOptions.map(opt => html`<option value="${opt}">${programLabel(opt)}</option>`)}
              </select>
              <button
                class="ctrl-btn danger"
                ?disabled=${!running}
                @click=${() => this._call('button','press','stop_program')}>
                ⏹ STOP
              </button>
            </div>
            <div class="controls-grid">
              <button
                class="ctrl-btn ${turboOn ? 'active' : ''}"
                @click=${() => this._call('switch','toggle','vario_speed')}>
                ⚡ TURBO
              </button>
              <button
                class="ctrl-btn ${silenceOn ? 'active' : ''}"
                ?disabled=${!silenceAvailable}
                @click=${() => this._call('switch','toggle','silence_on_demand')}>
                🔇 SILENCIO
              </button>
              <button
                class="ctrl-btn ${extraDryOn ? 'active' : ''}"
                @click=${() => this._call('switch','toggle','extra_dry')}>
                🌡 EXTRA SECO
              </button>
              <button
                class="ctrl-btn ${halfLoadOn ? 'active' : ''}"
                @click=${() => this._call('switch','toggle','half_load')}>
                ½ MEDIA CARGA
              </button>
            </div>
          </div>

        </div>
      </ha-card>
    `;
  }

  static styles = css`
    ha-card {
      background: #0d1117;
      color: #e6edf3;
      border-radius: 12px;
      overflow: hidden;
      /* Pause rendering (and any CSS animations inside) when the card
         is scrolled out of the viewport — saves paint/composite cost. */
      content-visibility: auto;
      contain-intrinsic-size: 0 260px;
    }
    .card-content {
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    /* ── Header ── */
    .header { display: flex; align-items: flex-start; gap: 12px; }

    .dw-illustration {
      flex-shrink: 0;
      width: 72px; height: 100px;
      display: flex; align-items: center; justify-content: center;
      filter: drop-shadow(0 2px 6px rgba(0,0,0,0.5));
    }

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

    /* ── Dishwasher SVG ── */
    .bosch-dw { display: block; transition: opacity .3s; }
    .bosch-dw.idle { opacity: 0.55; }

    /* Status LED */
    .bosch-dw .led      { transition: fill .3s; }
    .bosch-dw .led-glow { transition: fill .3s, opacity .3s; opacity: 0; filter: blur(1.5px); }
    .bosch-dw.idle     .led { fill: #444c56; }
    .bosch-dw.running  .led, .bosch-dw.running  .led-glow { fill: #00b4d8; }
    .bosch-dw.finished .led, .bosch-dw.finished .led-glow { fill: #34d399; }
    .bosch-dw.aborted  .led, .bosch-dw.aborted  .led-glow { fill: #ef4444; }
    .bosch-dw.running  .led-glow,
    .bosch-dw.finished .led-glow,
    .bosch-dw.aborted  .led-glow { opacity: 0.8; }
    .bosch-dw.running .led { animation: led-pulse 1.5s ease-in-out infinite; }

    /* Digital display */
    .bosch-dw .display-text { transition: fill .3s; }
    .bosch-dw.idle     .display-text { fill: #30363d; }
    .bosch-dw.finished .display-text { fill: #34d399; }
    .bosch-dw.aborted  .display-text { fill: #ef4444; }
    .bosch-dw.running  .display-text { animation: blink-text 1s step-end infinite; }

    /* Water drops — only visible when running */
    .water-drops .drop { opacity: 0; }
    .bosch-dw.running .water-drops .drop { animation: drop-fall 2.2s linear infinite; }
    .bosch-dw.running .water-drops .d1 { animation-delay: 0s;    }
    .bosch-dw.running .water-drops .d2 { animation-delay: 0.35s; }
    .bosch-dw.running .water-drops .d3 { animation-delay: 0.7s;  }
    .bosch-dw.running .water-drops .d4 { animation-delay: 1.05s; }
    .bosch-dw.running .water-drops .d5 { animation-delay: 1.4s;  }
    .bosch-dw.running .water-drops .d6 { animation-delay: 1.75s; }

    /* Keyframes */
    @keyframes drop-fall {
      0%   { transform: translateY(-4px); opacity: 0; }
      12%  { opacity: 0.85; }
      88%  { opacity: 0.85; }
      100% { transform: translateY(70px); opacity: 0; }
    }
    @keyframes led-pulse {
      0%, 100% { opacity: 1;    }
      50%      { opacity: 0.35; }
    }
    @keyframes blink-text {
      0%, 100% { opacity: 1;    }
      50%      { opacity: 0.45; }
    }
    @keyframes blink-badge {
      0%, 100% { opacity: 1;    }
      50%      { opacity: 0.65; }
    }

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
    .sensor.warn { border-color: #f59e0b; background: #f59e0b15; }
    .sensor-icon  { font-size: 14px; }
    .sensor-label { color: #8b949e; font-size: 11px; flex: 1; }
    .sensor-value { font-size: 11px; color: #e6edf3; }
    .sensor.warn .sensor-value { color: #f59e0b; }

    /* ── Controls ── */
    .controls { border-top: 1px solid #21262d; padding-top: 10px; }
    .controls-label {
      color: #444c56; font-size: 10px;
      letter-spacing: 1px; margin-bottom: 6px;
    }
    .controls-row { display: flex; gap: 6px; margin-bottom: 6px; }
    .controls-row:last-child { margin-bottom: 0; }
    .controls-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px;
    }

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
  `;
}

customElements.define('bosch-dishwasher-card', BoschDishwasherCard);
