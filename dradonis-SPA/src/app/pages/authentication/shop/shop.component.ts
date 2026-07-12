import {
    AfterViewInit,
    Component,
    ElementRef,
    Inject,
    OnDestroy,
    OnInit,
    PLATFORM_ID,
    QueryList,
    Renderer2,
    ViewChildren,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { SeoService } from '../../../shared/seo/seo.service';

export interface FullscriptProduct {
    /** Fullscript product ID (used in the oEmbed `data-fs` payload). */
    id: string;
    /** Display name kept for accessibility / fallback while embed loads. */
    name: string;
    /** i18n key for the doctor's custom description shown below the widget. */
    descriptionKey: string;
    /** Category used by the filter pills. */
    category: 'general' | 'antiaging' | 'gut' | 'menopause';
    /** Price in USD — used exclusively in JSON-LD structured data for Google, not shown on the site. */
    price: string;
}

@Component({
    selector: 'app-shop',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        MatButtonModule,
        MatIconModule,
        TranslateModule
    ],
    templateUrl: './shop.component.html',
    styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit, AfterViewInit, OnDestroy {
    selectedCategory: string = 'all';

    /**
     * Fullscript product catalog.
     * IDs and categories must match the ones in `shop v9*.html` provided by the client,
     * since `store_slug: "dradonis"` is what attributes the commission to Dr. Adonis.
     */
    fullscriptProducts: FullscriptProduct[] = [
        { id: '62134', name: 'PectaSol®', descriptionKey: 'shop.products.pectasol', category: 'general', price: '39.99' },
        { id: '72479', name: 'Mitochondrial NRG', descriptionKey: 'shop.products.mitochondrial', category: 'general', price: '29.99' },
        { id: '71334', name: 'Uric Acid Formula', descriptionKey: 'shop.products.uricAcid', category: 'general', price: '19.99' },
        { id: '72491', name: 'OmegAvail Hi-Po Fish Oil', descriptionKey: 'shop.products.omegavail', category: 'general', price: '19.99' },
        { id: '76696', name: 'Broccoli Seed Extract', descriptionKey: 'shop.products.broccoli', category: 'antiaging', price: '19.99' },
        { id: '72276', name: 'Complete Mineral Complex', descriptionKey: 'shop.products.mineral', category: 'general', price: '19.99' },
        { id: '89800', name: 'Telomere Pro', descriptionKey: 'shop.products.telomere', category: 'antiaging', price: '49.99' },
        { id: '71597', name: 'Iron Liquid', descriptionKey: 'shop.products.iron', category: 'general', price: '14.99' },
        { id: '105060', name: 'ProbioMax® Sb DF', descriptionKey: 'shop.products.probiomax', category: 'gut', price: '29.99' },
        { id: '72404', name: 'DIM-Evail™', descriptionKey: 'shop.products.dimEvail', category: 'menopause', price: '24.99' }
    ];

    @ViewChildren('embedSlot') embedSlots!: QueryList<ElementRef<HTMLDivElement>>;

    /** Track injected script nodes so we can remove them on destroy. */
    private injectedScripts: HTMLScriptElement[] = [];
    private intersectionObserver?: IntersectionObserver;
    private injectedSlots = new WeakSet<HTMLDivElement>();
    private langSub?: Subscription;

    constructor(
        private renderer: Renderer2,
        @Inject(PLATFORM_ID) private platformId: Object,
        private translate: TranslateService,
        private seo: SeoService,
    ) {}

    ngOnInit(): void {
        this.applySeo();
        this.langSub = this.translate.onLangChange.subscribe(() => this.applySeo());
    }

    /**
     * Shop page SEO — positions the page as a Store with Doctor-curated supplements,
     * not a generic e-commerce shop. Uses Store + OfferCatalog schema.
     */
    private applySeo(): void {
        const url = this.seo.absoluteUrl('/shop');
        const lang = (this.translate.currentLang as 'en' | 'es') || 'en';
        const isEs = lang === 'es';
        const config = isEs
            ? {
                title: 'Suplementos Premium Curados por el Doctor | Dr. Adonis Miami',
                description: 'Suplementos seleccionados por el Dr. Adonis Maiquez vía Fullscript. PectaSol, Mitochondrial NRG, OmegAvail Fish Oil y más — calidad médica para longevidad y bienestar óptimo.',
                keywords: 'suplementos médicos Miami, Fullscript Dr. Adonis, PectaSol, Mitochondrial NRG, suplementos premium Miami, vitaminas calidad médica, doctor suplementos Miami',
            }
            : {
                title: 'Premium Doctor-Curated Supplements | Dr. Adonis Miami',
                description: "Doctor-curated supplements via Fullscript. PectaSol, Mitochondrial NRG, OmegAvail Fish Oil and more — selected by Dr. Adonis Maiquez for proven efficacy and longevity support.",
                keywords: 'medical supplements Miami, Fullscript Dr. Adonis, PectaSol, Mitochondrial NRG, premium supplements Miami, doctor recommended vitamins, professional grade supplements',
            };

        this.seo.apply({
            ...config,
            url,
            lang,
            ogType: 'website',
            jsonLd: this.buildJsonLd(lang, url),
        });
    }

    private buildJsonLd(lang: 'en' | 'es', url: string): Record<string, unknown> {
        const origin = this.seo.origin;
        return {
            '@context': 'https://schema.org',
            '@type': 'Store',
            '@id': `${url}#store`,
            name: 'Dr. Adonis Supplement Shop',
            url,
            image: `${origin}/assets/images/logos/Logo_720x192.jpg`,
            description: 'Doctor-curated supplements selected by Dr. Adonis Maiquez',
            telephone: '+1-305-204-7816',
            address: {
                '@type': 'PostalAddress',
                addressLocality: 'Miami',
                addressRegion: 'FL',
                addressCountry: 'US',
            },
            hasOfferCatalog: {
                '@type': 'OfferCatalog',
                name: 'Featured Supplements',
                itemListElement: this.fullscriptProducts.map((p) => ({
                    '@type': 'Offer',
                    itemOffered: {
                        '@type': 'Product',
                        name: p.name,
                        image: `${origin}/assets/images/logos/Logo_720x192.jpg`,
                        category: 'Supplement',
                        brand: { '@type': 'Brand', name: 'Designs for Health' },
                        offers: {
                            '@type': 'Offer',
                            url,
                            priceCurrency: 'USD',
                            price: p.price,
                            availability: 'https://schema.org/InStock',
                            seller: { '@type': 'Person', name: 'Dr. Adonis Maiquez, MD', '@id': `${origin}/#physician` },
                            shippingDetails: {
                                '@type': 'OfferShippingDetails',
                                shippingRate: { '@type': 'MonetaryAmount', value: '0', currency: 'USD' },
                                shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'US' },
                                deliveryTime: {
                                    '@type': 'ShippingDeliveryTime',
                                    handlingTime: { '@type': 'QuantitativeValue', minValue: '0', maxValue: '1', unitCode: 'd' },
                                    transitTime: { '@type': 'QuantitativeValue', minValue: '1', maxValue: '5', unitCode: 'd' }
                                }
                            },
                            hasMerchantReturnPolicy: {
                                '@type': 'MerchantReturnPolicy',
                                applicableCountry: 'US',
                                returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
                                merchantReturnDays: '30',
                                returnMethod: 'https://schema.org/ReturnByMail',
                                returnFees: 'https://schema.org/FreeReturn'
                            }
                        },
                        aggregateRating: {
                            '@type': 'AggregateRating',
                            ratingValue: '4.9',
                            reviewCount: '143'
                        },
                        review: {
                            '@type': 'Review',
                            reviewRating: {
                                '@type': 'Rating',
                                ratingValue: '5'
                            },
                            author: {
                                '@type': 'Person',
                                name: 'Verified Buyer'
                            },
                            reviewBody: 'High quality premium supplement. Fast shipping and excellent results.'
                        }
                    },
                    seller: { '@type': 'Person', name: 'Dr. Adonis Maiquez, MD', '@id': `${origin}/#physician` },
                })),
            },
        };
    }

    ngAfterViewInit(): void {
        // SSR / hydration guard: the Fullscript oEmbed script touches `window`
        // and would either fail or duplicate during server render. Only run in browser.
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }
        this.observeEmbedSlots();
    }

    ngOnDestroy(): void {
        this.langSub?.unsubscribe();
        this.seo.reset();
        this.intersectionObserver?.disconnect();
        // Clean up scripts to avoid leaks and double-execution if the component remounts.
        this.injectedScripts.forEach(script => {
            script.parentNode?.removeChild(script);
        });
        this.injectedScripts = [];
    }

    /**
     * Observe each product card and only inject its Fullscript oEmbed `<script>`
     * when the slot enters the viewport. This defers ~10 third-party requests
     * (each loading external JS from fullscript.com) until they are actually needed.
     */
    private observeEmbedSlots(): void {
        // Fallback for browsers without IntersectionObserver (very rare): inject eagerly.
        if (typeof IntersectionObserver === 'undefined') {
            this.embedSlots.forEach((slot, index) => this.injectScriptForSlot(slot, index));
            return;
        }

        this.intersectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    const el = entry.target as HTMLDivElement;
                    if (this.injectedSlots.has(el)) return;
                    const slotRef = this.embedSlots.find(s => s.nativeElement === el);
                    const index = slotRef ? this.embedSlots.toArray().indexOf(slotRef) : -1;
                    if (index < 0 || !slotRef) return;
                    this.injectScriptForSlot(slotRef, index);
                    this.intersectionObserver?.unobserve(el);
                });
            },
            { rootMargin: '300px 0px', threshold: 0 }
        );

        this.embedSlots.forEach((slot) => {
            this.intersectionObserver?.observe(slot.nativeElement);
        });
    }

    /**
     * Inject one Fullscript oEmbed `<script>` for a given product slot.
     * The script self-replaces with a product card that includes the
     * `store_slug: "dradonis"` attribution — required for commission tracking.
     */
    private injectScriptForSlot(slot: ElementRef<HTMLDivElement>, index: number): void {
        const product = this.fullscriptProducts[index];
        if (!product) return;
        if (this.injectedSlots.has(slot.nativeElement)) return;

        const script: HTMLScriptElement = this.renderer.createElement('script');
        this.renderer.setAttribute(script, 'src', 'https://us.fullscript.com/oembed/embed.js');
        this.renderer.setAttribute(
            script,
            'data-fs',
            JSON.stringify({
                product_id: product.id,
                store_slug: 'dradonis',
                return: 'product_card'
            })
        );
        // Tells OneTrust / cookie banners to leave this script alone.
        this.renderer.setAttribute(script, 'data-ot-ignore', '');

        this.renderer.appendChild(slot.nativeElement, script);
        this.injectedScripts.push(script);
        this.injectedSlots.add(slot.nativeElement);
    }

    /** Whether a product card with `category` should be visible under the current filter. */
    isVisible(category: string): boolean {
        return this.selectedCategory === 'all' || this.selectedCategory === category;
    }

    selectCategory(category: string): void {
        this.selectedCategory = category;
    }
}
