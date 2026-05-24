import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AppointmentDialogComponent } from '../../../shared/appointment-dialog/appointment-dialog.component';
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

    constructor(
        private sanitizer: DomSanitizer,
        private dialog: MatDialog,
        private translate: TranslateService,
        private seo: SeoService,
    ) {
        const videoIds = [
            { id: 'aM-fAwEvomw', titleKey: 'videos.list.v1' },
            { id: 'r6i4l-h_0eE', titleKey: 'videos.list.v2' },
            { id: 'sD_8x9_X_iY', titleKey: 'videos.list.v3' },
            { id: 'm4jL7o-l8yA', titleKey: 'videos.list.v4' },
            { id: 'HZ6wM-BPZPE', titleKey: 'videos.list.v5' },
            { id: 'KQR7tEd0Mco', titleKey: 'videos.list.v6' },
            { id: 'C_hN0N5Hfx4', titleKey: 'videos.list.v7' },
            { id: 'Fho8RBT2tQo', titleKey: 'videos.list.v8' },
            { id: 'O-oIXDpbXEQ', titleKey: 'videos.list.v9' },
            { id: 'g2tMcMQqSBA', titleKey: 'videos.list.v10' }
        ];

        this.videos = videoIds.map(v => ({
            ...v,
            embedUrl: this.sanitizer.bypassSecurityTrustResourceUrl(
                `https://www.youtube.com/embed/${v.id}`
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

    openAppointment(): void {
        this.dialog.open(AppointmentDialogComponent, {
            width: '600px',
            maxWidth: '95vw',
            autoFocus: false
        });
    }

    ngOnInit(): void {
        this.applySeo();
        this.langSub = this.translate.onLangChange.subscribe(() => this.applySeo());
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
        const url = this.seo.absoluteUrl('/landing/videos');
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
