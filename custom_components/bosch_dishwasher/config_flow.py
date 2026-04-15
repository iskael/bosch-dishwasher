"""Config flow for Bosch dishwasher."""

from __future__ import annotations

from collections.abc import Mapping
import logging
from typing import Any

import jwt
import voluptuous as vol

from homeassistant.config_entries import SOURCE_REAUTH, ConfigFlowResult
from homeassistant.helpers import config_entry_oauth2_flow

from .const import DOMAIN


class OAuth2FlowHandler(
    config_entry_oauth2_flow.AbstractOAuth2FlowHandler, domain=DOMAIN
):
    """Handle Bosch dishwasher OAuth."""

    DOMAIN = DOMAIN
    VERSION = 1

    @property
    def logger(self) -> logging.Logger:
        """Return flow logger."""
        return logging.getLogger(__name__)

    async def async_step_reauth(
        self,
        entry_data: Mapping[str, Any],
    ) -> ConfigFlowResult:
        """Start reauth flow."""
        return await self.async_step_reauth_confirm()

    async def async_step_reauth_confirm(
        self,
        user_input: dict[str, Any] | None = None,
    ) -> ConfigFlowResult:
        """Confirm reauth."""
        if user_input is None:
            return self.async_show_form(step_id="reauth_confirm", data_schema=vol.Schema({}))
        return await self.async_step_user()

    async def async_oauth_create_entry(self, data: dict) -> ConfigFlowResult:
        """Create or update entry after OAuth."""
        try:
            payload = jwt.decode(
                data["token"]["access_token"],
                options={"verify_signature": False},
            )
            unique_id = payload["sub"]
        except (jwt.DecodeError, jwt.InvalidTokenError, KeyError, TypeError):
            self.logger.warning(
                "Home Connect returned a token we cannot decode; aborting"
            )
            return self.async_abort(reason="oauth_error")
        await self.async_set_unique_id(unique_id)
        if self.source == SOURCE_REAUTH:
            self._abort_if_unique_id_mismatch(reason="wrong_account")
            return self.async_update_reload_and_abort(
                self._get_reauth_entry(),
                data_updates=data,
                reason="reauth_successful",
            )
        self._abort_if_unique_id_configured()
        return self.async_create_entry(title="Bosch Dishwasher", data=data)
