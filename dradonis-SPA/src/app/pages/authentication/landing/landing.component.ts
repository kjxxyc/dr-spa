import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NewsletterDialogComponent } from './newsletter-dialog.component';

@Component({
    selector: 'app-landing',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
        TranslateModule
    ],
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.scss']
})
export class LandingComponent {
    // Services for the marquee carousel — muted/earthy palette, medical-friendly.
    // Keys come from cardecal.services.*
    services = [
        { id: 'functional',   icon: 'health_and_safety',   color: '#6B9080' }, // sage green
        { id: 'hormone',      icon: 'science',             color: '#8B7EA8' }, // muted lavender
        { id: 'testosterone', icon: 'fitness_center',      color: '#D4A574' }, // warm tan
        { id: 'menopause',    icon: 'spa',                 color: '#C490A0' }, // dusty rose
        { id: 'peptides',     icon: 'biotech',             color: '#7FA8B0' }, // muted teal
        { id: 'weight',       icon: 'monitor_weight',      color: '#9CAF7E' }, // olive
        { id: 'glp1',         icon: 'medical_information', color: '#7B9BC1' }, // powder blue
        { id: 'ed',           icon: 'favorite',            color: '#C28080' }, // muted coral
        { id: 'video',        icon: 'videocam',            color: '#9B8AB0' }, // mauve
        { id: 'noVisit',      icon: 'phonelink_ring',      color: '#80A8A0' }, // sea green
    ];

    // Second row uses the same list reversed for a brick-stacked offset effect
    get servicesAlt() {
        return [...this.services].reverse();
    }

    // Google Maps embed URL for testimonials section
    googleMapsUrl: SafeResourceUrl;

    constructor(
        private translate: TranslateService,
        private dialog: MatDialog,
        private sanitizer: DomSanitizer
    ) {
        this.googleMapsUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
            'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3592.1!2d-80.213865!3d25.7863004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88d9b76d1434265b%3A0xfa2d0d393c1e7ec3!2sDr.%20Adonis%20(Adonis%20Maiquez%2C%20MD)!5e0!3m2!1sen!2sus!4v1'
        );
    }

    openNewsletterDialog() {
        const dialogRef = this.dialog.open(NewsletterDialogComponent, {
            width: '500px',
            maxWidth: '90vw',
            autoFocus: true,
            restoreFocus: true
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                console.log('Newsletter subscription data:', result);
            }
        });
    }
}
