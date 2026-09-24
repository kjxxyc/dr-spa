import { Component, OnInit, OnDestroy, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { SeoService } from '../../../shared/seo/seo.service';
import { SiteFooterComponent } from '../../../shared/site-footer/site-footer.component';
import { GHL_EMBED_SCRIPT_ID, GHL_EMBED_SCRIPT_URL, GHL_FORM_URL } from '../../../shared/appointment-dialog/ghl-form.constants';

@Component({
    selector: 'app-make-appointment',
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        MatIconModule,
        RouterModule,
        SiteFooterComponent
    ],
    templateUrl: './make-appointment.component.html',
    styleUrls: ['./make-appointment.component.scss']
})
export class MakeAppointmentComponent implements OnInit, OnDestroy {
    private sanitizer = inject(DomSanitizer);
    private platformId = inject(PLATFORM_ID);
    private translate = inject(TranslateService);
    private seo = inject(SeoService);

    currentLang = 'en';
    private langSub?: Subscription;

    formUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        GHL_FORM_URL
    );

    constructor() {
        this.currentLang = this.translate.currentLang || 'en';
    }

    ngOnInit(): void {
        this.applySeo();
        this.langSub = this.translate.onLangChange.subscribe(() => {
            this.currentLang = this.translate.currentLang;
            this.applySeo();
        });

        if (isPlatformBrowser(this.platformId)) {
            if (typeof window !== 'undefined') {
                const existingScript = document.getElementById(GHL_EMBED_SCRIPT_ID);
                if (!existingScript) {
                    const script = document.createElement('script');
                    script.id = GHL_EMBED_SCRIPT_ID;
                    script.src = GHL_EMBED_SCRIPT_URL;
                    script.async = true;
                    document.body.appendChild(script);
                }
            }
        }
    }

    ngOnDestroy(): void {
        this.langSub?.unsubscribe();
        this.seo.reset();
    }

    toggleLanguage(): void {
        this.currentLang = this.currentLang === 'en' ? 'es' : 'en';
        this.translate.use(this.currentLang);
    }

    private applySeo(): void {
        const isEs = this.currentLang === 'es';
        const origin = this.seo.origin;

        this.seo.apply({
            title: isEs
                ? 'Agendar Cita | Dr. Adonis – Medicina Funcional en Miami'
                : 'Make an Appointment | Dr. Adonis – Functional Medicine in Miami',
            description: isEs
                ? 'Agende su cita con el Dr. Adonis Maiquez, especialista en medicina funcional y regenerativa en Miami, FL. Formulario rápido y fácil.'
                : 'Schedule your appointment with Dr. Adonis Maiquez, functional and regenerative medicine specialist in Miami, FL. Quick and easy contact form.',
            keywords: isEs
                ? 'cita médica Miami, agendar cita Dr. Adonis, medicina funcional Miami, cita regenerativa'
                : 'appointment Miami, schedule appointment Dr. Adonis, functional medicine Miami, book appointment',
            url: `${origin}/makeanappointment`,
            lang: isEs ? 'es' : 'en',
            jsonLd: {
                '@context': 'https://schema.org',
                '@type': 'MedicalBusiness',
                name: 'Dr. Adonis Maiquez, MD',
                description: isEs
                    ? 'Especialista en medicina funcional y regenerativa en Miami'
                    : 'Functional & Regenerative Medicine specialist in Miami',
                url: `${origin}/makeanappointment`,
                telephone: '+1-305-290-4691',
                address: {
                    '@type': 'PostalAddress',
                    addressLocality: 'Miami',
                    addressRegion: 'FL',
                    addressCountry: 'US',
                },
                aggregateRating: {
                    '@type': 'AggregateRating',
                    ratingValue: '4.9',
                    reviewCount: '210',
                },
            },
        });
    }
}
