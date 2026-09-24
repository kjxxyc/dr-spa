/**
 * GoHighLevel / LeadConnector appointment form embedded by the agency
 * (white-labelled at brand.dradonis.com). Single source for every place
 * that renders or pre-warms it: the appointment dialog, /contact,
 * /makeanappointment and AppointmentPrefetchService.
 */
export const GHL_FORM_ORIGIN = 'https://brand.dradonis.com';
export const GHL_FORM_URL = `${GHL_FORM_ORIGIN}/widget/form/ISdbjfvFOOPm2YQArfiL`;
/** Resizer/bridge script every inline form iframe needs (loaded on demand). */
export const GHL_EMBED_SCRIPT_URL = `${GHL_FORM_ORIGIN}/js/form_embed.js`;
export const GHL_EMBED_SCRIPT_ID = 'ghl-form-embed-script';
/** CDN the form's HTML pulls its ~25 static assets (JS/CSS/fonts) from. */
export const GHL_ASSET_ORIGIN = 'https://stcdn.leadconnectorhq.com';
