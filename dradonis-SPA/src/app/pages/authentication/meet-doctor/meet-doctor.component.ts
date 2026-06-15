import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { SeoService } from '../../../shared/seo/seo.service';

@Component({
    selector: 'app-meet-doctor',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        MatButtonModule,
        MatIconModule,
        TranslateModule
    ],
    templateUrl: './meet-doctor.component.html',
    styleUrls: ['./meet-doctor.component.scss']
})
export class MeetDoctorComponent implements OnInit, OnDestroy {
    private langSub?: Subscription;

    constructor(
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
     * Meet-the-Doctor SEO — primary E-A-T (Expertise, Authoritativeness,
     * Trustworthiness) signal page. Targets brand queries like
     * "Dr. Adonis Maiquez" and credibility-building searches.
     */
    private applySeo(): void {
        const url = this.seo.absoluteUrl('/meet-doctor');
        const lang = (this.translate.currentLang as 'en' | 'es') || 'en';
        const isEs = lang === 'es';
        const config = isEs
            ? {
                title: 'Conoce al Dr. Adonis Maiquez, MD | Medicina Funcional Miami',
                description: 'El Dr. Adonis Maiquez es un médico certificado especialista en medicina funcional y regenerativa en Miami, Florida. Más de dos décadas tratando enfermedades crónicas desde la raíz.',
                keywords: 'Dr. Adonis Maiquez, médico medicina funcional Miami, doctor regenerativa Miami, biografía Dr. Adonis, credenciales médicas Miami',
            }
            : {
                title: 'Meet Dr. Adonis Maiquez, MD | Functional Medicine Doctor Miami',
                description: 'Dr. Adonis Maiquez is a board-certified physician specializing in functional & regenerative medicine in Miami, FL. Over two decades treating chronic disease at the root cause.',
                keywords: 'Dr. Adonis Maiquez, functional medicine doctor Miami, regenerative medicine physician Miami, Dr. Adonis biography, Miami functional medicine credentials',
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
        const isEs = lang === 'es';
        return {
            '@context': 'https://schema.org',
            '@type': 'Physician',
            '@id': `${origin}/#physician`,
            mainEntityOfPage: url,
            name: 'Dr. Adonis Maiquez, MD',
            url,
            image: `${origin}/assets/images/logos/dr-full-img.webp`,
            jobTitle: isEs ? 'Médico de Medicina Funcional y Regenerativa' : 'Functional & Regenerative Medicine Physician',
            telephone: '+1-305-204-7816',
            address: {
                '@type': 'PostalAddress',
                addressLocality: 'Miami',
                addressRegion: 'FL',
                addressCountry: 'US',
            },
            medicalSpecialty: ['Functional Medicine', 'Regenerative Medicine', 'Anti-Aging Medicine'],
            sameAs: [
                'https://www.youtube.com/@DrAdonisMaiquezMD',
                'https://www.instagram.com/dradonisfunctionalmedicine/',
                'https://www.facebook.com/DrAdonis/',
            ],
        };
    }
}
