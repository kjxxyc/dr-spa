import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

export interface FullscriptProduct {
    id: string;
    name: string;
    subtitle: string;
    image: string;
    descriptionKey: string;
    category: 'general' | 'antiaging' | 'gut' | 'menopause';
    storeUrl: string;
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
export class ShopComponent {
    selectedCategory: string = 'all';

    fullscriptProducts: FullscriptProduct[] = [
        {
            id: '62134',
            name: 'PectaSol®',
            subtitle: '90 capsules',
            image: 'https://assets.fullscript.io/Product/EN0037/400_front.png',
            descriptionKey: 'shop.products.pectasol',
            category: 'general',
            storeUrl: 'https://us.fullscript.com/u/catalog/product/U3ByZWU6OlByb2R1Y3QtNjIxMzQ='
        },
        {
            id: '72479',
            name: 'Mitochondrial NRG',
            subtitle: '120 capsules',
            image: 'https://assets.fullscript.io/Product/DF0263/400_front.png',
            descriptionKey: 'shop.products.mitochondrial',
            category: 'general',
            storeUrl: 'https://us.fullscript.com/u/catalog/product/U3ByZWU6OlByb2R1Y3QtNzI0Nzk='
        },
        {
            id: '71334',
            name: 'Uric Acid Formula',
            subtitle: '120 capsules',
            image: 'https://assets.fullscript.io/Product/PU0785/400_front.png',
            descriptionKey: 'shop.products.uricAcid',
            category: 'general',
            storeUrl: 'https://us.fullscript.com/u/catalog/product/U3ByZWU6OlByb2R1Y3QtNzEzMzQ='
        },
        {
            id: '72491',
            name: 'OmegAvail Hi-Po Fish Oil',
            subtitle: '60 Softgels',
            image: 'https://assets.fullscript.io/Product/DF0253/400_front.png',
            descriptionKey: 'shop.products.omegavail',
            category: 'general',
            storeUrl: 'https://us.fullscript.com/u/catalog/product/U3ByZWU6OlByb2R1Y3QtNzI0OTE='
        },
        {
            id: '76696',
            name: 'Broccoli Seed Extract',
            subtitle: '60 capsules',
            image: 'https://assets.fullscript.io/Product/TH0319/400_front.png',
            descriptionKey: 'shop.products.broccoli',
            category: 'antiaging',
            storeUrl: 'https://us.fullscript.com/u/catalog/product/U3ByZWU6OlByb2R1Y3QtNzY2OTY='
        },
        {
            id: '72276',
            name: 'Complete Mineral Complex',
            subtitle: '90 capsules',
            image: 'https://assets.fullscript.io/Product/DF0083/400_front.png',
            descriptionKey: 'shop.products.mineral',
            category: 'general',
            storeUrl: 'https://us.fullscript.com/u/catalog/product/U3ByZWU6OlByb2R1Y3QtNzIyNzY='
        },
        {
            id: '89800',
            name: 'Telomere Pro',
            subtitle: '30 capsules',
            image: 'https://assets.fullscript.io/Product/ES0025/400_front.png',
            descriptionKey: 'shop.products.telomere',
            category: 'antiaging',
            storeUrl: 'https://us.fullscript.com/u/catalog/product/U3ByZWU6OlByb2R1Y3QtODk4MDA='
        },
        {
            id: '71597',
            name: 'Iron Liquid',
            subtitle: '120 Milliliters',
            image: 'https://assets.fullscript.io/Product/PU0903/400_front.png',
            descriptionKey: 'shop.products.iron',
            category: 'general',
            storeUrl: 'https://us.fullscript.com/u/catalog/product/U3ByZWU6OlByb2R1Y3QtNzE1OTc='
        },
        {
            id: '105060',
            name: 'ProbioMax® Sb DF',
            subtitle: '30 capsules',
            image: 'https://assets.fullscript.io/Product/XM0146/400_front.png',
            descriptionKey: 'shop.products.probiomax',
            category: 'gut',
            storeUrl: 'https://us.fullscript.com/u/catalog/product/U3ByZWU6OlByb2R1Y3QtMTA1MDYw'
        },
        {
            id: '72404',
            name: 'DIM-Evail™',
            subtitle: '60 Softgels',
            image: 'https://assets.fullscript.io/Product/DF0179/400_front.png',
            descriptionKey: 'shop.products.dimEvail',
            category: 'menopause',
            storeUrl: 'https://us.fullscript.com/u/catalog/product/U3ByZWU6OlByb2R1Y3QtNzI0MDQ='
        }
    ];

    get filteredProducts(): FullscriptProduct[] {
        if (this.selectedCategory === 'all') {
            return this.fullscriptProducts;
        }
        return this.fullscriptProducts.filter(p => p.category === this.selectedCategory);
    }

    selectCategory(category: string) {
        this.selectedCategory = category;
    }
}
