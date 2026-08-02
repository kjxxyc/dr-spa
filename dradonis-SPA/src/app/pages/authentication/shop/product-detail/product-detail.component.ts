import {
    AfterViewInit,
    Component,
    ElementRef,
    Inject,
    OnDestroy,
    OnInit,
    PLATFORM_ID,
    Renderer2,
    ViewChild,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Subscription } from 'rxjs';
import { Product, ProductService, RelatedVideo } from '../../../../core/services/product.service';
import { Article, ArticleService } from '../../../../core/services/article.service';
import { SeoService } from '../../../../shared/seo/seo.service';

/**
 * Product detail page — /shop/<slug>.
 *
 * Purpose: give every Fullscript product its own indexable URL with the
 * doctor's take (benefits, ingredients, who it's for), the live Fullscript
 * buy widget (store_slug "dradonis" keeps the commission attribution), and
 * internal links that keep the visitor engaged: related articles, videos,
 * services/tools — plus a permanent path to book an appointment.
 */
@Component({
    selector: 'app-product-detail',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        MatIconModule,
        TranslateModule,
        MatDialogModule,
    ],
    templateUrl: './product-detail.component.html',
    styleUrls: ['./product-detail.component.scss'],
    // Same collapse/expand pattern as the services page accordion.
    animations: [
        trigger('expandState', [
            state('collapsed', style({ height: '0', opacity: 0, padding: '0 1.5rem', overflow: 'hidden' })),
            state('expanded', style({ height: '*', opacity: 1, padding: '0 1.5rem 1.5rem', overflow: 'hidden' })),
            transition('collapsed <=> expanded', animate('300ms ease-in-out'))
        ])
    ],
})
export class ProductDetailComponent implements OnInit, AfterViewInit, OnDestroy {
    product: Product | null = null;
    relatedArticles: Article[] = [];
    suggestions: Product[] = [];
    currentLang: 'en' | 'es' = 'en';
    /** Collapsible info sections ('ingredients' | 'whoFor') currently open. */
    expandedSections: string[] = [];

    @ViewChild('embedSlot') embedSlot?: ElementRef<HTMLDivElement>;

