import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { SeoService } from '../../../shared/seo/seo.service';

const AMAZON_EN = 'https://www.amazon.com/Modern-Medicine-Times-Functional-Handbook-ebook/dp/B0146UK2FM?ref_=ast_author_dp&th=1&psc=1';
const AMAZON_ES = 'https://www.amazon.com/Medicina-Moderna-para-Tiempos-Modernos-ebook/dp/B0159BQAU8?ref_=ast_author_dp&th=1&psc=1';
// The book presentation was recorded in both languages.
const BOOK_VIDEO_EN = 'SyF9dvOCCKI';
const BOOK_VIDEO_ES = 'jk-zlZYrBfM';

@Component({
    selector: 'app-book',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        MatButtonModule,
        MatIconModule,
        TranslateModule
    ],
    templateUrl: './book.component.html',
    styleUrls: ['./book.component.scss']
})
export class BookComponent implements OnInit, OnDestroy {
    private langSub?: Subscription;
    currentLang = 'en';

    amazonEn = AMAZON_EN;
    amazonEs = AMAZON_ES;
    videoThumbUrl = `https://img.youtube.com/vi/${BOOK_VIDEO_EN}/hqdefault.jpg`;

    // Lite-embed: the YouTube iframe only mounts after the user clicks play.
    videoPlaying = false;
    videoEmbedUrl!: SafeResourceUrl;

    learnKeys = ['bookPage.learn1', 'bookPage.learn2', 'bookPage.learn3', 'bookPage.learn4', 'bookPage.learn5'];

    constructor(
        private translate: TranslateService,
        private sanitizer: DomSanitizer,
        private seo: SeoService,
    ) {
        this.currentLang = this.translate.currentLang || 'en';
        this.updateVideo();
    }

    ngOnInit(): void {
        this.applySeo();
        this.langSub = this.translate.onLangChange.subscribe(e => {
            this.currentLang = e.lang;
            // Keep the recording's spoken language in sync with the page,
            // even if the user is mid-playback.
            this.updateVideo();
            this.applySeo();
        });
    }

    /** Picks the English or Spanish recording to match the site language. */
    private updateVideo(): void {
        const id = this.currentLang === 'es' ? BOOK_VIDEO_ES : BOOK_VIDEO_EN;
        this.videoThumbUrl = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
        this.videoEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
            `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`
        );
    }

    ngOnDestroy(): void {
        this.langSub?.unsubscribe();
        this.seo.reset();
    }

    playVideo(): void {
        this.videoPlaying = true;
    }

    /** Article suggestions resolve to the slug matching the active language. */
    get peptidesArticleLink(): string {
        return this.currentLang === 'es'
            ? '/articles/el-poder-de-los-peptidos-aprobados-por-la-fda'
            : '/articles/the-power-of-peptides-fda-approved';
    }

    get proteinArticleLink(): string {
        return this.currentLang === 'es'
            ? '/articles/proteina-despues-de-los-40-envejecimiento-saludable'
            : '/articles/protein-after-40-healthy-aging';
    }

    private applySeo(): void {
        const url = this.seo.absoluteUrl('/book');
        const lang = (this.translate.currentLang as 'en' | 'es') || 'en';
        const isEs = lang === 'es';
        const config = isEs
            ? {
                title: 'Libro: Medicina Moderna para Tiempos Modernos | Dr. Adonis Maiquez',
                description: 'El libro del Dr. Adonis Maiquez sobre Medicina Funcional: entienda la causa raíz de la enfermedad y tome el control de su salud. Disponible en Amazon en español e inglés.',
                keywords: 'libro Dr. Adonis, Medicina Moderna para Tiempos Modernos, libro medicina funcional, Adonis Maiquez libro, medicina funcional español',
            }
            : {
                title: 'Book: Modern Medicine for Modern Times | Dr. Adonis Maiquez',
                description: "Dr. Adonis Maiquez's Functional Medicine book: understand the root cause of disease and take control of your health. Available on Amazon in English and Spanish.",
                keywords: 'Dr. Adonis book, Modern Medicine for Modern Times, functional medicine book, Adonis Maiquez book, functional medicine handbook',
            };

        this.seo.apply({
            ...config,
            url,
            lang,
            ogType: 'website',
            jsonLd: this.buildJsonLd(url),
        });
    }

    private buildJsonLd(url: string): Record<string, unknown> {
        const origin = this.seo.origin;
        return {
            '@context': 'https://schema.org',
            '@type': 'Book',
            '@id': `${url}#book`,
            name: 'Modern Medicine for Modern Times',
            alternateName: 'Medicina Moderna para Tiempos Modernos',
            author: { '@type': 'Person', name: 'Adonis Maiquez, MD', '@id': `${origin}/#physician` },
            image: `${origin}/assets/images/book-dradonis.webp`,
            bookFormat: 'https://schema.org/EBook',
            inLanguage: ['en', 'es'],
            url,
            workExample: [
                {
                    '@type': 'Book',
                    bookEdition: 'English Edition',
                    inLanguage: 'en',
                    bookFormat: 'https://schema.org/EBook',
                    offers: { '@type': 'Offer', url: AMAZON_EN, availability: 'https://schema.org/InStock' },
                },
                {
                    '@type': 'Book',
                    bookEdition: 'Edición en Español',
                    inLanguage: 'es',
                    bookFormat: 'https://schema.org/EBook',
                    offers: { '@type': 'Offer', url: AMAZON_ES, availability: 'https://schema.org/InStock' },
                },
            ],
        };
    }
}
