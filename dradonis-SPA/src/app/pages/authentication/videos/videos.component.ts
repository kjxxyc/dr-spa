import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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
        TranslateModule
    ],
    templateUrl: './videos.component.html',
    styleUrls: ['./videos.component.scss']
})
export class VideosComponent {
    videos: VideoItem[] = [];
    selectedVideo: VideoItem | null = null;

    // Google Maps Place ID for reviews embed
    googleMapsUrl: SafeResourceUrl;

    constructor(private sanitizer: DomSanitizer) {
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

        this.googleMapsUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
            'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3592.1!2d-80.213865!3d25.7863004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88d9b76d1434265b%3A0xfa2d0d393c1e7ec3!2sDr.%20Adonis%20(Adonis%20Maiquez%2C%20MD)!5e0!3m2!1sen!2sus!4v1'
        );
    }

    selectVideo(video: VideoItem) {
        this.selectedVideo = video;
        // Scroll to top of featured player
        const el = document.getElementById('featured-player');
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}
