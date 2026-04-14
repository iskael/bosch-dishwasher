import { LitElement, html, css } from 'https://unpkg.com/lit?module';

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

  render() {
    if (!this.hass || !this.config) return html``;

    const name        = this.config.name ?? this.config.entity_prefix;
    const running     = this._isRunning();
    const badge       = this._badge();
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
      transform-origin: 50% 50%;
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
