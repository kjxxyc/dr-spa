import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import {
  GHL_ASSET_ORIGIN,
  GHL_EMBED_SCRIPT_ID,
  GHL_EMBED_SCRIPT_URL,
  GHL_FORM_ORIGIN,
  GHL_FORM_URL,
} from '../../shared/appointment-dialog/ghl-form.constants';

const WARM_IFRAME_ID = 'dradonis-appointment-form-warm';
/** Long enough for the form to finish downloading its assets; then it is dropped. */
const WARM_IFRAME_TTL_MS = 20_000;

/**
 * Warms up everything the appointment form needs BEFORE the visitor clicks
 * a CTA, so the dialog (or /contact) shows the form almost immediately:
 *
 *  1. the dialog's lazy chunk,
 *  2. TLS connections to the form origin and its asset CDN,
 *  3. the GHL embed/resizer script (same id the components check for),
 *  4. a hidden copy of the form, so its HTML, JS, CSS and fonts are in the
 *     HTTP cache when the real iframe is created.
 *
 * Triggered on intent only (hover/focus on a CTA, opening the mobile menu),
 * never on page load — it must not cost PageSpeed nor run for visitors who
 * never reach for the form. Idempotent.
 */
@Injectable({
  providedIn: 'root'
})
export class AppointmentPrefetchService {
  private document = inject(DOCUMENT);
  private platformId = inject(PLATFORM_ID);
  private warmed = false;

  warm(): void {
    if (this.warmed || !isPlatformBrowser(this.platformId)) {
      return;
    }
    this.warmed = true;

    import('../../shared/appointment-dialog/appointment-dialog.component').catch(() => undefined);
    this.addLink('preconnect', GHL_FORM_ORIGIN);
    this.addLink('preconnect', GHL_ASSET_ORIGIN);
    this.loadEmbedScript();
    this.warmForm();
  }

  private addLink(rel: string, href: string): void {
    const link = this.document.createElement('link');
    link.rel = rel;
    link.href = href;
    link.crossOrigin = 'anonymous';
    this.document.head.appendChild(link);
  }

  private loadEmbedScript(): void {
    if (this.document.getElementById(GHL_EMBED_SCRIPT_ID)) {
      return;
    }
    const script = this.document.createElement('script');
    script.id = GHL_EMBED_SCRIPT_ID;
    script.src = GHL_EMBED_SCRIPT_URL;
    script.async = true;
    this.document.body.appendChild(script);
  }

  private warmForm(): void {
    if (this.document.getElementById(WARM_IFRAME_ID)) {
      return;
    }
    // The form is nested inside a same-origin srcdoc frame on purpose: the GHL
    // embed script manages every form iframe it finds in THIS document
    // (hides it, resizes it, un-hides it on "iframeLoaded"), and must never
    // touch the warm-up copy. Nested, it is invisible to that script and the
    // form's postMessages stay inside the wrapper.
    const wrapper = this.document.createElement('iframe');
    wrapper.id = WARM_IFRAME_ID;
    wrapper.title = '';
    wrapper.tabIndex = -1;
    wrapper.setAttribute('aria-hidden', 'true');
    wrapper.style.cssText =
      'position:fixed;top:0;left:0;width:600px;height:900px;opacity:0;visibility:hidden;pointer-events:none;z-index:-1;border:0;';
    wrapper.srcdoc =
      `<!doctype html><html><body style="margin:0">` +
      `<iframe src="${GHL_FORM_URL}" title="" style="width:600px;height:900px;border:0"></iframe>` +
      `</body></html>`;
    this.document.body.appendChild(wrapper);

    setTimeout(() => wrapper.remove(), WARM_IFRAME_TTL_MS);
  }
}
