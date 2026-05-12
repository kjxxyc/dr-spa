import {
    AfterViewInit,
    Component,
    ElementRef,
    Inject,
    OnDestroy,
    PLATFORM_ID,
    QueryList,
    Renderer2,
    ViewChildren,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

export interface FullscriptProduct {
    /** Fullscript product ID (used in the oEmbed `data-fs` payload). */
    id: string;
    /** Display name kept for accessibility / fallback while embed loads. */
    name: string;
    /** i18n key for the doctor's custom description shown below the widget. */
    descriptionKey: string;
    /** Category used by the filter pills. */
    category: 'general' | 'antiaging' | 'gut' | 'menopause';
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
export class ShopComponent implements AfterViewInit, OnDestroy {
    selectedCategory: string = 'all';

    /**
     * Fullscript product catalog.
     * IDs and categories must match the ones in `shop v9*.html` provided by the client,
     * since `store_slug: "dradonis"` is what attributes the commission to Dr. Adonis.
     */
    fullscriptProducts: FullscriptProduct[] = [
        { id: '62134', name: 'PectaSol®', descriptionKey: 'shop.products.pectasol', category: 'general' },
        { id: '72479', name: 'Mitochondrial NRG', descriptionKey: 'shop.products.mitochondrial', category: 'general' },
        { id: '71334', name: 'Uric Acid Formula', descriptionKey: 'shop.products.uricAcid', category: 'general' },
        { id: '72491', name: 'OmegAvail Hi-Po Fish Oil', descriptionKey: 'shop.products.omegavail', category: 'general' },
        { id: '76696', name: 'Broccoli Seed Extract', descriptionKey: 'shop.products.broccoli', category: 'antiaging' },
        { id: '72276', name: 'Complete Mineral Complex', descriptionKey: 'shop.products.mineral', category: 'general' },
        { id: '89800', name: 'Telomere Pro', descriptionKey: 'shop.products.telomere', category: 'antiaging' },
        { id: '71597', name: 'Iron Liquid', descriptionKey: 'shop.products.iron', category: 'general' },
        { id: '105060', name: 'ProbioMax® Sb DF', descriptionKey: 'shop.products.probiomax', category: 'gut' },
        { id: '72404', name: 'DIM-Evail™', descriptionKey: 'shop.products.dimEvail', category: 'menopause' }
    ];

    @ViewChildren('embedSlot') embedSlots!: QueryList<ElementRef<HTMLDivElement>>;

    /** Track injected script nodes so we can remove them on destroy. */
    private injectedScripts: HTMLScriptElement[] = [];

    constructor(
        private renderer: Renderer2,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {}

    ngAfterViewInit(): void {
        // SSR / hydration guard: the Fullscript oEmbed script touches `window`
        // and would either fail or duplicate during server render. Only run in browser.
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }
        this.injectFullscriptEmbeds();
    }

    ngOnDestroy(): void {
        // Clean up scripts to avoid leaks and double-execution if the component remounts.
        this.injectedScripts.forEach(script => {
            script.parentNode?.removeChild(script);
        });
        this.injectedScripts = [];
    }

    /**
     * Inject one Fullscript oEmbed `<script>` per product into its corresponding slot.
     * The script self-replaces with a product card (image + name + price + buy button)
     * that includes the `store_slug: "dradonis"` attribution — this is what earns
     * the commission on every sale.
     */
    private injectFullscriptEmbeds(): void {
        this.embedSlots.forEach((slot, index) => {
            const product = this.fullscriptProducts[index];
            if (!product) return;

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
        });
    }

    /** Whether a product card with `category` should be visible under the current filter. */
    isVisible(category: string): boolean {
        return this.selectedCategory === 'all' || this.selectedCategory === category;
    }

    selectCategory(category: string): void {
        this.selectedCategory = category;
    }
}
