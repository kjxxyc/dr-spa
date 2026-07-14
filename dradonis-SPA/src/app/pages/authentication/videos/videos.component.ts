import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { SeoService } from '../../../shared/seo/seo.service';

export interface VideoItem {
    id: string;
    titleKey: string;
    embedUrl: SafeResourceUrl;
}

@Component({
    selector: 'app-videos',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
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
    videos: VideoItem[] = [];
    selectedVideo: VideoItem | null = null;
    currentLang = 'en';

    constructor(
        private sanitizer: DomSanitizer,
        private dialog: MatDialog,
        private translate: TranslateService,
        private seo: SeoService,
    ) {
        this.currentLang = this.translate.currentLang || 'en';
        const videoIds = [
            // ── Featured: book preview ──
            { id: 'SyF9dvOCCKI', titleKey: 'videos.list.v58' },
            // ── From old WordPress gallery (Page 1) ──
            { id: 'F-jWDkQGMRg', titleKey: 'videos.list.v11' },
            { id: 'ri-sLzyiJjU', titleKey: 'videos.list.v12' },
            { id: 'M32eBbD-axE', titleKey: 'videos.list.v13' },
            { id: 'kAeswsB3bkk', titleKey: 'videos.list.v14' },
            { id: 'C5TrmOI9TMY', titleKey: 'videos.list.v15' },
            { id: 'NQbmfUu8UHc', titleKey: 'videos.list.v16' },
            { id: 'r5dT3iNlqXU', titleKey: 'videos.list.v17' },
            { id: 'iyK-EPbfBlU', titleKey: 'videos.list.v18' },
            { id: 'GKZR_XiSIbQ', titleKey: 'videos.list.v19' },
            { id: 'QD-m7tjkLSs', titleKey: 'videos.list.v20' },
            { id: '8ROj00ttX3w', titleKey: 'videos.list.v21' },
            { id: 'RTKw2uPrk3s', titleKey: 'videos.list.v22' },
            { id: 'i2-KROsfOqM', titleKey: 'videos.list.v23' },
            { id: 'GcCt2jpYZpQ', titleKey: 'videos.list.v24' },
            { id: 'wTn0WuYyN1o', titleKey: 'videos.list.v25' },
            // ── Spanish-only versions from YouTube channel ──
            { id: 'brnZdPm7mk8', titleKey: 'videos.list.v26' },
            { id: 'cWrF75jkQhA', titleKey: 'videos.list.v27' },
            { id: 'E-qqKxVesoc', titleKey: 'videos.list.v28' },
            { id: 'QbQFOirN93I', titleKey: 'videos.list.v29' },
            { id: 'WisYn539OSk', titleKey: 'videos.list.v30' },
            { id: 'cgGzztfNPKw', titleKey: 'videos.list.v31' },
            { id: 'K0YRurRVaEk', titleKey: 'videos.list.v32' },
            { id: 'XMFAZB0dc20', titleKey: 'videos.list.v33' },
            { id: 'hFwbHwvHoqU', titleKey: 'videos.list.v34' },
            { id: 'L5VVQJ0lncM', titleKey: 'videos.list.v35' },
            { id: 'v8pqsvpFkZI', titleKey: 'videos.list.v36' },
            { id: 'rcaDR0VmaHY', titleKey: 'videos.list.v37' },
            { id: 'yapm1IN6ObI', titleKey: 'videos.list.v38' },
            { id: 'HROxqwf09rU', titleKey: 'videos.list.v39' },
            { id: 'jaWlrZQ3Jyw', titleKey: 'videos.list.v40' },
            // ── From old WordPress gallery (Pages 2 & 3) ──
            { id: 'CpcAM1wrkPQ', titleKey: 'videos.list.v41' },
            { id: 'wB3GeOd6S6E', titleKey: 'videos.list.v42' },
            { id: 'zTAlspcuWkE', titleKey: 'videos.list.v43' },
            { id: 'Kjke1NwQdXU', titleKey: 'videos.list.v44' },
            { id: 'hWtgtv8O3NM', titleKey: 'videos.list.v45' },
            { id: 'NJ2wFogrjqg', titleKey: 'videos.list.v46' },
            { id: '14SZvW-OrGw', titleKey: 'videos.list.v47' },
            { id: 'POOENh8EfxQ', titleKey: 'videos.list.v48' },
            { id: 'BOiX3WyyR6E', titleKey: 'videos.list.v49' },
            { id: 'Rd0Xm7NM3ho', titleKey: 'videos.list.v50' },
            { id: 'C9n90j9Y98U', titleKey: 'videos.list.v51' },
            { id: 'GvSc1QB_0Ts', titleKey: 'videos.list.v52' },
            { id: 'q_tkF0eeOeA', titleKey: 'videos.list.v53' },
            { id: '79Rx5UkoF40', titleKey: 'videos.list.v54' },
            { id: 'R5GW_x2qDck', titleKey: 'videos.list.v55' },
            { id: 'xOPKQ6YRpyk', titleKey: 'videos.list.v56' },
            { id: 'MYbdQgPCEYg', titleKey: 'videos.list.v57' },
            { id: 'lWorK6csgvI', titleKey: 'videos.list.v59' },
            { id: '3fbZ5Rqar3I', titleKey: 'videos.list.v60' },
            { id: 'hysrzfqncCA', titleKey: 'videos.list.v61' },
            { id: 'aM-fAwEvomw', titleKey: 'videos.list.v62' },
            { id: 'gfV0Ye73jS0', titleKey: 'videos.list.v63' }
        ];

        const pageOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://dradonis.com';
        this.videos = videoIds.map(v => ({
            ...v,
            embedUrl: this.sanitizer.bypassSecurityTrustResourceUrl(
                `https://www.youtube.com/embed/${v.id}?enablejsapi=0&origin=${pageOrigin}&rel=0`
            )
        }));

        this.selectedVideo = this.videos[0];
    }

    selectVideo(video: VideoItem) {
        this.selectedVideo = video;
        // Scroll to top of featured player
        const el = document.getElementById('featured-player');
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    async openAppointment(): Promise<void> {
        const { AppointmentDialogComponent } = await import('../../../shared/appointment-dialog/appointment-dialog.component');
        this.dialog.open(AppointmentDialogComponent, {
            width: '600px',
            maxWidth: '95vw',
            autoFocus: false
        });
    }

    ngOnInit(): void {
        this.applySeo();
        this.langSub = this.translate.onLangChange.subscribe(e => {
            this.currentLang = e.lang;
            this.applySeo();
        });
    }

    ngOnDestroy(): void {
        this.langSub?.unsubscribe();
        this.seo.reset();
    }

    /**
     * Videos page SEO — captures branded video searches + engagement signal
     * via VideoObject schema. Tells Google about each embedded video.
     */
    private applySeo(): void {
        const url = this.seo.absoluteUrl('/videos');
        const lang = (this.translate.currentLang as 'en' | 'es') || 'en';
        const isEs = lang === 'es';
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
            jsonLd: this.buildJsonLd(lang, url),
        });
    }

    private buildJsonLd(lang: 'en' | 'es', url: string): Record<string, unknown> {
        const origin = this.seo.origin;
        return {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            '@id': `${url}#video-list`,
            itemListElement: this.videos.map((v, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                item: {
                    '@type': 'VideoObject',
                    name: v.titleKey,
                    thumbnailUrl: `https://img.youtube.com/vi/${v.id}/maxresdefault.jpg`,
                    embedUrl: `https://www.youtube.com/embed/${v.id}`,
                    uploadDate: '2024-01-01',
                    publisher: { '@type': 'Person', name: 'Dr. Adonis Maiquez, MD', '@id': `${origin}/#physician` },
                },
            })),
        };
    }
}
