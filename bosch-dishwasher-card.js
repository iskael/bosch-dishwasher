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
    if (!this.hass) return;
    const entity_id = `${domain}.${this.config.entity_prefix}_${suffix}`;
    this.hass.callService(domain, service, { entity_id, ...data });
  }

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
    const displayProgram  = (activeProgram !== 'unavailable' ? activeProgram : selectedProgram);
    const doorOpen   = this._isDoorOpen();
    const saltWarn   = this._isWarning('sensor', 'salt_nearly_empty');
    const rinseWarn  = this._isWarning('sensor', 'rinse_aid_nearly_empty');
    const remoteOn   = this._state('binary_sensor', 'remote_control') === 'on';

    const powerOn        = this._state('switch', 'power') === 'on';
    const turboOn        = this._state('switch', 'vario_speed') === 'on';
    const silenceOn      = this._state('switch', 'silence_on_demand') === 'on';
    const programOptions = this._attr('select', 'selected_program', 'options') ?? [];

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
                .value=${this._state('select', 'selected_program')}
                @change=${(e) => this._call('select','select_option','selected_program',{ option: e.target.value })}>
                ${programOptions.length === 0
                  ? html`<option disabled>—</option>`
                  : programOptions.map(opt => html`<option value="${opt}" ?selected=${opt === this._state('select','selected_program')}>${opt}</option>`)}
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
                class="ctrl-btn ${turboOn ? 'active' : ''}"
                @click=${() => this._call('switch','toggle','vario_speed')}>
                ⚡ TURBO
              </button>
              <button
                class="ctrl-btn ${silenceOn ? 'active' : ''}"
                @click=${() => this._call('switch','toggle','silence_on_demand')}>
                🔇 SILENCIO
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
    .sensor.warn { border-color: #f59e0b40; }
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
