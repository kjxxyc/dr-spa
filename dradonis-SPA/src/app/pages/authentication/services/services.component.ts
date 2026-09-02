import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { SeoService } from '../../../shared/seo/seo.service';

interface ServiceItem {
    id: string;
    icon: string;       // Must be in the material-icons-subset.woff2 font
    gradient: string;   // CSS gradient for the icon box
    featured?: boolean; // Highlights the card with a "FEATURED" badge
    offer?: string | number; // Highlights the card with an offer badge
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
export class ServicesComponent implements OnInit, OnDestroy {
    private langSub?: Subscription;

    // NOTE: icons are restricted to the project's material-icons-subset.woff2
    // Adding new icons requires regenerating the subset font.
    services: ServiceItem[] = [
        { id: 'telemedicine',        icon: 'verified',           gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', featured: true },
        { id: 'brainProtocol',       icon: 'workspace_premium',  gradient: 'linear-gradient(135deg, #6366F1 0%, #4338CA 100%)', featured: true },
        { id: 'brainHealth',         icon: 'school',             gradient: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)', featured: true },
        { id: 'weightLoss',          icon: 'monitor_weight',     gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' },
        { id: 'painManagement',      icon: 'medical_services',   gradient: 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)' },
        { id: 'functionalMedicine',  icon: 'science',            gradient: 'linear-gradient(135deg, #14B8A6 0%, #0F766E 100%)' },
        { id: 'executivePhysical',   icon: 'verified',           gradient: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)' },
        { id: 'hormoneTherapy',      icon: 'biotech',            gradient: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)' },
        { id: 'menopauseAndropause', icon: 'spa',                gradient: 'linear-gradient(135deg, #EC4899 0%, #BE185D 100%)' },
        { id: 'agingBiomarkers',     icon: 'calculate',          gradient: 'linear-gradient(135deg, #D97706 0%, #92400E 100%)' },
        { id: 'autoimmune',          icon: 'block',              gradient: 'linear-gradient(135deg, #4F46E5 0%, #312E81 100%)' },
        { id: 'fibromyalgia',        icon: 'self_improvement',   gradient: 'linear-gradient(135deg, #A855F7 0%, #7E22CE 100%)' },
        { id: 'neurotransmitters',   icon: 'swap_horiz',         gradient: 'linear-gradient(135deg, #D946EF 0%, #A21CAF 100%)' },
        { id: 'intestinalHealth',    icon: 'restaurant',         gradient: 'linear-gradient(135deg, #84CC16 0%, #4D7C0F 100%)' },
        { id: 'telomeres',           icon: 'auto_stories',       gradient: 'linear-gradient(135deg, #0EA5E9 0%, #0369A1 100%)' },
        { id: 'sexualHealth',        icon: 'favorite',           gradient: 'linear-gradient(135deg, #F43F5E 0%, #BE123C 100%)' },
        { id: 'regenerativeExosomes',icon: 'biotech',            gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', featured: true }
    ];

    expandedIds: string[] = [];

    constructor(
        private dialog: MatDialog,
        private translate: TranslateService,
        private seo: SeoService,
    ) {}

    ngOnInit(): void {
        this.applySeo();
        this.langSub = this.translate.onLangChange.subscribe(() => this.applySeo());
    }

    ngOnDestroy(): void {
        this.langSub?.unsubscribe();
        this.seo.reset();
    }

    /**
     * Services page SEO — high-value keywords for clinical service searches.
     * Uses MedicalBusiness schema + ItemList of all services as MedicalProcedures.
     */
    private applySeo(): void {
        const url = this.seo.absoluteUrl('/services');
        const lang = (this.translate.currentLang as 'en' | 'es') || 'en';
        const isEs = lang === 'es';
        const config = isEs
            ? {
                title: 'Servicios de Medicina Funcional Miami | Hormonas, Péptidos, Pérdida de Peso',
                description: 'Terapia hormonal bio-idéntica, testosterona, péptidos, GLP-1, menopausia, pérdida de peso, teleconsulta y telemedicina en Miami. Medicina funcional personalizada por el Dr. Adonis Maiquez.',
                keywords: 'medicina funcional Miami, telemedicina, teleconsulta, terapia hormonal Miami, testosterona Miami, péptidos Miami, GLP-1 Miami, menopausia Miami, pérdida de peso Miami, IV vitaminas Miami, Dr. Adonis Maiquez',
            }
            : {
                title: 'Functional Medicine Services Miami | Hormones, Peptides, Weight Loss',
                description: 'Bio-identical hormone therapy, testosterone, peptides, GLP-1, menopause, weight loss, telehealth and telemedicine in Miami. Personalized functional medicine by Dr. Adonis Maiquez.',
                keywords: 'functional medicine Miami, telemedicine, telehealth, online doctor consultation, hormone therapy Miami, testosterone Miami, peptide therapy Miami, GLP-1 Miami, menopause Miami, weight loss Miami, IV vitamins Miami, Dr. Adonis Maiquez',
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
            '@type': 'MedicalBusiness',
            '@id': `${url}#medical-business`,
            name: 'Dr. Adonis - Functional & Regenerative Medicine',
            url,
            telephone: '+1-305-290-4691',
            address: {
                '@type': 'PostalAddress',
                addressLocality: 'Miami',
                addressRegion: 'FL',
                addressCountry: 'US',
            },
            medicalSpecialty: ['Functional Medicine', 'Regenerative Medicine'],
            availableService: this.services.slice(0, 10).map((s) => ({
                '@type': 'MedicalProcedure',
                name: s.id,
                procedureType: 'TherapeuticProcedure',
            })),
            priceRange: '$$',
            image: `${origin}/assets/images/logos/Logo_720x192.jpg`,
        };
    }

    toggleService(index: number): void {
        const id = this.services[index].id;
        const isExpanded = this.expandedIds.includes(id);

        if (isExpanded) {
            // If already expanded, collapse everything
            this.expandedIds = [];
        } else {
            // Expand the clicked item
            this.expandedIds = [id];

            // If desktop (2 columns), also expand the sibling in the same row
            if (window.innerWidth > 968) {
                const isEven = index % 2 === 0;
                const siblingIndex = isEven ? index + 1 : index - 1;
                
                if (siblingIndex >= 0 && siblingIndex < this.services.length) {
                    this.expandedIds.push(this.services[siblingIndex].id);
                }
            }
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
}
