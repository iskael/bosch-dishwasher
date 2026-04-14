import { LitElement, html, css } from 'lit';

// Localized strings used by the card UI. Looked up by `hass.locale.language`
// (e.g. 'en', 'es'). Falls back to English when the locale isn't covered.
const I18N = {
  en: {
    controls: 'CONTROLS',
    door: 'Door',
    door_open: '⚠ Open',
    door_closed: 'Closed',
    salt: 'Salt',
    salt_low: '⚠ Low',
    ok: 'OK',
    rinse_aid: 'Rinse aid',
    remote: 'Remote',
    on: 'ON',
    off: 'OFF',
    turbo: 'TURBO',
    silence: 'SILENCE',
    extra_dry: 'EXTRA DRY',
    half_load: 'HALF LOAD',
    stop: 'STOP',
    stopped: 'Stopped',
    running: '● RUNNING',
    finished: '✓ FINISHED',
    aborted: '⚠ ABORTED',
    idle: 'IDLE',
  },
  es: {
    controls: 'CONTROLES',
    door: 'Puerta',
    door_open: '⚠ Abierta',
    door_closed: 'Cerrada',
    salt: 'Sal',
    salt_low: '⚠ Baja',
    ok: 'OK',
    rinse_aid: 'Abrillantador',
    remote: 'Remoto',
    on: 'ON',
    off: 'OFF',
    turbo: 'TURBO',
    silence: 'SILENCIO',
    extra_dry: 'EXTRA SECO',
    half_load: 'MEDIA CARGA',
    stop: 'DETENER',
    stopped: 'Detenido',
    running: '● EN MARCHA',
    finished: '✓ FINALIZADO',
    aborted: '⚠ CANCELADO',
    idle: 'INACTIVO',
  },
};

// Maps Home Connect program keys (slug form) to display labels.
const PROGRAM_NAMES = {
  dishcare_dishwasher_program_intensiv_70:    'Intensive 70°C',
  dishcare_dishwasher_program_auto_2:         'Auto 2',
  dishcare_dishwasher_program_eco_50:         'Eco 50°C',
  dishcare_dishwasher_program_pre_rinse:      'Pre-rinse',
  dishcare_dishwasher_program_night_wash:     'Night wash',
  dishcare_dishwasher_program_kurz_60:        'Speed 60°C',
  dishcare_dishwasher_program_machine_care:   'Machine care',
  dishcare_dishwasher_program_quick_45:       'Quick 45°C',
  dishcare_dishwasher_program_intensiv_power: 'Intensive power',
  dishcare_dishwasher_program_super_60:       'Super 60°C',
  dishcare_dishwasher_program_mixed_load:     'Mixed load',
  dishcare_dishwasher_program_glas_40:        'Glass 40°C',
};

