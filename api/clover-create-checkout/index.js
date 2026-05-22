/**
 * Azure Function: clover-create-checkout
 *
 * Creates a Clover Hosted Checkout session and returns the public checkout
 * URL (`href`). The frontend redirects the user to this URL — unlike the
 * `/pay-widgets/[uuid]` endpoint, Hosted Checkout URLs are real public
 * pages that work in every browser (including Chrome iOS).
 *
 * Required environment variables (configured in Azure portal as
 * Application Settings, NEVER committed to git):
 *   - CLOVER_MERCHANT_ID         Merchant identifier (e.g. ABC123XYZ456)
 *   - CLOVER_ECOMM_API_TOKEN     Private Ecommerce API token (Bearer)
 * Optional:
 *   - CLOVER_API_BASE            Default 'https://api.clover.com'
 *                                Use 'https://apisandbox.dev.clover.com'
 *                                for sandbox testing.
 *   - CLOVER_PRODUCT_NAME        Default 'Tadalafil (Cialis) 20mg'
 *   - CLOVER_PRODUCT_PRICE_CENTS Default '1999' ($19.99)
 *
 * Endpoint reference:
 *   POST https://api.clover.com/invoicingcheckoutservice/v1/checkouts
 *   Docs: https://docs.clover.com/dev/docs/hosted-checkout-api
 */

const ALLOWED_ORIGINS = [
    'https://dradonis.com',
    'https://www.dradonis.com',
    // Azure SWA preview deployments (per-branch URLs)
    /^https:\/\/[a-z0-9-]+\.azurestaticapps\.net$/i,
    // Local dev with SWA CLI
    'http://localhost:4280',
    'http://localhost:4200',
];

function pickCorsOrigin(originHeader) {
    if (!originHeader) return null;
    for (const allowed of ALLOWED_ORIGINS) {
        if (typeof allowed === 'string' && allowed === originHeader) return originHeader;
        if (allowed instanceof RegExp && allowed.test(originHeader)) return originHeader;
    }
    return null;
}

function corsHeaders(originHeader) {
    const origin = pickCorsOrigin(originHeader);
    const headers = {
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '3600',
        'Vary': 'Origin',
    };
    if (origin) headers['Access-Control-Allow-Origin'] = origin;
    return headers;
}

/** Basic sanity check on contact payload — keeps junk out of Clover. */
function validateContact(contact) {
    if (!contact || typeof contact !== 'object') return 'contact missing';
    const { name, email, phone, address } = contact;
    if (!name || typeof name !== 'string' || name.length < 2) return 'invalid name';
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'invalid email';
    if (!phone || !/^[0-9]{7,15}$/.test(String(phone).replace(/\D/g, ''))) return 'invalid phone';
    if (!address || typeof address !== 'string' || address.length < 3) return 'invalid address';
    return null;
}

module.exports = async function (context, req) {
    const origin = req.headers['origin'] || req.headers['Origin'];
    const cors = corsHeaders(origin);

    // CORS preflight
    if (req.method === 'OPTIONS') {
        context.res = { status: 204, headers: cors };
        return;
    }

    // Read env config
    const merchantId = process.env.CLOVER_MERCHANT_ID;
    const apiToken = process.env.CLOVER_ECOMM_API_TOKEN;
    const apiBase = process.env.CLOVER_API_BASE || 'https://api.clover.com';
    const productName = process.env.CLOVER_PRODUCT_NAME || 'Tadalafil (Cialis) 20mg';
    const productPriceCents = parseInt(process.env.CLOVER_PRODUCT_PRICE_CENTS || '1999', 10);

    if (!merchantId || !apiToken) {
        context.log.error('Missing CLOVER_MERCHANT_ID or CLOVER_ECOMM_API_TOKEN env vars');
        context.res = {
            status: 500,
            headers: { ...cors, 'Content-Type': 'application/json' },
            body: { error: 'server_not_configured' },
        };
        return;
    }

    // Validate input
    const contact = (req.body && req.body.contact) || null;
    const contactError = validateContact(contact);
    if (contactError) {
        context.res = {
            status: 400,
            headers: { ...cors, 'Content-Type': 'application/json' },
            body: { error: 'invalid_contact', detail: contactError },
        };
        return;
    }

    // Split full name into firstName / lastName (best-effort).
    const nameParts = contact.name.trim().split(/\s+/);
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || firstName;

    const checkoutBody = {
        customer: {
            email: contact.email,
            firstName,
            lastName,
            phoneNumber: String(contact.phone).replace(/\D/g, ''),
        },
        shoppingCart: {
            lineItems: [
                {
                    name: productName,
                    price: productPriceCents,
                    unitQty: 1,
                },
            ],
        },
    };

    let cloverRes;
    try {
        cloverRes = await fetch(
            `${apiBase}/invoicingcheckoutservice/v1/checkouts`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiToken}`,
                    'X-Clover-Merchant-Id': merchantId,
                    'Content-Type': 'application/json',
                    'accept': 'application/json',
                },
                body: JSON.stringify(checkoutBody),
            },
        );
    } catch (err) {
        context.log.error('Network error calling Clover:', err);
        context.res = {
            status: 502,
            headers: { ...cors, 'Content-Type': 'application/json' },
            body: { error: 'clover_unreachable' },
        };
        return;
    }

    const responseText = await cloverRes.text();
    let parsed;
    try {
        parsed = JSON.parse(responseText);
    } catch {
        parsed = null;
    }

    if (!cloverRes.ok || !parsed || !parsed.href) {
        context.log.error('Clover API error', {
            status: cloverRes.status,
            body: responseText.slice(0, 500),
        });
        context.res = {
            status: 502,
            headers: { ...cors, 'Content-Type': 'application/json' },
            body: {
                error: 'clover_api_error',
                status: cloverRes.status,
            },
        };
        return;
    }

    context.res = {
        status: 200,
        headers: { ...cors, 'Content-Type': 'application/json' },
        body: {
            href: parsed.href,
            checkoutSessionId: parsed.checkoutSessionId || null,
        },
    };
};
