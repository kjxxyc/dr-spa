# dradonis API — Azure Static Web Apps Managed Functions

Azure Functions (Node 18+) deployed as part of the SWA. Currently hosts one
endpoint: **`/api/clover-create-checkout`** — server-side Clover Hosted
Checkout session creation.

## Why this exists

Clover's `/pay-widgets/[uuid]` URL is **not designed to be visited directly**
(its CSP forbids embedding outside `*.clover.com`, and Chrome iOS mis-flags
the response as a `.txt` download). The only way to get a public Clover
checkout URL is via the Hosted Checkout API, which requires a server-side
call because the Ecommerce API token must stay secret.

The frontend (Angular) calls this Function; the Function calls Clover with
the token; Clover returns a public `https://www.clover.com/checkout/[id]`
URL that works in every browser.

## Configuration — Azure Portal

These values are **secrets**. They live in the Azure portal as Application
Settings, NOT in git.

### Steps to configure

1. Sign in to <https://portal.azure.com>
2. Open your Static Web App resource (`delightful-sea-01938fb10`)
3. Left sidebar → **Configuration** → **Application settings** tab
4. Click **+ Add** for each of the variables below
5. Save (the Function restarts automatically)

### Required variables

| Name | Value | Where to get it |
|---|---|---|
| `CLOVER_MERCHANT_ID` | Your Clover Merchant ID (e.g. `ABC123XYZ456`) | Clover dashboard → Account & Setup → About (or top-right of dashboard) |
| `CLOVER_ECOMM_API_TOKEN` | **Private** Ecommerce API token | Clover dashboard → Setup → API Tokens → Create new → permissions: Read merchant, Read/Write orders, Read/Write payments, Read/Write ecommerce |

### Optional overrides

| Name | Default | Notes |
|---|---|---|
| `CLOVER_API_BASE` | `https://api.clover.com` | Use `https://apisandbox.dev.clover.com` for sandbox testing |
| `CLOVER_PRODUCT_NAME` | `Tadalafil (Cialis) 20mg` | Shows on the Clover checkout line item |
| `CLOVER_PRODUCT_PRICE_CENTS` | `1999` | Price in cents — 1999 = $19.99 |

## Local development

```bash
cd api
cp local.settings.json.example local.settings.json
# Edit local.settings.json with your sandbox credentials
npm install
npx swa start ../dradonis-SPA/dist/Spike/browser --api-location .
```

Then visit <http://localhost:4280>. The Angular frontend will hit
`/api/clover-create-checkout` against the local Functions runtime.

`local.settings.json` is in `.gitignore` — never commit it.

## Endpoint

### `POST /api/clover-create-checkout`

**Request body**
```json
{
  "contact": {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "3055551234",
    "address": "123 Main St, Miami FL"
  },
  "lang": "es"
}
```

**Success response (200)**
```json
{
  "href": "https://www.clover.com/checkout/abc123def456",
  "checkoutSessionId": "abc123def456"
}
```

**Error responses**
- `400 invalid_contact` — missing/malformed contact fields
- `500 server_not_configured` — env vars missing on the Function
- `502 clover_unreachable` — network error hitting Clover
- `502 clover_api_error` — Clover rejected the request (check Function logs in Azure portal → Monitor)

## CI/CD

The GitHub Actions workflow (`.github/workflows/azure-static-web-apps-*.yml`)
auto-deploys both the Angular SPA and this `/api` folder on every push to
`master`. The `api_location: "api"` line in the workflow points to this
folder.