function programLabel(key) {
  if (!key || key === 'unavailable' || key === 'unknown') return key;
  if (PROGRAM_NAMES[key]) return PROGRAM_NAMES[key];
  return key
    .replace(/^.*_program_/, '')
    .replace(/_(\d+)$/, ' $1°C')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

// Capabilities consumed by the card. Each entry says how to find the entity
// in the entity registry given a target device:
//   domain          → expected entity domain
//   translationKey  → entity_description.translation_key set by the integration
//   prefixSuffix    → legacy fallback suffix (only used in entity_prefix mode)
const CAPABILITIES = {
  power:               { domain: 'switch',        translationKey: 'power',                       prefixSuffix: 'power' },
  child_lock:          { domain: 'switch',        translationKey: 'child_lock',                  prefixSuffix: 'child_lock' },
  vario_speed:         { domain: 'switch',        translationKey: 'vario_speed_plus',            prefixSuffix: 'vario_speed_plus' },
  silence_on_demand:   { domain: 'switch',        translationKey: 'silence_on_demand',           prefixSuffix: 'silence_on_demand' },
  extra_dry:           { domain: 'switch',        translationKey: 'extra_dry',                   prefixSuffix: 'extra_dry' },
  half_load:           { domain: 'switch',        translationKey: 'half_load',                   prefixSuffix: 'half_load' },
  active_program:      { domain: 'select',        translationKey: 'active_program',              prefixSuffix: 'active_program' },
  selected_program:    { domain: 'select',        translationKey: 'selected_program',            prefixSuffix: 'selected_program' },
  door:                { domain: 'sensor',        translationKey: 'door_state',                  prefixSuffix: 'door' },
  operation_state:     { domain: 'sensor',        translationKey: 'operation_state',             prefixSuffix: 'operation_state' },
  program_progress:    { domain: 'sensor',        translationKey: 'program_progress',            prefixSuffix: 'program_progress' },
  program_finish_time: { domain: 'sensor',        translationKey: 'remaining_program_time',      prefixSuffix: 'program_finish_time' },
  salt_warning:        { domain: 'binary_sensor', translationKey: 'salt_nearly_empty',           prefixSuffix: 'salt_nearly_empty' },
  rinse_warning:       { domain: 'binary_sensor', translationKey: 'rinse_aid_nearly_empty',      prefixSuffix: 'rinse_aid_nearly_empty' },
  remote_control:      { domain: 'binary_sensor', translationKey: 'remote_control',              prefixSuffix: 'remote_control' },
  stop_program:        { domain: 'button',        translationKey: 'stop_program',                prefixSuffix: 'stop_program' },
};

class BoschDishwasherCard extends LitElement {
  static properties = {
    hass:   { attribute: false },
    config: { attribute: false },
  };

  // Lovelace card config. Accepts either `device` (preferred) or
  // legacy `entity_prefix` (deprecated, will be removed in v1.0.0).
  setConfig(config) {
    if (!config.device && !config.entity_prefix) {
      throw new Error('A `device` (Bosch dishwasher) is required.');
    }
    this.config = config;
    if (config.entity_prefix && !config.device) {
      // eslint-disable-next-line no-console
      console.warn(
        '[bosch-dishwasher-card] `entity_prefix` is deprecated; '
        + 'switch to the `device` selector. Support will be removed in v1.0.0.'
      );
    }
  }

  // Stub used by Lovelace's "Add Card" picker.
  static getStubConfig() {
    return { type: 'custom:bosch-dishwasher-card', device: '' };
  }

  // GUI editor element; defined further down. Lovelace will instantiate it
  // and pass `hass` + `config` so the user gets a device picker.
  static getConfigElement() {
    return document.createElement('bosch-dishwasher-card-editor');
  }

  getCardSize() { return 4; }

  // ─────────────────────────────────────────────────────────────────
  // Locale lookup
  // ─────────────────────────────────────────────────────────────────
  _t(key) {
    const lang = (this.hass?.locale?.language ?? 'en').split('-')[0];
    return (I18N[lang] ?? I18N.en)[key] ?? I18N.en[key] ?? key;
  }

  // ─────────────────────────────────────────────────────────────────
  // Entity resolution
  // ─────────────────────────────────────────────────────────────────
  // Resolve an entity_id for a capability, given current config + hass.
  // Returns undefined if no entity can be found.
  _entityId(capability) {
    const cap = CAPABILITIES[capability];
    if (!cap) return undefined;

    // Preferred path: `device` config + hass.entities lookup.
    if (this.config.device && this.hass?.entities) {
      // hass.entities is keyed by entity_id; each value has a `device_id`
      // and a `translation_key`. Filter to entities on our device whose
      // translation_key matches the capability's expected translation_key.
      for (const entity of Object.values(this.hass.entities)) {
        if (entity.device_id !== this.config.device) continue;
        if (!entity.entity_id?.startsWith(`${cap.domain}.`)) continue;
        if (entity.translation_key === cap.translationKey) {
          return entity.entity_id;
        }
      }
      return undefined;
    }

    // Legacy fallback: entity_prefix + suffix string concat.
    if (this.config.entity_prefix) {
      return `${cap.domain}.${this.config.entity_prefix}_${cap.prefixSuffix}`;
    }

    return undefined;
  }

  _entity(capability) {
    const id = this._entityId(capability);
    return id ? this.hass?.states?.[id] : undefined;
  }

  _state(capability) {
    return this._entity(capability)?.state ?? 'unavailable';
  }

  _attr(capability, attr) {
    return this._entity(capability)?.attributes?.[attr];
  }

  _call(capability, service, data = {}) {
    const id = this._entityId(capability);
    if (!id || !this.hass) return;
    const domain = id.split('.')[0];
    this.hass.callService(domain, service, { entity_id: id, ...data });
  }

  // List of every entity the card watches — used by shouldUpdate to skip
  // re-renders triggered by unrelated hass updates.
  _watchedEntities() {
    const ids = [];
    for (const cap of Object.keys(CAPABILITIES)) {
      const id = this._entityId(cap);
      if (id) ids.push(id);
    }
    return ids;
  }

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

  // ─────────────────────────────────────────────────────────────────
  // Derived state helpers
  // ─────────────────────────────────────────────────────────────────
  _operationState() { return this._state('operation_state').toLowerCase(); }
  _isRunning() {
    const s = this._operationState();
    return s === 'run' || s === 'running';
  }

  _badge() {
    const s = this._operationState();
    if (s === 'run' || s === 'running')      return { text: this._t('running'),  cls: 'badge-running'  };
    if (s === 'finished' || s === 'finish')  return { text: this._t('finished'), cls: 'badge-finished' };
    if (s === 'aborting' || s === 'aborted') return { text: this._t('aborted'),  cls: 'badge-aborted'  };
    return { text: s ? s.toUpperCase() : this._t('idle'), cls: 'badge-idle' };
  }

  _isDoorOpen() { return this._state('door').toLowerCase() === 'open'; }

  _isWarning(capability) {
    const s = this._state(capability).toLowerCase();
    return s === 'on' || s === 'true' || s === 'present' || s === 'confirmed';
  }

  _progress() {
    const n = parseInt(this._state('program_progress'), 10);
    return Number.isNaN(n) ? 0 : Math.min(100, Math.max(0, n));
  }

  // The integration exposes remaining time as a TIMESTAMP sensor (ISO datetime).
  // Format it as the absolute finish time, like "21:42".
  _finishTime() {
    const s = this._state('program_finish_time');
    if (!s || s === 'unavailable' || s === 'unknown' || s === '0') return null;
    if (/^\d{4}-\d{2}-\d{2}T/.test(s)) {
      const date = new Date(s);
      if (!Number.isNaN(date.getTime())) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
    }
    return s;
  }

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
        <ellipse cx="40" cy="106" rx="32" ry="1.8" fill="#000" opacity="0.35"/>
        <rect x="10" y="100" width="5" height="4" fill="#0d1117"/>
        <rect x="65" y="100" width="5" height="4" fill="#0d1117"/>
        <rect x="6" y="26" width="68" height="74" rx="2" fill="url(#dw-door)" stroke="#30363d" stroke-width="1"/>
        <rect x="6" y="26" width="68" height="74" rx="2" fill="url(#dw-gloss)"/>
        <g clip-path="url(#dw-door-clip)" class="water-drops">
          <circle class="drop d1" cx="18" cy="30" r="1.2" fill="#48cae4"/>
          <circle class="drop d2" cx="32" cy="28" r="1.0" fill="#48cae4"/>
          <circle class="drop d3" cx="48" cy="31" r="1.3" fill="#48cae4"/>
          <circle class="drop d4" cx="62" cy="29" r="1.0" fill="#48cae4"/>
          <circle class="drop d5" cx="24" cy="32" r="1.1" fill="#48cae4"/>
          <circle class="drop d6" cx="56" cy="30" r="1.2" fill="#48cae4"/>
        </g>
        <rect x="32" y="62" width="16" height="0.8" fill="#8b949e" opacity="0.25"/>
        <rect x="6" y="6" width="68" height="16" rx="1.5" fill="#0d1117" stroke="#30363d" stroke-width="1"/>
        <circle cx="12" cy="14" r="1.8" class="led"/>
        <circle cx="12" cy="14" r="2.8" class="led-glow"/>
        <rect x="28" y="10" width="24" height="8" rx="0.8" fill="#001015" stroke="#00b4d830" stroke-width="0.4"/>
        <text x="40" y="16" text-anchor="middle" font-size="5" font-family="monospace" font-weight="bold" fill="#00b4d8" class="display-text">${displayText}</text>
        <circle cx="60" cy="12" r="0.8" fill="#30363d"/>
        <circle cx="64" cy="12" r="0.8" fill="#30363d"/>
        <circle cx="68" cy="12" r="0.8" fill="#30363d"/>
        <circle cx="60" cy="16" r="0.8" fill="#30363d"/>
        <circle cx="64" cy="16" r="0.8" fill="#30363d"/>
        <circle cx="68" cy="16" r="0.8" fill="#30363d"/>
        <rect x="14" y="29" width="52" height="4" rx="2" fill="url(#dw-handle)"/>
      </svg>
    `;
  }

  // ─────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────
  render() {
    if (!this.hass || !this.config) return html``;

    // If we have a device, prefer its registry name; else fall back to config.
    const deviceName =
      (this.config.device && this.hass.devices?.[this.config.device]?.name_by_user)
      ?? (this.config.device && this.hass.devices?.[this.config.device]?.name)
      ?? this.config.entity_prefix
      ?? 'Bosch Dishwasher';
    const name = this.config.name ?? deviceName;

    const running     = this._isRunning();
    const badge       = this._badge();
    const dwState     = running                          ? 'running'
                      : badge.cls === 'badge-finished'   ? 'finished'
                      : badge.cls === 'badge-aborted'    ? 'aborted'
                      :                                    'idle';
    const progress    = this._progress();
    const finishTime  = this._finishTime();
    const activeProgram   = this._state('active_program');
    const selectedProgram = this._state('selected_program');
    const _programKey = (activeProgram && activeProgram !== 'unavailable' && activeProgram !== 'unknown')
      ? activeProgram
      : selectedProgram;
    const displayProgram = (!_programKey || _programKey === 'unavailable' || _programKey === 'unknown')
      ? this._t('stopped')
      : programLabel(_programKey);
    const doorOpen   = this._isDoorOpen();
    const saltWarn   = this._isWarning('salt_warning');
    const rinseWarn  = this._isWarning('rinse_warning');
    const remoteOn   = this._state('remote_control') === 'on';

    const powerOn          = this._state('power') === 'on';
    const turboOn          = this._state('vario_speed') === 'on';
    const silenceState     = this._state('silence_on_demand');
    const silenceOn        = silenceState === 'on';
    const silenceAvailable = silenceState !== 'unavailable';
    const extraDryOn       = this._state('extra_dry') === 'on';
    const halfLoadOn       = this._state('half_load') === 'on';
    const programOptions   = this._attr('selected_program', 'options') ?? [];

    return html`
      <ha-card>
        <div class="card-content">
          <div class="header">
            <div class="dw-illustration">${this._renderDishwasher(dwState)}</div>
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

          <div class="sensors">
            <div class="sensor ${doorOpen ? 'warn' : ''}">
              <span class="sensor-icon">🚪</span>
              <span class="sensor-label">${this._t('door')}</span>
              <span class="sensor-value">${doorOpen ? this._t('door_open') : this._t('door_closed')}</span>
            </div>
            <div class="sensor ${saltWarn ? 'warn' : ''}">
              <span class="sensor-icon">🧂</span>
              <span class="sensor-label">${this._t('salt')}</span>
              <span class="sensor-value">${saltWarn ? this._t('salt_low') : this._t('ok')}</span>
            </div>
            <div class="sensor ${rinseWarn ? 'warn' : ''}">
              <span class="sensor-icon">💧</span>
              <span class="sensor-label">${this._t('rinse_aid')}</span>
              <span class="sensor-value">${rinseWarn ? this._t('salt_low') : this._t('ok')}</span>
            </div>
            <div class="sensor">
              <span class="sensor-icon">📡</span>
              <span class="sensor-label">${this._t('remote')}</span>
              <span class="sensor-value">${remoteOn ? this._t('on') : this._t('off')}</span>
            </div>
          </div>

          <div class="controls">
            <div class="controls-label">${this._t('controls')}</div>
            <div class="controls-row">
              <button class="ctrl-btn ${powerOn ? 'active' : ''}"
                      @click=${() => this._call('power','toggle')}>
                ⏻ ${powerOn ? this._t('on') : this._t('off')}
              </button>
              <select class="ctrl-select"
                      .value=${selectedProgram}
                      @change=${(e) => this._call('selected_program','select_option',{ option: e.target.value })}>
                ${programOptions.length === 0
                  ? html`<option disabled>—</option>`
                  : programOptions.map(opt => html`<option value="${opt}">${programLabel(opt)}</option>`)}
              </select>
              <button class="ctrl-btn danger" ?disabled=${!running}
                      @click=${() => this._call('stop_program','press')}>
                ⏹ ${this._t('stop')}
              </button>
            </div>
            <div class="controls-grid">
              <button class="ctrl-btn ${turboOn ? 'active' : ''}"
                      @click=${() => this._call('vario_speed','toggle')}>
                ⚡ ${this._t('turbo')}
              </button>
              <button class="ctrl-btn ${silenceOn ? 'active' : ''}" ?disabled=${!silenceAvailable}
                      @click=${() => this._call('silence_on_demand','toggle')}>
                🔇 ${this._t('silence')}
              </button>
              <button class="ctrl-btn ${extraDryOn ? 'active' : ''}"
                      @click=${() => this._call('extra_dry','toggle')}>
                🌡 ${this._t('extra_dry')}
              </button>
              <button class="ctrl-btn ${halfLoadOn ? 'active' : ''}"
                      @click=${() => this._call('half_load','toggle')}>
                ½ ${this._t('half_load')}
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
      content-visibility: auto;
      contain-intrinsic-size: 0 260px;
    }
    .card-content { padding: 16px; display: flex; flex-direction: column; gap: 12px; }
    .header { display: flex; align-items: flex-start; gap: 12px; }
    .dw-illustration {
      flex-shrink: 0; width: 72px; height: 100px;
      display: flex; align-items: center; justify-content: center;
      filter: drop-shadow(0 2px 6px rgba(0,0,0,0.5));
    }
    .header-info { flex: 1; min-width: 0; }
    .header-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px; }
    .card-name { font-weight: 700; font-size: 15px; }
    .badge { font-size: 10px; padding: 2px 8px; border-radius: 10px; font-weight: 700; letter-spacing: .5px; }
    .badge-running  { background: #00b4d8; color: #000; animation: blink-badge 1s step-end infinite; }
    .badge-finished { background: #34d39920; color: #34d399; border: 1px solid #34d39940; }
    .badge-aborted  { background: #ef444420; color: #ef4444; border: 1px solid #ef444440; }
    .badge-idle     { background: #21262d; color: #8b949e; }
    .program-line { color: #8b949e; font-size: 12px; margin-bottom: 5px; }
    .progress-bar { background: #21262d; height: 4px; border-radius: 2px; overflow: hidden; margin-bottom: 3px; }
    .progress-fill { height: 100%; background: linear-gradient(90deg, #00b4d8, #0077b6); border-radius: 2px; transition: width .5s ease; }
    .progress-label { font-size: 11px; color: #8b949e; }
    .bosch-dw { display: block; transition: opacity .3s; }
    .bosch-dw.idle { opacity: 0.55; }
    .bosch-dw .led { transition: fill .3s; }
    .bosch-dw .led-glow { transition: fill .3s, opacity .3s; opacity: 0; filter: blur(1.5px); }
    .bosch-dw.idle .led { fill: #444c56; }
    .bosch-dw.running .led, .bosch-dw.running .led-glow { fill: #00b4d8; }
    .bosch-dw.finished .led, .bosch-dw.finished .led-glow { fill: #34d399; }
    .bosch-dw.aborted .led, .bosch-dw.aborted .led-glow { fill: #ef4444; }
    .bosch-dw.running .led-glow, .bosch-dw.finished .led-glow, .bosch-dw.aborted .led-glow { opacity: 0.8; }
    .bosch-dw.running .led { animation: led-pulse 1.5s ease-in-out infinite; }
    .bosch-dw .display-text { transition: fill .3s; }
    .bosch-dw.idle .display-text { fill: #30363d; }
    .bosch-dw.finished .display-text { fill: #34d399; }
    .bosch-dw.aborted .display-text { fill: #ef4444; }
    .bosch-dw.running .display-text { animation: blink-text 1s step-end infinite; }
    .water-drops .drop { opacity: 0; }
    .bosch-dw.running .water-drops .drop { animation: drop-fall 2.2s linear infinite; }
    .bosch-dw.running .water-drops .d1 { animation-delay: 0s; }
    .bosch-dw.running .water-drops .d2 { animation-delay: 0.35s; }
    .bosch-dw.running .water-drops .d3 { animation-delay: 0.7s; }
    .bosch-dw.running .water-drops .d4 { animation-delay: 1.05s; }
    .bosch-dw.running .water-drops .d5 { animation-delay: 1.4s; }
    .bosch-dw.running .water-drops .d6 { animation-delay: 1.75s; }
    @keyframes drop-fall {
      0%   { transform: translateY(-4px); opacity: 0; }
      12%  { opacity: 0.85; }
      88%  { opacity: 0.85; }
      100% { transform: translateY(70px); opacity: 0; }
    }
    @keyframes led-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
    @keyframes blink-text { 0%, 100% { opacity: 1; } 50% { opacity: 0.45; } }
    @keyframes blink-badge { 0%, 100% { opacity: 1; } 50% { opacity: 0.65; } }
    .sensors { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
    .sensor { background: #161b22; border-radius: 6px; padding: 6px 8px; display: flex; align-items: center; gap: 6px; border: 1px solid #21262d; }
    .sensor.warn { border-color: #f59e0b; background: #f59e0b15; }
    .sensor-icon { font-size: 14px; }
    .sensor-label { color: #8b949e; font-size: 11px; flex: 1; }
    .sensor-value { font-size: 11px; color: #e6edf3; }
    .sensor.warn .sensor-value { color: #f59e0b; }
    .controls { border-top: 1px solid #21262d; padding-top: 10px; }
    .controls-label { color: #444c56; font-size: 10px; letter-spacing: 1px; margin-bottom: 6px; }
    .controls-row { display: flex; gap: 6px; margin-bottom: 6px; }
    .controls-row:last-child { margin-bottom: 0; }
    .controls-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
    .ctrl-btn {
      background: #21262d; border: 1px solid #30363d; border-radius: 6px;
      color: #8b949e; font-size: 11px; padding: 6px 10px; cursor: pointer;
      flex: 1; transition: border-color .15s, color .15s, background .15s;
    }
    .ctrl-btn:hover:not(:disabled) { border-color: #00b4d8; color: #00b4d8; }
    .ctrl-btn.active { background: #00b4d820; border-color: #00b4d850; color: #00b4d8; }
    .ctrl-btn.danger { color: #ef4444; border-color: #ef444440; }
    .ctrl-btn.danger:hover:not(:disabled) { background: #ef444420; border-color: #ef4444; }
    .ctrl-btn:disabled { opacity: 0.3; cursor: not-allowed; }
    .ctrl-select {
      flex: 2; background: #21262d; border: 1px solid #30363d; border-radius: 6px;
      color: #00b4d8; font-size: 11px; padding: 6px 8px; cursor: pointer; outline: none;
    }
    .ctrl-select:focus { border-color: #00b4d8; }
  `;
}

// ─────────────────────────────────────────────────────────────────
// GUI editor — gives users a device picker filtered to our integration
// ─────────────────────────────────────────────────────────────────
class BoschDishwasherCardEditor extends LitElement {
  static properties = {
    hass:    { attribute: false },
    _config: { state: true },
  };

  setConfig(config) {
    this._config = config;
  }

  _valueChanged(ev) {
    if (!this._config) return;
    const target = ev.target;
    const field = target.configValue;
    if (!field) return;
    const value = ev.detail?.value ?? target.value;
    const next = { ...this._config, [field]: value };
    if (field === 'name' && !value) delete next.name;
    this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: next } }));
  }

  render() {
    if (!this.hass || !this._config) return html``;
    return html`
      <div class="form">
        <ha-device-picker
          .hass=${this.hass}
          .value=${this._config.device ?? ''}
          .configValue=${'device'}
          .includeDomains=${['bosch_dishwasher']}
          label="Bosch dishwasher"
          @value-changed=${this._valueChanged}
        ></ha-device-picker>
        <ha-textfield
          .value=${this._config.name ?? ''}
          .configValue=${'name'}
          label="Name (optional)"
          @input=${this._valueChanged}
        ></ha-textfield>
      </div>
    `;
  }

  static styles = css`
    .form { display: flex; flex-direction: column; gap: 12px; padding: 8px 0; }
    ha-device-picker, ha-textfield { display: block; width: 100%; }
  `;
}

customElements.define('bosch-dishwasher-card', BoschDishwasherCard);
customElements.define('bosch-dishwasher-card-editor', BoschDishwasherCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'bosch-dishwasher-card',
  name: 'Bosch Dishwasher Card',
  description: 'Control and monitor a Bosch / Siemens / Neff / Balay dishwasher.',
  preview: false,
  documentationURL: 'https://github.com/iskael/bosch-dishwasher',
});
