import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
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

    constructor(
        private translate: TranslateService,
        private dialog: MatDialog
    ) { }

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
