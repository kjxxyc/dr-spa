import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Single site-wide footer: "© Copyright <year>, Dr. Adonis. All Rights Reserved".
 * The year is computed at render time so it never goes stale.
 * Keeps the .developer-footer class so the existing global styles
 * (styles.scss) and per-layout sticky-footer rules keep applying.
 */
@Component({
    selector: 'app-site-footer',
    standalone: true,
    imports: [TranslateModule],
    template: `
        <footer class="developer-footer">
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
    `],
})
export class SiteFooterComponent {
    readonly year = new Date().getFullYear();
}