    private routeSub?: Subscription;
    private langSub?: Subscription;
    private articlesSub?: Subscription;
    private injectedScript?: HTMLScriptElement;
    private viewReady = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private renderer: Renderer2,
        @Inject(PLATFORM_ID) private platformId: Object,
        private products: ProductService,
        private articles: ArticleService,
        private translate: TranslateService,
        private dialog: MatDialog,
        private seo: SeoService,
    ) {
        this.currentLang = (this.translate.currentLang as 'en' | 'es') || 'en';
    }

    ngOnInit(): void {
        this.routeSub = this.route.paramMap.subscribe(pm => {
            const slug = pm.get('slug');
            const product = slug ? this.products.getBySlug(slug) : undefined;
            if (!product) {
                // Unknown product (old/typo link) — fall back to the shop grid.
                this.router.navigate(['/shop'], { replaceUrl: true });
                return;
            }
            this.setProduct(product);
        });

        this.langSub = this.translate.onLangChange.subscribe(e => {
            this.currentLang = (e.lang as 'en' | 'es') || 'en';
            if (this.product) {
                this.loadRelatedArticles(this.product);
                this.applySeo(this.product);
            }
        });
    }

    ngAfterViewInit(): void {
        this.viewReady = true;
        if (this.product) {
            this.injectEmbed(this.product);
        }
    }

    ngOnDestroy(): void {
        this.routeSub?.unsubscribe();
        this.langSub?.unsubscribe();
        this.articlesSub?.unsubscribe();
        this.removeEmbed();
        this.seo.reset();
    }

    isExpanded(section: string): boolean {
        return this.expandedSections.includes(section);
    }

    toggleSection(section: string): void {
        this.expandedSections = this.isExpanded(section)
            ? this.expandedSections.filter(s => s !== section)
            : [...this.expandedSections, section];
    }

    async openAppointment(): Promise<void> {
        const { AppointmentDialogComponent } = await import('../../../../shared/appointment-dialog/appointment-dialog.component');
        this.dialog.open(AppointmentDialogComponent, {
            width: '600px',
            maxWidth: '95vw',
            autoFocus: false,
        });
    }

    videoThumb(v: RelatedVideo): string {
        return `https://img.youtube.com/vi/${v.youtubeId}/mqdefault.jpg`;
    }

    private setProduct(product: Product): void {
        const changed = this.product?.slug !== product.slug;
        this.product = product;
        if (changed) {
            this.expandedSections = [];
        }
        this.suggestions = this.products.getSuggestions(product);
        this.loadRelatedArticles(product);
        this.applySeo(product);
        if (changed && this.viewReady) {
            this.injectEmbed(product);
        }
    }

    private loadRelatedArticles(product: Product): void {
        const slugs = product.relatedArticles[this.currentLang] || [];
        this.articlesSub?.unsubscribe();
        this.articlesSub = this.articles.getArticles().subscribe(all => {
            // Keep the order defined in the product data.
            this.relatedArticles = slugs
                .map(slug => all.find(a => a.slug === slug))
                .filter((a): a is Article => !!a);
        });
    }

    /**
     * Inject the Fullscript oEmbed widget for this product. The script
     * self-replaces with the live product card (image, price, Buy button)
     * carrying `store_slug: "dradonis"` for commission attribution.
     */
    private injectEmbed(product: Product): void {
        if (!isPlatformBrowser(this.platformId) || !this.embedSlot) {
            return;
        }
        this.removeEmbed();

        const script: HTMLScriptElement = this.renderer.createElement('script');
        this.renderer.setAttribute(script, 'src', 'https://us.fullscript.com/oembed/embed.js');
        this.renderer.setAttribute(
            script,
            'data-fs',
            JSON.stringify({
                product_id: product.id,
                store_slug: 'dradonis',
                return: 'product_card',
            })
        );
        // Tells OneTrust / cookie banners to leave this script alone.
        this.renderer.setAttribute(script, 'data-ot-ignore', '');
        this.renderer.appendChild(this.embedSlot.nativeElement, script);
        this.injectedScript = script;
    }

    private removeEmbed(): void {
        if (this.embedSlot) {
            this.embedSlot.nativeElement.innerHTML = '';
        }
        this.injectedScript = undefined;
    }

    /** Per-product SEO: own title/description/canonical + Product & Breadcrumb JSON-LD. */
    private applySeo(product: Product): void {
        const lang = this.currentLang;
        const isEs = lang === 'es';
        const url = this.seo.absoluteUrl(`/shop/${product.slug}`);

        // translate.get() waits for the i18n file — instant() on first render
        // can return the raw key, which Google would index.
        this.translate.get(product.descriptionKey).subscribe((description: string) => {
            const title = isEs
                ? `${product.name} — Suplemento Recomendado por el Dr. Adonis | Miami`
                : `${product.name} — Doctor-Curated Supplement | Dr. Adonis Miami`;
            this.seo.apply({
                title,
                description,
                keywords: isEs
                    ? `${product.name}, ${product.brand}, comprar ${product.name}, suplementos Dr. Adonis Miami, Fullscript dradonis`
                    : `${product.name}, ${product.brand}, buy ${product.name}, Dr. Adonis supplements Miami, Fullscript dradonis`,
                url,
                lang,
                ogType: 'product',
                image: product.image,
                jsonLd: [
                    this.productJsonLd(product, description, url),
                    this.breadcrumbJsonLd(product, isEs, url),
                ],
            });
        });
    }

    private productJsonLd(product: Product, description: string, url: string): Record<string, unknown> {
        const origin = this.seo.origin;
        return {
            '@context': 'https://schema.org',
            '@type': 'Product',
            '@id': `${url}#product`,
            name: product.name,
            image: product.image,
            description,
            sku: product.id,
            category: 'Supplement',
            brand: { '@type': 'Brand', name: product.brand },
            offers: {
                '@type': 'Offer',
                url,
                priceCurrency: 'USD',
                price: product.price,
                availability: 'https://schema.org/InStock',
                seller: { '@type': 'Person', name: 'Dr. Adonis Maiquez, MD', '@id': `${origin}/#physician` },
                shippingDetails: {
                    '@type': 'OfferShippingDetails',
                    shippingRate: { '@type': 'MonetaryAmount', value: '0', currency: 'USD' },
                    shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'US' },
                    deliveryTime: {
                        '@type': 'ShippingDeliveryTime',
                        handlingTime: { '@type': 'QuantitativeValue', minValue: '0', maxValue: '1', unitCode: 'd' },
                        transitTime: { '@type': 'QuantitativeValue', minValue: '1', maxValue: '5', unitCode: 'd' },
                    },
                },
                hasMerchantReturnPolicy: {
                    '@type': 'MerchantReturnPolicy',
                    applicableCountry: 'US',
                    returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
                    merchantReturnDays: '30',
                    returnMethod: 'https://schema.org/ReturnByMail',
                    returnFees: 'https://schema.org/FreeReturn',
                },
            },
        };
    }

    private breadcrumbJsonLd(product: Product, isEs: boolean, url: string): Record<string, unknown> {
        const origin = this.seo.origin;
        return {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: isEs ? 'Inicio' : 'Home', item: `${origin}/` },
                { '@type': 'ListItem', position: 2, name: isEs ? 'Tienda' : 'Shop', item: `${origin}/shop` },
                { '@type': 'ListItem', position: 3, name: product.name, item: url },
            ],
        };
    }
}
