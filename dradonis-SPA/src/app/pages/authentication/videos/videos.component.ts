import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { SeoService } from '../../../shared/seo/seo.service';
import { VideoCatalogItem, VideoCategory, VideoService } from '../../../core/services/video.service';

/** Catalog entry enriched with the sanitized embed URL for the player. */
export interface VideoItem extends VideoCatalogItem {
    embedUrl: SafeResourceUrl;
}

@Component({
    selector: 'app-videos',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        MatButtonModule,
        MatIconModule,
        TranslateModule,
        MatDialogModule
    ],
    templateUrl: './videos.component.html',
    styleUrls: ['./videos.component.scss']
})
export class VideosComponent implements OnInit, OnDestroy {
    private langSub?: Subscription;
    private routeSub?: Subscription;
    videos: VideoItem[] = [];
    filteredVideos: VideoItem[] = [];
    selectedVideo: VideoItem | null = null;
    currentLang = 'en';
    searchText = '';

    /** Topic filter, shop-style pills. */
    selectedCategory: 'all' | VideoCategory = 'all';
    /**
     * Language filter — defaults to the site language so English visitors
     * don't get Spanish-only videos mixed in (and vice versa). The user can
     * still switch to "All languages".
     */
    selectedLang: 'all' | 'en' | 'es' = 'all';

    readonly categories: Array<{ key: 'all' | VideoCategory; labelKey: string; emoji: string }> = [
        { key: 'all', labelKey: 'videos.filterAll', emoji: '🎬' },
        { key: 'brain', labelKey: 'videos.filterBrain', emoji: '🧠' },
        { key: 'hormones', labelKey: 'videos.filterHormones', emoji: '🌸' },
        { key: 'weight', labelKey: 'videos.filterWeight', emoji: '⚖️' },
        { key: 'wellness', labelKey: 'videos.filterWellness', emoji: '🥗' },
        { key: 'functional', labelKey: 'videos.filterFunctional', emoji: '🔬' },
        { key: 'about', labelKey: 'videos.filterAbout', emoji: '👨‍⚕️' },
    ];

    /** titleKey -> translated title for the active language (loaded async). */
    private titles: Record<string, string> = {};
    private titlesLoaded = false;
    /** Slug currently in the URL (null on the plain /videos gallery). */
    private activeSlug: string | null = null;
    /** Set on card click so the route handler scrolls the player into view. */
    private pendingScroll = false;

    constructor(
        private sanitizer: DomSanitizer,
        private dialog: MatDialog,
        private translate: TranslateService,
        private seo: SeoService,
        private route: ActivatedRoute,
        private router: Router,
        private videoService: VideoService,
    ) {
        this.currentLang = this.translate.currentLang || 'en';
        this.selectedLang = this.currentLang === 'es' ? 'es' : 'en';

        const pageOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://dradonis.com';
        this.videos = this.videoService.getVideos().map(v => ({
            ...v,
            embedUrl: this.sanitizer.bypassSecurityTrustResourceUrl(
                `https://www.youtube.com/embed/${v.id}?enablejsapi=0&origin=${pageOrigin}&rel=0`
            )
        }));

        this.filteredVideos = this.videos;
        this.selectedVideo = this.videos[0];
    }

