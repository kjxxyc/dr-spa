import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AppointmentDialogComponent } from '../../../shared/appointment-dialog/appointment-dialog.component';

interface ServiceItem {
    id: string;
    icon: string;       // Must be in the material-icons-subset.woff2 font
    gradient: string;   // CSS gradient for the icon box
    featured?: boolean; // Highlights the card with a "FEATURED" badge
}

@Component({
    selector: 'app-services',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        MatButtonModule,
        MatIconModule,
        TranslateModule,
        MatDialogModule
    ],
    templateUrl: './services.component.html',
    styleUrls: ['./services.component.scss'],
    animations: [
        trigger('expandState', [
            state('collapsed', style({ height: '0', opacity: 0, padding: '0 1.5rem', overflow: 'hidden' })),
            state('expanded', style({ height: '*', opacity: 1, padding: '0 1.5rem 1.5rem', overflow: 'hidden' })),
            transition('collapsed <=> expanded', animate('300ms ease-in-out'))
        ])
    ]
})
export class ServicesComponent {
    // NOTE: icons are restricted to the project's material-icons-subset.woff2
    // Adding new icons requires regenerating the subset font.
    services: ServiceItem[] = [
        { id: 'brainProtocol',       icon: 'workspace_premium',  gradient: 'linear-gradient(135deg, #6366F1 0%, #4338CA 100%)', featured: true },
        { id: 'brainHealth',         icon: 'school',             gradient: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)', featured: true },
        { id: 'specializedLabs',     icon: 'medical_information', gradient: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)', featured: true },
        { id: 'painManagement',      icon: 'medical_services',   gradient: 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)' },
        { id: 'functionalMedicine',  icon: 'science',            gradient: 'linear-gradient(135deg, #14B8A6 0%, #0F766E 100%)' },
        { id: 'executivePhysical',   icon: 'verified',           gradient: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)' },
        { id: 'weightLoss',          icon: 'monitor_weight',     gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' },
        { id: 'hormoneTherapy',      icon: 'biotech',            gradient: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)' },
        { id: 'menopauseAndropause', icon: 'spa',                gradient: 'linear-gradient(135deg, #EC4899 0%, #BE185D 100%)' },
        { id: 'agingBiomarkers',     icon: 'calculate',          gradient: 'linear-gradient(135deg, #D97706 0%, #92400E 100%)' },
        { id: 'detoxification',      icon: 'health_and_safety',  gradient: 'linear-gradient(135deg, #10B981 0%, #047857 100%)' },
        { id: 'ivVitamin',           icon: 'medication',         gradient: 'linear-gradient(135deg, #F97316 0%, #C2410C 100%)' },
        { id: 'autoimmune',          icon: 'block',              gradient: 'linear-gradient(135deg, #4F46E5 0%, #312E81 100%)' },
        { id: 'fibromyalgia',        icon: 'self_improvement',   gradient: 'linear-gradient(135deg, #A855F7 0%, #7E22CE 100%)' },
        { id: 'neurotransmitters',   icon: 'swap_horiz',         gradient: 'linear-gradient(135deg, #D946EF 0%, #A21CAF 100%)' },
        { id: 'intestinalHealth',    icon: 'restaurant',         gradient: 'linear-gradient(135deg, #84CC16 0%, #4D7C0F 100%)' },
        { id: 'telomeres',           icon: 'auto_stories',       gradient: 'linear-gradient(135deg, #0EA5E9 0%, #0369A1 100%)' },
        { id: 'sexualHealth',        icon: 'favorite',           gradient: 'linear-gradient(135deg, #F43F5E 0%, #BE123C 100%)' }
    ];

    expandedId: string | null = null;

    constructor(private dialog: MatDialog) {}

    toggleService(id: string): void {
        this.expandedId = this.expandedId === id ? null : id;
    }

    openAppointment(): void {
        this.dialog.open(AppointmentDialogComponent, {
            width: '600px',
            maxWidth: '95vw',
            autoFocus: false
        });
    }
}
