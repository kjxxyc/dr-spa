import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, NgZone, PLATFORM_ID, inject } from '@angular/core';

/** Custom element registered by the LeadConnector loader (index.html). */
const WIDGET_TAG = 'chat-widget';
/** Round launcher button inside the widget's (open) shadow root. */
const BUTTON_SELECTOR = '#lc_text-widget--btn.lc_text-widget--bubble';
const STYLE_ID = 'dradonis-chat-aura';
const POLL_MS = 500;
/** The loader is deferred and hydrates a few seconds after load; stop waiting after this. */
const MAX_WAIT_MS = 60_000;

/**
 * Pulse rings behind the launcher — the same "aura" the floating WhatsApp
 * button had (see shared/whatsapp-btn). The ring colour follows the widget's
 * own CSS variable, so recolouring the widget in GHL keeps them in sync.
 * Hidden while the chat panel is open (host gets data-active="true").
 */
const AURA_CSS = `
${BUTTON_SELECTOR} { overflow: visible; }
${BUTTON_SELECTOR}::before,
${BUTTON_SELECTOR}::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: var(--chat-widget-bubble-color, #155eef);
  z-index: -1;
  pointer-events: none;
  animation: dradonis-chat-pulse 2.4s infinite cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
${BUTTON_SELECTOR}::after { animation-delay: 1.2s; }
:host([data-active="true"]) ${BUTTON_SELECTOR}::before,
:host([data-active="true"]) ${BUTTON_SELECTOR}::after { display: none; }
@media (prefers-reduced-motion: reduce) {
  ${BUTTON_SELECTOR}::before,
  ${BUTTON_SELECTOR}::after { display: none; }
}
@keyframes dradonis-chat-pulse {
  0%   { transform: scale(1);   opacity: 0.6; }
  100% { transform: scale(1.8); opacity: 0; }
}
`;

/**
 * Adds the WhatsApp-style pulsing aura to the agency's LeadConnector chat
 * launcher. The widget renders inside an open shadow root, so page CSS can't
 * reach its button; this injects one <style> into that shadow root once the
 * launcher exists and re-adds it if the widget ever re-renders its tree.
 * Nothing about the widget's behaviour, markup or loading is changed.
 */
@Injectable({
  providedIn: 'root'
})
export class ChatWidgetAuraService {
  private document = inject(DOCUMENT);
  private platformId = inject(PLATFORM_ID);
  private zone = inject(NgZone);
  private started = false;

  init(): void {
    if (this.started || !isPlatformBrowser(this.platformId)) {
      return;
    }
    if (typeof customElements === 'undefined') {
      return;
    }
    this.started = true;

    // Polling outside Angular so the timers never trigger change detection.
    this.zone.runOutsideAngular(() => {
      customElements
        .whenDefined(WIDGET_TAG)
        .then(() => this.waitForLauncher(Date.now()))
        .catch(() => undefined);
    });
  }

  private waitForLauncher(startedAt: number): void {
    const root = this.document.querySelector(WIDGET_TAG)?.shadowRoot;
    if (root?.querySelector(BUTTON_SELECTOR)) {
      this.inject(root);
      return;
    }
    if (Date.now() - startedAt < MAX_WAIT_MS) {
      setTimeout(() => this.waitForLauncher(startedAt), POLL_MS);
    }
  }

  private inject(root: ShadowRoot): void {
    if (root.getElementById(STYLE_ID)) {
      return;
    }
    const style = this.document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = AURA_CSS;
    root.appendChild(style);

    new MutationObserver(() => {
      if (!root.getElementById(STYLE_ID)) {
        root.appendChild(style);
      }
    }).observe(root, { childList: true });
  }
}