    ngOnInit(): void {
        // Deep link support: /videos?q=fibromyalgia pre-fills the search box.
        const q = this.route.snapshot.queryParamMap.get('q');
        if (q) {
            this.searchText = q;
        }

        this.loadTitles();
        this.langSub = this.translate.onLangChange.subscribe(e => {
            this.currentLang = e.lang;
            // Follow the site language so the default view stays consistent
            // with what the visitor is reading.
            this.selectedLang = e.lang === 'es' ? 'es' : 'en';
            this.loadTitles();
        });

        // Single subscription handles both /videos and /videos/:slug — the
        // route uses a UrlMatcher so the component instance is reused and
        // only the param changes when the user clicks another video.
        this.routeSub = this.route.paramMap.subscribe(pm => {
            const slug = pm.get('slug');
            if (slug && !this.videos.some(v => v.slug === slug)) {
                // Unknown slug (old/typo link) — fall back to the gallery.
                this.router.navigate(['/videos'], { replaceUrl: true });
                return;
            }
            this.activeSlug = slug;
            this.selectedVideo = slug
                ? this.videos.find(v => v.slug === slug)!
                : this.videos[0];
            if (this.titlesLoaded) {
                this.applySeo();
            }
            if (this.pendingScroll && typeof document !== 'undefined') {
                this.pendingScroll = false;
                document.getElementById('featured-player')
                    ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }

    ngOnDestroy(): void {
        this.langSub?.unsubscribe();
        this.routeSub?.unsubscribe();
        this.seo.reset();
    }

    /** Card click: navigation happens via routerLink; we just flag the scroll. */
    onCardClick(): void {
        this.pendingScroll = true;
    }

    onSearchChange(): void {
        this.applyFilter();
        // Keep the search shareable: /videos?q=<term> (replaceUrl avoids
        // polluting browser history on every keystroke).
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { q: this.searchText.trim() || null },
            queryParamsHandling: 'merge',
            replaceUrl: true,
        });
    }

    clearSearch(): void {
        this.searchText = '';
        this.onSearchChange();
    }

    selectCategory(category: 'all' | VideoCategory): void {
        this.selectedCategory = category;
        this.applyFilter();
    }

    onLangFilterChange(): void {
        this.applyFilter();
    }

    /** No-results reset: search, topic, and language back to "everything". */
    clearAllFilters(): void {
        this.selectedCategory = 'all';
        this.selectedLang = 'all';
        this.clearSearch(); // re-applies the filter and cleans the ?q= param
    }

    async openAppointment(): Promise<void> {
        const { AppointmentDialogComponent } = await import('../../../shared/appointment-dialog/appointment-dialog.component');
        this.dialog.open(AppointmentDialogComponent, {
            width: '600px',
            maxWidth: '95vw',
            autoFocus: false
        });
    }

    /**
     * translate.get() waits for the translation file to finish loading —
     * instant() on first render returns raw keys, which Google then indexes
     * as the video name ("videos.list.v11" in GSC).
     */
    private loadTitles(): void {
        const titleKeys = this.videos.map(v => v.titleKey);
        this.translate.get(titleKeys).subscribe((titles: Record<string, string>) => {
            this.titles = titles;
            this.titlesLoaded = true;
            this.applyFilter();
            this.applySeo();
        });
    }

    /**
     * Accent/case-insensitive filter over the translated title + slug words.
     * The slug keeps English keywords searchable in the Spanish UI (and
     * Spanish keywords for the Spanish-only videos) — mirrors what people
     * type into Google, e.g. "fibromyalgia dr adonis".
     */
    /** Combines the three filters: topic pill, language, and search text. */
    applyFilter(): void {
        const query = this.normalize(this.searchText.trim());
        const tokens = query ? query.split(/\s+/) : [];
        this.filteredVideos = this.videos.filter(v => {
            if (this.selectedCategory !== 'all' && v.category !== this.selectedCategory) {
                return false;
            }
            if (this.selectedLang !== 'all' && (v.lang || 'en') !== this.selectedLang) {
                return false;
            }
            if (!tokens.length) {
                return true;
            }
            const title = this.titles[v.titleKey] || '';
            const haystack = this.normalize(
                `${title} ${v.slug.replace(/-/g, ' ')} dr adonis maiquez md video`
            );
            return tokens.every(t => haystack.includes(t));
        });
    }

    private normalize(s: string): string {
        return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    }

    /**
     * Videos page SEO — captures branded video searches + engagement signal
     * via VideoObject schema. On /videos/<slug> the selected video becomes
     * the page's primary entity (own title/description/canonical), so Google
     * can rank and deep-link each video for its topic.
     */
    private applySeo(): void {
        const lang = (this.translate.currentLang as 'en' | 'es') || 'en';
        const isEs = lang === 'es';
        const video = this.activeSlug
            ? this.videos.find(v => v.slug === this.activeSlug)
            : null;

        if (video) {
            const title = this.titles[video.titleKey] || video.titleKey;
            const url = this.seo.absoluteUrl(`/videos/${video.slug}`);
            this.seo.apply({
                title: `${title} | Dr. Adonis Maiquez, MD`,
                description: this.videoDescription(title, isEs),
                keywords: isEs
                    ? `${title}, Dr. Adonis, video medicina funcional Miami`
                    : `${title}, Dr. Adonis, functional medicine video Miami`,
                url,
                lang,
                ogType: 'website',
                image: `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`,
                jsonLd: [
                    this.videoJsonLd(video, isEs),
                    this.itemListJsonLd(isEs),
                ],
            });
            return;
        }

        const url = this.seo.absoluteUrl('/videos');
        const config = isEs
            ? {
                title: 'Videos & Testimonios | Dr. Adonis Maiquez Miami',
                description: 'Mira al Dr. Adonis explicando conceptos de medicina funcional y escucha testimonios reales de pacientes. Práctica médica calificada con 5 estrellas en Miami, Florida.',
                keywords: 'videos Dr. Adonis, testimonios medicina funcional Miami, reseñas Dr. Adonis Maiquez, pacientes medicina funcional, educación medicina funcional',
            }
            : {
                title: 'Patient Videos & Testimonials | Dr. Adonis Maiquez Miami',
                description: 'Watch Dr. Adonis explain functional medicine concepts and hear real patient testimonials. 5-star rated practice in Miami, Florida.',
                keywords: 'Dr. Adonis videos, functional medicine testimonials Miami, Dr. Adonis Maiquez reviews, patient stories functional medicine, functional medicine education',
            };

        this.seo.apply({
            ...config,
            url,
            lang,
            ogType: 'website',
            jsonLd: this.itemListJsonLd(isEs),
        });
    }

    private videoDescription(title: string, isEs: boolean): string {
        return isEs
            ? `${title}. Dr. Adonis Maiquez, MD explica conceptos de medicina funcional y regenerativa desde su consulta en Miami, Florida.`
            : `${title}. Dr. Adonis Maiquez, MD explains functional and regenerative medicine concepts from his Miami, Florida practice.`;
    }

    private videoJsonLd(v: VideoItem, isEs: boolean): Record<string, unknown> {
        const origin = this.seo.origin;
        const title = this.titles[v.titleKey] || v.titleKey;
        return {
            '@context': 'https://schema.org',
            '@type': 'VideoObject',
            '@id': `${origin}/videos/${v.slug}#video`,
            name: title,
            description: this.videoDescription(title, isEs),
            url: `${origin}/videos/${v.slug}`,
            thumbnailUrl: [
                `https://img.youtube.com/vi/${v.id}/maxresdefault.jpg`,
                `https://img.youtube.com/vi/${v.id}/hqdefault.jpg`,
                `https://img.youtube.com/vi/${v.id}/mqdefault.jpg`,
            ],
            embedUrl: `https://www.youtube.com/embed/${v.id}`,
            contentUrl: `https://www.youtube.com/watch?v=${v.id}`,
            uploadDate: '2024-01-01T00:00:00-05:00',
            inLanguage: v.lang || 'en',
            publisher: { '@type': 'Person', name: 'Dr. Adonis Maiquez, MD', '@id': `${origin}/#physician` },
        };
    }

    private itemListJsonLd(isEs: boolean): Record<string, unknown> {
        const origin = this.seo.origin;
        return {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            '@id': `${origin}/videos#video-list`,
            itemListElement: this.videos.map((v, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                url: `${origin}/videos/${v.slug}`,
                item: this.videoJsonLd(v, isEs),
            })),
        };
    }
}
