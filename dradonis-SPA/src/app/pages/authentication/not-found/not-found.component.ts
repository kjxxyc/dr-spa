import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Meta, Title } from '@angular/platform-browser';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ArticleService } from '../../../core/services/article.service';
import { ProductService } from '../../../core/services/product.service';
import { VideoService } from '../../../core/services/video.service';

/** One suggestion shown on the 404 page (article, video, or product). */
interface NotFoundResult {
    type: 'article' | 'video' | 'product';
    title: string;
    route: string[];
    image: string;
    /** Normalized searchable text (title + slug words). */
    haystack: string;
}

/**
 * Smart 404 page.
 *
 * Most broken traffic comes from legacy old.dradonis.com (WordPress) links
 * whose slugs still describe what the visitor wanted ("/2019/05/fibromyalgia-
 * treatment-miami/"). Instead of silently redirecting to the landing (a soft
 * 404 that confuses Google), this page:
 *   1. Sets `noindex` so crawlers treat it as a real error page.
 *   2. Mines the broken URL for keywords and suggests the closest articles,
 *      videos, and products.
 *   3. Offers a site-wide search over the same catalog.
 */
@Component({
    selector: 'app-not-found',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        MatIconModule,
        TranslateModule,
        MatDialogModule,
    ],
    templateUrl: './not-found.component.html',
    styleUrls: ['./not-found.component.scss'],
})
export class NotFoundComponent implements OnInit, OnDestroy {
    searchText = '';
    /** Results currently on screen: URL-based suggestions or live search hits. */
    displayResults: NotFoundResult[] = [];
    /** Whether displayResults came from the broken URL (vs. the search box). */
    showingSuggestions = false;
    brokenPath = '';
    currentLang: 'en' | 'es' = 'en';

    private pool: NotFoundResult[] = [];
    private videoTitles: Record<string, string> = {};
    private langSub?: Subscription;
    private articlesSub?: Subscription;

    /** Noise words ignored when mining URLs / queries for keywords. */
    private static readonly STOPWORDS = new Set([
        'the', 'and', 'for', 'with', 'from', 'your', 'you', 'what', 'when', 'how', 'why', 'that',
        'que', 'como', 'por', 'para', 'con', 'los', 'las', 'del', 'una', 'uno', 'este', 'esta', 'sus',
        'html', 'php', 'asp', 'index', 'page', 'pages', 'post', 'posts', 'category', 'tag', 'author',
        'feed', 'amp', 'wp', 'content', 'uploads', 'com', 'www', 'old', 'dradonis', 'http', 'https',
    ]);

    constructor(
        private router: Router,
        private title: Title,
        private meta: Meta,
        private translate: TranslateService,
        private dialog: MatDialog,
        private articles: ArticleService,
        private videos: VideoService,
        private products: ProductService,
    ) {}

    ngOnInit(): void {
        this.brokenPath = this.router.url;
        this.currentLang = (this.translate.currentLang as 'en' | 'es') || 'en';

        this.applySeo();
        this.buildPool();

        this.langSub = this.translate.onLangChange.subscribe(e => {
            this.currentLang = (e.lang as 'en' | 'es') || 'en';
            this.applySeo();
            this.buildPool();
        });
    }

    ngOnDestroy(): void {
        this.langSub?.unsubscribe();
        this.articlesSub?.unsubscribe();
        // CRITICAL: never leak noindex into the rest of the site.
        this.meta.removeTag("name='robots'");
    }

    onSearchChange(): void {
        const tokens = this.tokenize(this.searchText);
        if (!tokens.length) {
            this.suggestFromUrl();
            return;
        }
        this.showingSuggestions = false;
        this.displayResults = this.search(tokens, 8);
    }

    async openAppointment(): Promise<void> {
        const { AppointmentDialogComponent } = await import('../../../shared/appointment-dialog/appointment-dialog.component');
        this.dialog.open(AppointmentDialogComponent, {
            width: '600px',
            maxWidth: '95vw',
            autoFocus: false,
        });
    }

    /** 404 pages must not be indexed — Google then reports them properly. */
    private applySeo(): void {
        const isEs = this.currentLang === 'es';
        this.title.setTitle(isEs
            ? '404 — Página no encontrada | Dr. Adonis'
            : '404 — Page not found | Dr. Adonis');
        this.meta.updateTag({ name: 'robots', content: 'noindex, follow' });
    }

    /** Assemble the searchable catalog: articles (both langs) + videos + products. */
    private buildPool(): void {
        const products: NotFoundResult[] = this.products.getProducts().map(p => ({
            type: 'product',
            title: p.name,
            route: ['/shop', p.slug],
            image: p.image,
            haystack: this.normalize(`${p.name} ${p.brand} ${p.slug.replace(/-/g, ' ')}`),
        }));

        const videoKeys = this.videos.getVideos().map(v => v.titleKey);
        this.translate.get(videoKeys).subscribe((titles: Record<string, string>) => {
            this.videoTitles = titles;
            const videos: NotFoundResult[] = this.videos.getVideos().map(v => ({
                type: 'video',
                title: titles[v.titleKey] || v.titleKey,
                route: ['/videos', v.slug],
                image: `https://img.youtube.com/vi/${v.id}/mqdefault.jpg`,
                haystack: this.normalize(`${titles[v.titleKey] || ''} ${v.slug.replace(/-/g, ' ')}`),
            }));

            this.articlesSub?.unsubscribe();
            this.articlesSub = this.articles.getArticles().subscribe(all => {
                const articles: NotFoundResult[] = all.map(a => ({
                    type: 'article',
                    title: a.title.replace(/<[^>]*>/g, ''),
                    route: ['/articles', a.slug],
                    image: a.imageUrl || 'assets/images/logos/Logo_720x192.jpg',
                    haystack: this.normalize(`${a.title} ${a.slug.replace(/-/g, ' ')}`),
                }));
                this.pool = [...articles, ...videos, ...products];
                if (!this.searchText) {
                    this.suggestFromUrl();
                } else {
                    this.onSearchChange();
                }
            });
        });
    }

    /** Mine the broken URL for keywords and pre-populate suggestions. */
    private suggestFromUrl(): void {
        const tokens = this.tokenize(decodeURIComponent(this.brokenPath));
        this.displayResults = tokens.length ? this.search(tokens, 6) : [];
        this.showingSuggestions = this.displayResults.length > 0;
    }

    private search(tokens: string[], limit: number): NotFoundResult[] {
        const scored = this.pool
            .map(item => ({ item, score: this.score(item.haystack, tokens) }))
            .filter(s => s.score > 0)
            .sort((a, b) => b.score - a.score);
        return scored.slice(0, limit).map(s => s.item);
    }

    private score(haystack: string, tokens: string[]): number {
        let total = 0;
        for (const t of tokens) {
            if (haystack.includes(t)) {
                total += 2;
            } else if (t.length >= 5 && haystack.includes(t.slice(0, 4))) {
                // Partial stem match — tolerates plural/singular and en/es variants
                // sharing a root (fibromyalgia / fibromialgia).
                total += 1;
            }
        }
        return total;
    }

    private tokenize(text: string): string[] {
        return this.normalize(text)
            .split(/[^a-z0-9]+/)
            .filter(t => t.length >= 3 && !/^\d+$/.test(t) && !NotFoundComponent.STOPWORDS.has(t));
    }

    private normalize(s: string): string {
        return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    }
}
