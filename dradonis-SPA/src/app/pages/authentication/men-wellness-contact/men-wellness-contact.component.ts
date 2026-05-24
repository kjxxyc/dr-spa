import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { LanguageSelectorDialogComponent } from '../../../shared/language-selector-dialog/language-selector-dialog.component';
import { SeoService } from '../../../shared/seo/seo.service';

// ---------- translations (landing-page) ----------
const TRANSLATIONS: Record<string, Record<string, string>> = {
    en: {
        heroTitle: 'Regain confidence and spontaneity in your intimate moments.',
        heroSubtitle: 'A safe medical process, designed exclusively for men seeking absolute discretion and real solutions.',
        benefit1: 'Easy and secure process.',
        benefit2: 'Private and comfortable, all from your phone.',
        benefit3: 'Confidential delivery right to your door.',
        ctaButton: 'Start my digital medical consultation',
        timeEstimate: 'Takes only 2 minutes',
        securityMessage: 'The data shared in this form is handled under strict security and encryption standards. The information is exclusively used for processing your request and will not be shared with third parties under any circumstances.',
        langToggle: 'Español',
    },
    es: {
        heroTitle: 'Recupera la confianza y la espontaneidad en tus momentos íntimos.',
        heroSubtitle: 'Un proceso médico seguro, diseñado exclusivamente para hombres que buscan discreción absoluta y soluciones reales.',
        benefit1: 'Proceso fácil y seguro.',
        benefit2: 'Privado y cómodo, todo desde tu celular.',
        benefit3: 'Entrega confidencial directamente a tu puerta.',
        ctaButton: 'Comenzar mi consulta médica digital',
        timeEstimate: 'Toma 2 minutos',
        securityMessage: 'Los datos compartidos en este formulario se manejan bajo estrictos estándares de seguridad y cifrado. La información es de uso exclusivo para el procesamiento de tu solicitud y no será compartida con terceros bajo ningún concepto.',
        langToggle: 'English',
    },
};

@Component({
    selector: 'app-men-wellness-contact',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
    ],
    templateUrl: './men-wellness-contact.component.html',
    styleUrls: ['./men-wellness-contact.component.scss'],
})
export class MenWellnessContactComponent implements OnInit, OnDestroy {
    lang: 'en' | 'es' = 'en';

    constructor(
        private router: Router,
        private dialog: MatDialog,
        private seo: SeoService,
        @Inject(PLATFORM_ID) private platformId: Object,
    ) { }

    ngOnInit(): void {
        // SEO: physician-prescribed Tadalafil consultation positioning.
        // Focus on local Miami/Florida search intent, not "buy online" terms.
        // SEO runs in both SSR and browser — safe (no window access).
        this.applySeo();

        // Browser-only: language dialog + tracking pixels (touch `window`).
        // Skipping these during SSR prevents `ReferenceError: window is not defined`.
        if (!isPlatformBrowser(this.platformId)) return;

        // Show language selector dialog on entry (same as Cardecal)
        this.openLanguageDialog();

        // Meta Pixel: load SDK and fire PageView on this page.
        this.loadPixel();

        // TikTok Pixel: load SDK and fire PageView on this page.
        this.loadTikTokPixel();
    }

    /**
     * Apply SEO metadata for this route. Re-runs whenever the user toggles
     * language so the localized title/description take effect immediately
     * (Google's crawler may also pick up the localized version of this URL
     * via hreflang in sitemap.xml).
     */
    private applySeo(): void {
        // Build URL from active origin so it auto-switches between
        // my.dradonis.com (current) and dradonis.com (post-migration)
        // without code changes.
        const url = this.seo.absoluteUrl('/men-wellness');
        if (this.lang === 'es') {
            this.seo.apply({
                title: 'Bienestar Masculino & Disfunción Eréctil | Dr. Adonis Miami',
                description: 'Evaluación médica privada para hombres en Miami. Consultas para vitalidad, energía y tratamiento de disfunción eréctil. Prescripción médica de Tadalafil (Cialis) con entrega local. Atendemos Miami, Coral Gables, Aventura, Doral, Hialeah y Fort Lauderdale.',
                keywords: 'bienestar masculino Miami, disfunción eréctil Miami, médico Tadalafil Florida, evaluación médica online Miami, doctor Cialis Miami, salud sexual hombre Miami, telemedicina hombres Florida, Dr. Adonis',
                url,
                lang: 'es',
                jsonLd: this.buildJsonLd('es', url),
            });
        } else {
            this.seo.apply({
                title: "Men's Wellness & ED Consultation | Dr. Adonis Miami",
                description: "Private medical evaluation for men in Miami. Consultations for vitality, energy, and erectile dysfunction. Physician-prescribed Tadalafil (Cialis) with local pickup or delivery. Serving Miami, Coral Gables, Aventura, Doral, Hialeah and Fort Lauderdale.",
                keywords: "men's wellness Miami, ED treatment Miami, Tadalafil prescription Florida, online medical evaluation Miami, Cialis doctor Miami, men's sexual health Miami, telehealth men Florida, Dr. Adonis",
                url,
                lang: 'en',
                jsonLd: this.buildJsonLd('en', url),
            });
        }
    }

