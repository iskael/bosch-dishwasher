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
