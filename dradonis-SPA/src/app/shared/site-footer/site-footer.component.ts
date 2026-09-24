import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Single site-wide footer.
 *
 * Carries the service-area (Florida) disclosure, the emergency disclaimer,
 * and business contact — plus the copyright line.
 * The year is computed at render time so it never goes stale.
 * Keeps the .developer-footer class so the existing global styles
 * (styles.scss) and per-layout sticky-footer rules keep applying.
 */
@Component({
    selector: 'app-site-footer',
    standalone: true,
    imports: [TranslateModule],
    template: `
        <footer class="developer-footer site-footer">
            <p class="footer-disclosure">
                {{ 'footer.serviceArea' | translate }}
                <strong>{{ 'footer.emergency' | translate }}</strong>
            </p>
            <p class="footer-contact">Dr. Adonis Clinic — Adonis Maiquez, MD · Miami, Florida ·
                <a href="tel:+13052904691">(305) 290-4691</a>
            </p>
            <span>{{ 'footer.copyright' | translate: { year: year } }}</span>
        </footer>
    `,
    styles: [`
        /* The host is the flex child of every sticky-footer layout
           (.public-layout, .cardecal-page, .blank-layout-container). */
        :host {
            display: block;
            width: 100%;
            margin-top: auto;
        }
        .site-footer {
            display: flex;
            flex-direction: column;
            gap: 0.4rem;
            align-items: center;
            text-align: center;
            padding: 1.1rem 1rem 1rem;
        }
        .footer-disclosure {
            max-width: 720px;
            margin: 0;
            font-size: 0.68rem;
            line-height: 1.45;
            opacity: 0.55;
        }
        .footer-disclosure strong { font-weight: 600; }
        .footer-contact {
            margin: 0;
            font-size: 0.7rem;
            opacity: 0.6;
        }
        .footer-contact a { color: inherit; text-decoration: none; }
    `],
})
export class SiteFooterComponent {
    readonly year = new Date().getFullYear();
}