    /**
     * JSON-LD for the men-wellness landing page. Uses MedicalBusiness +
     * MedicalProcedure schema so Google understands this is a licensed
     * medical service (not an unregulated e-commerce listing).
     */
    private buildJsonLd(lang: 'en' | 'es', url: string): Record<string, unknown> {
        const isEs = lang === 'es';
        const origin = this.seo.origin;
        return {
            '@context': 'https://schema.org',
            '@graph': [
                {
                    '@type': 'MedicalBusiness',
                    '@id': `${origin}/#medicalbusiness`,
                    name: 'Dr. Adonis Maiquez - Functional & Regenerative Medicine',
                    url: origin,
                    telephone: '+1-305-204-7816',
                    image: `${origin}/assets/images/logos/Logo_720x192.jpg`,
                    priceRange: '$$',
                    address: {
                        '@type': 'PostalAddress',
                        addressLocality: 'Miami',
                        addressRegion: 'FL',
                        addressCountry: 'US',
                    },
                    areaServed: [
                        { '@type': 'City', name: 'Miami' },
                        { '@type': 'City', name: 'Coral Gables' },
                        { '@type': 'City', name: 'Aventura' },
                        { '@type': 'City', name: 'Doral' },
                        { '@type': 'City', name: 'Hialeah' },
                        { '@type': 'City', name: 'Pembroke Pines' },
                        { '@type': 'City', name: 'Fort Lauderdale' },
                        { '@type': 'City', name: 'Boca Raton' },
                    ],
                    medicalSpecialty: ['Functional Medicine', 'Regenerative Medicine', "Men's Health"],
                    availableLanguage: ['English', 'Spanish'],
                },
                {
                    '@type': 'MedicalWebPage',
                    '@id': `${url}#webpage`,
                    url,
                    inLanguage: isEs ? 'es-US' : 'en-US',
                    name: isEs
                        ? 'Bienestar Masculino & Disfunción Eréctil'
                        : "Men's Wellness & ED Consultation",
                    description: isEs
                        ? 'Página informativa sobre la evaluación médica para tratamiento de disfunción eréctil con Tadalafil (Cialis) en Miami, Florida.'
                        : 'Landing page for ED medical evaluation and Tadalafil (Cialis) prescription service in Miami, Florida.',
                    about: {
                        '@type': 'MedicalCondition',
                        name: 'Erectile Dysfunction',
                        alternateName: ['ED', 'Disfunción Eréctil'],
                    },
                    audience: {
                        '@type': 'PeopleAudience',
                        suggestedGender: 'Male',
                        suggestedMinAge: 21,
                        suggestedMaxAge: 80,
                    },
                },
            ],
        };
    }

    /** Open the language selector dialog (disableClose forces user to pick). */
    openLanguageDialog(): void {
        const dialogRef = this.dialog.open(LanguageSelectorDialogComponent, {
            disableClose: true,
            panelClass: 'language-selector-panel',
        });
        dialogRef.afterClosed().subscribe((lang: string) => {
            if (lang) {
                this.lang = lang as 'en' | 'es';
            }
        });
    }

    ngOnDestroy(): void {
        // SEO reset is SSR-safe (no window access).
        this.seo.reset();
        // Pixel trace removal touches `window` and only matters in the browser.
        if (!isPlatformBrowser(this.platformId)) return;
        this.removePixelTraces();
        this.removeTikTokTraces();
    }

    /** Translation helper */
    t(key: string): string {
        return TRANSLATIONS[this.lang]?.[key] ?? key;
    }

    get bannerImage(): string {
        return this.lang === 'en'
            ? '/assets/images/tadalafil-cialis-en.webp'
            : '/assets/images/tadalafil-cialis-es.webp';
    }

    get otherFlagIcon(): string {
        return this.lang === 'en'
            ? '/assets/images/flag/icon-flag-es.svg'
            : '/assets/images/flag/icon-flag-en.svg';
    }

    toggleLanguage(): void {
        this.lang = this.lang === 'en' ? 'es' : 'en';
        // Re-apply SEO so title/description/og:locale switch immediately.
        this.applySeo();
    }

