import { Injectable, Inject, Renderer2, RendererFactory2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

/**
 * Configuration for a route's SEO metadata.
 *
 * SEO STRATEGY NOTES (dradonis.com):
 * - We do NOT promote the site as an online pharmacy / e-commerce. The
 *   business model is: licensed physician issues prescriptions after a
 *   medical evaluation, the medication is picked up at the clinic or
 *   delivered locally in South Florida.
 * - Avoid keywords like "buy online", "online pharmacy", "discount pharmacy".
 * - Focus on: "physician-prescribed", "medical evaluation", "Miami",
 *   "Florida", "in-clinic pickup", "local delivery", "telemedicine".
 * - Bilingual (en/es) — duplicate strings per language; hreflang handled
 *   in the linked sitemap.
 */
export interface SeoConfig {
    title: string;
    description: string;
    keywords?: string;
    /** Canonical absolute URL. */
    url: string;
    /** 'en' | 'es' — controls og:locale and html lang attribute hint. */
    lang: 'en' | 'es';
    /** Optional absolute image URL for og/twitter cards. */
    image?: string;
    /** og:type — default 'website'. Use 'article' for blog posts. */
    ogType?: 'website' | 'article' | 'product';
    /** Optional JSON-LD object to inject as <script type="application/ld+json">. */
    jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

/**
 * Centralized SEO management for the Angular SPA.
 *
 * Why this service exists: SPAs only ship a single `index.html`, so every
 * route shares the same `<head>` by default. Google needs per-route titles,
 * descriptions, canonical links, og/twitter tags, and JSON-LD schema to
 * understand each page. This service injects/updates them on navigation.
 *
 * Usage from a component:
 *   constructor(private seo: SeoService) {}
 *   ngOnInit() {
 *     this.seo.apply({
 *       title: 'Telemedicine Consultation | Dr. Adonis',
 *       description: '...',
 *       url: 'https://dradonis.com/telemedicine',
 *       lang: 'es',
 *       jsonLd: { ... },
 *     });
 *   }
 *   ngOnDestroy() { this.seo.reset(); }
 */
/**
 * The production canonical fallback domain. Used as a fallback when
 * window is not available (SSR / build-time prerender) and as the source
 * of truth when constructing absolute URLs for static assets like
 * sitemap.xml or robots.txt where window.location can't be used.
 *
 * Current state (Aug 2026): the SPA serves `dradonis.com` (apex);
 * `my.dradonis.com` 301-redirects here. The legacy WordPress lives only
 * on `old.dradonis.com` (pending shutdown).
 */
export const SITE_ORIGIN_FALLBACK = 'https://dradonis.com';

@Injectable({ providedIn: 'root' })
export class SeoService {
    private readonly DEFAULT_TITLE =
        'Dr. Adonis | Functional & Regenerative Medicine in Miami';
    private readonly DEFAULT_DESCRIPTION =
        'Dr. Adonis Maiquez - Functional & Regenerative Medicine specialist in Miami, FL. Premium supplements, Vagustim therapy, personalized health protocols for longevity and optimal wellness.';

    /** Id used for the JSON-LD <script> tag we inject per route. */
    private readonly JSONLD_ID = 'route-jsonld';
    /** Id used for the canonical <link> tag we inject per route. */
    private readonly CANONICAL_ID = 'route-canonical';

    private renderer: Renderer2;

    constructor(
        private titleService: Title,
        private metaService: Meta,
        rendererFactory: RendererFactory2,
        @Inject(DOCUMENT) private doc: Document,
    ) {
        // Renderer2 is the SSR-safe way to mutate the DOM (avoids direct
        // document manipulation that breaks Angular SSR / hydration).
        this.renderer = rendererFactory.createRenderer(null, null);
    }

    /**
     * Returns the active site origin (protocol + hostname + port). Resolves
     * automatically based on where the app is actually being served:
     *   - localhost:4200    → http://localhost:4200
     *   - dradonis.com      → https://dradonis.com     (production)
     *
     * During SSR / prerender (no `window`), falls back to SITE_ORIGIN_FALLBACK.
     * This means canonical links, og:url, and JSON-LD @id values are always
     * consistent with where the page is actually being served — no need to
     * change code when migrating between subdomains.
     */
    get origin(): string {
        if (typeof window !== 'undefined' && window.location?.origin) {
            return window.location.origin;
        }
        return SITE_ORIGIN_FALLBACK;
    }

    /** Convenience helper: builds an absolute URL from a path like '/telemedicine'. */
    absoluteUrl(path: string): string {
        const cleanPath = path.startsWith('/') ? path : `/${path}`;
        return `${this.origin}${cleanPath}`;
    }

    /** Default share image — uses the active origin so OG previews use the live host. */
    private get defaultImage(): string {
        return `${this.origin}/assets/images/logos/Logo_720x192.jpg`;
    }

    /** Apply a full set of SEO tags for the current route. */
    apply(config: SeoConfig): void {
        // 1. <title>
        this.titleService.setTitle(config.title);

        // 2. Core meta tags
        this.metaService.updateTag({ name: 'description', content: config.description });
        if (config.keywords) {
            this.metaService.updateTag({ name: 'keywords', content: config.keywords });
        }

        // 3. Open Graph (Facebook, LinkedIn, WhatsApp previews)
        this.metaService.updateTag({ property: 'og:title', content: config.title });
        this.metaService.updateTag({ property: 'og:description', content: config.description });
        this.metaService.updateTag({ property: 'og:url', content: config.url });
        this.metaService.updateTag({ property: 'og:type', content: config.ogType ?? 'website' });
        this.metaService.updateTag({
            property: 'og:locale',
            content: config.lang === 'es' ? 'es_US' : 'en_US',
        });
        this.metaService.updateTag({
            property: 'og:image',
            content: config.image ?? this.defaultImage,
        });

        // 4. Twitter/X card
        this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
        this.metaService.updateTag({ name: 'twitter:title', content: config.title });
        this.metaService.updateTag({ name: 'twitter:description', content: config.description });
        this.metaService.updateTag({
            name: 'twitter:image',
            content: config.image ?? this.defaultImage,
        });
        this.metaService.updateTag({ name: 'twitter:url', content: config.url });

        // 5. Canonical link — critical for SEO to avoid duplicate-content issues.
        this.setCanonical(config.url);

        // 6. <html lang="...">
        if (this.doc?.documentElement) {
            this.renderer.setAttribute(this.doc.documentElement, 'lang', config.lang);
        }

        // 7. JSON-LD structured data
        if (config.jsonLd) {
            this.setJsonLd(config.jsonLd);
        } else {
            this.removeJsonLd();
        }
    }

    /**
     * Reset to global defaults (called from ngOnDestroy when leaving a
     * route that customized its SEO). Prevents stale meta on subsequent
     * routes that don't call apply().
     */
    reset(): void {
        this.titleService.setTitle(this.DEFAULT_TITLE);
        this.metaService.updateTag({ name: 'description', content: this.DEFAULT_DESCRIPTION });
        this.metaService.updateTag({ property: 'og:title', content: this.DEFAULT_TITLE });
        this.metaService.updateTag({ property: 'og:description', content: this.DEFAULT_DESCRIPTION });
        this.metaService.updateTag({ property: 'og:image', content: this.defaultImage });
        this.removeJsonLd();
        this.removeCanonical();
    }

    /** Insert or replace a <link rel="canonical" href="..."> in <head>. */
    private setCanonical(url: string): void {
        const head = this.doc?.head;
        if (!head) return;
        const existing = this.doc.getElementById(this.CANONICAL_ID);
        if (existing) {
            this.renderer.setAttribute(existing, 'href', url);
            return;
        }
        const link: HTMLLinkElement = this.renderer.createElement('link');
        this.renderer.setAttribute(link, 'id', this.CANONICAL_ID);
        this.renderer.setAttribute(link, 'rel', 'canonical');
        this.renderer.setAttribute(link, 'href', url);
        this.renderer.appendChild(head, link);
    }

    private removeCanonical(): void {
        const existing = this.doc?.getElementById(this.CANONICAL_ID);
        if (existing?.parentNode) {
            this.renderer.removeChild(existing.parentNode, existing);
        }
    }

    /** Insert or replace <script type="application/ld+json"> in <head>. */
    private setJsonLd(payload: Record<string, unknown> | Record<string, unknown>[]): void {
        const head = this.doc?.head;
        if (!head) return;
        this.removeJsonLd();
        const script: HTMLScriptElement = this.renderer.createElement('script');
        this.renderer.setAttribute(script, 'id', this.JSONLD_ID);
        this.renderer.setAttribute(script, 'type', 'application/ld+json');
        script.textContent = JSON.stringify(payload);
        this.renderer.appendChild(head, script);
    }

    private removeJsonLd(): void {
        const existing = this.doc?.getElementById(this.JSONLD_ID);
        if (existing?.parentNode) {
            this.renderer.removeChild(existing.parentNode, existing);
        }
    }
}
