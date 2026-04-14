# Home Connect Developer Portal — OAuth setup

The Bosch Dishwasher integration authenticates against Home Connect using **OAuth 2.0 Authorization Code Grant Flow**. There is no "API key" — what you need is a **Client ID** and **Client Secret** issued by the Home Connect Developer Portal.

You only do this once per HA install.

## Step 1 — Create a Home Connect Developer account

1. Go to <https://developer.home-connect.com/>
2. Click **Sign up** (top right)
3. Use the **same email address** that owns your Home Connect (Bosch / Siemens / Neff / Balay) consumer app account. Authorization later in the flow only works if the developer account email matches the appliance owner email.
4. Verify the email and finish the sign-up.

## Step 2 — Register an application

1. Sign in at <https://developer.home-connect.com/>
2. Open <https://developer.home-connect.com/applications/add>
3. Fill in the form:

   | Field | Value |
   |---|---|
   | **Application ID** | Anything unique, e.g. `ha-bosch-dishwasher` |
   | **Application name** | `Home Assistant Bosch Dishwasher` |
   | **Description** | Optional |
   | **OAuth Flow** | **Authorization Code Grant Flow** |
   | **Home Connect User Account for Testing** | The email from Step 1 |
   | **Redirect URI** | `https://my.home-assistant.io/redirect/oauth` |
   | **Enable One Time Token Mode** | Off |
   | **Enable Proof Key for Code Exchange** | Off |

4. **Submit**. The portal returns to your application detail page.

## Step 3 — Copy Client ID and Client Secret

On the application detail page you'll see:

- **Client ID** — long string, looks like `0123456789ABCDEF...`
- **Client Secret** — click **Show** to reveal it, copy it now (you can re-reveal later if needed)

Keep this tab open. You'll paste both into Home Assistant in the next step.

## Step 4 — Add the credentials to Home Assistant

1. **Settings → Devices & Services → ⋮ (top right) → Application Credentials**
2. **Add Application**
3. **Integration**: pick `Bosch Dishwasher`
4. **Name**: anything, e.g. `Home Connect`
5. **Client ID**: paste from Step 3
6. **Client Secret**: paste from Step 3
7. **Add**

## Step 5 — Add the integration

1. **Settings → Devices & Services → Add Integration**
2. Search for **Bosch Dishwasher** and click it
3. HA opens the Home Connect login in a new browser tab
4. Sign in with your Home Connect consumer account (same email as Step 1)
5. Authorize the application
6. The browser bounces back to HA and the integration loads
7. Every dishwasher on the account is created as a device

## Troubleshooting

- **`invalid_redirect_uri`** — your application's Redirect URI is not exactly `https://my.home-assistant.io/redirect/oauth`. Edit it in the developer portal and try again.
- **`invalid_client`** — Client ID or Client Secret was mistyped. Re-add the application credential.
- **Authorization succeeds but no devices appear** — the Home Connect account you authorized doesn't own any dishwashers (or they're not paired in the consumer app yet). Pair the appliance in the Bosch / Siemens / Neff / Balay app first.
- **Authorization redirect doesn't come back** — your HA must be reachable from the browser. The `my.home-assistant.io` redirector then bounces to your local instance. If you don't have `my.home-assistant.io` enabled in HA, enable it via **Settings → System → Network → Home Assistant Cloud / My Home Assistant**.
- **Re-authentication keeps prompting** — the Home Connect refresh token expired. Click **Reconfigure** on the integration and walk the OAuth flow again with the same account.

## Token lifetime

Home Connect refresh tokens are long-lived but not eternal. The integration handles renewal automatically; if it expires you'll see a repair item in HA prompting reauth.