    /** Handle CTA button click */
    onStartConsultation(): void {
        // Meta Pixel: fire Lead event on CTA click
        const w = window as any;
        if (typeof w.fbq === 'function') {
            w.fbq('track', 'Lead');
        }

        // Navigate to the evaluation form, passing language via router state
        this.router.navigate(['/men-wellness/evaluation'], {
            state: { lang: this.lang },
        });
    }

    // ─── Meta Pixel ──────────────────────────────────────────────────

    /** Load the Facebook SDK and fire PageView. */
    private loadPixel(): void {
        const w = window as any;
        if (w.fbq) return; // already loaded globally
        const n: any = (w.fbq = function () {
            n.callMethod
                ? n.callMethod.apply(n, arguments)
                : n.queue.push(arguments);
        });
        if (!w._fbq) w._fbq = n;
        n.push = n;
        n.loaded = true;
        n.version = '2.0';
        n.queue = [];
        const t = document.createElement('script');
        t.async = true;
        t.src = 'https://connect.facebook.net/en_US/fbevents.js';
        const s = document.getElementsByTagName('script')[0];
        s.parentNode?.insertBefore(t, s);
        w.fbq('init', '34862161576760674');
        w.fbq('track', 'PageView');
    }

    /** Remove ALL traces of the Meta Pixel from the page. */
    private removePixelTraces(): void {
        const w = window as any;

        // Replace with no-op first so lingering callbacks don't re-create
        const noop = function () { };
        w.fbq = noop;
        w._fbq = noop;

        // Remove Facebook SDK scripts
        document.querySelectorAll('script[src*="connect.facebook.net"]').forEach(el => el.remove());
        document.querySelectorAll('script[src*="facebook.com"]').forEach(el => el.remove());

        // Remove tracking pixel images
        document.querySelectorAll('img[src*="facebook.com/tr"]').forEach(el => el.remove());

        // Remove Facebook iframes
        document.querySelectorAll('iframe[src*="facebook.com"]').forEach(el => el.remove());
        document.querySelectorAll('iframe[src*="facebook.net"]').forEach(el => el.remove());

        // Clean up ALL known Facebook SDK globals
        const fbGlobals = ['fbq', '_fbq', '__fbeventsModules', 'fbEvents',
            '_fbq_gtm', 'FB', '__fb_ev', 'fbds'];
        fbGlobals.forEach(key => {
            try { delete w[key]; } catch (_) { w[key] = undefined; }
        });
    }

    // ─── TikTok Pixel ────────────────────────────────────────────────

    /** Load the TikTok Pixel SDK and fire PageView. */
    private loadTikTokPixel(): void {
        const w = window as any;
        if (w.ttq) return; // already loaded

        w.TiktokAnalyticsObject = 'ttq';
        const ttq: any = (w.ttq = w.ttq || []);
        ttq.methods = ['page', 'track', 'identify', 'instances', 'debug', 'on', 'off', 'once', 'ready', 'alias', 'group', 'enableCookie', 'disableCookie', 'holdConsent', 'revokeConsent', 'grantConsent'];
        ttq.setAndDefer = function (t: any, e: string) {
            t[e] = function () { t.push([e].concat(Array.prototype.slice.call(arguments, 0))); };
        };
        for (let i = 0; i < ttq.methods.length; i++) { ttq.setAndDefer(ttq, ttq.methods[i]); }
        ttq.instance = function (t: string) {
            const e = ttq._i[t] || [];
            for (let n = 0; n < ttq.methods.length; n++) { ttq.setAndDefer(e, ttq.methods[n]); }
            return e;
        };
        ttq.load = function (e: string, n?: any) {
            const r = 'https://analytics.tiktok.com/i18n/pixel/events.js';
            ttq._i = ttq._i || {};
            ttq._i[e] = [];
            ttq._i[e]._u = r;
            ttq._t = ttq._t || {};
            ttq._t[e] = +new Date();
            ttq._o = ttq._o || {};
            ttq._o[e] = n || {};
            const s = document.createElement('script');
            s.type = 'text/javascript';
            s.async = true;
            s.src = r + '?sdkid=' + e + '&lib=ttq';
            const first = document.getElementsByTagName('script')[0];
            first.parentNode?.insertBefore(s, first);
        };

        w.ttq.load('D86TVORC77UAOJS102RG');
        w.ttq.page();
    }

    /** Remove ALL traces of the TikTok Pixel from the page. */
    private removeTikTokTraces(): void {
        const w = window as any;

        // Replace with no-op first
        w.ttq = undefined;
        w.TiktokAnalyticsObject = undefined;

        // Remove TikTok SDK scripts
        document.querySelectorAll('script[src*="analytics.tiktok.com"]').forEach(el => el.remove());

        // Remove TikTok tracking images
        document.querySelectorAll('img[src*="analytics.tiktok.com"]').forEach(el => el.remove());
    }
}
