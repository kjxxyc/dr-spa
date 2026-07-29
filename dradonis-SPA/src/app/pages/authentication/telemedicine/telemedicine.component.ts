import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { SeoService } from '../../../shared/seo/seo.service';

interface TelemedicineStep {
    icon: string;
    titleKey: string;
    textKey: string;
}

@Component({
    selector: 'app-telemedicine',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
        TranslateModule
    ],
    templateUrl: './telemedicine.component.html',
    styleUrls: ['./telemedicine.component.scss']
})
export class TelemedicineComponent implements OnInit, OnDestroy {
    private langSub?: Subscription;
    currentLang = 'en';

    // Icons restricted to the self-hosted Material Icons subset font
    // (assets/fonts/material-icons/material-icons-subset.woff2).
    steps: TelemedicineStep[] = [
        { icon: 'event', titleKey: 'telemedicinePage.step1Title', textKey: 'telemedicinePage.step1Text' },
        { icon: 'mail_outline', titleKey: 'telemedicinePage.step2Title', textKey: 'telemedicinePage.step2Text' },
        { icon: 'videocam', titleKey: 'telemedicinePage.step3Title', textKey: 'telemedicinePage.step3Text' },
        { icon: 'medical_services', titleKey: 'telemedicinePage.step4Title', textKey: 'telemedicinePage.step4Text' },
    ];

    treatments = [
        { icon: 'health_and_safety', key: 'telemedicinePage.treat1' },
        { icon: 'science', key: 'telemedicinePage.treat2' },
        { icon: 'spa', key: 'telemedicinePage.treat3' },
        { icon: 'monitor_weight', key: 'telemedicinePage.treat4' },
        { icon: 'favorite', key: 'telemedicinePage.treat5' },
        { icon: 'event', key: 'telemedicinePage.treat6' },
    ];

    needs = ['telemedicinePage.need1', 'telemedicinePage.need2', 'telemedicinePage.need3'];

    constructor(
        private translate: TranslateService,
        private dialog: MatDialog,
        private seo: SeoService,
    ) {
        this.currentLang = this.translate.currentLang || 'en';
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

    get whatsappUrl(): string {
        const msg = this.currentLang === 'es'
            ? 'Hola, deseo agendar una teleconsulta con el Dr. Adonis'
            : 'Hello, I would like to schedule a telemedicine appointment with Dr. Adonis';
        return `https://api.whatsapp.com/send/?phone=13053355424&text=${encodeURIComponent(msg)}&type=phone_number&app_absent=0`;
    }

    async openAppointment(): Promise<void> {
        const { AppointmentDialogComponent } = await import('../../../shared/appointment-dialog/appointment-dialog.component');
        this.dialog.open(AppointmentDialogComponent, {
            width: '600px',
            maxWidth: '95vw',
            autoFocus: false
        });
    }

    private applySeo(): void {
        const url = this.seo.absoluteUrl('/telemedicine');
        const lang = (this.translate.currentLang as 'en' | 'es') || 'en';
        const isEs = lang === 'es';
        const config = isEs
            ? {
                title: 'Teleconsulta con el Dr. Adonis | Medicina Funcional en Línea',
                description: 'Aprenda cómo funciona una teleconsulta con el Dr. Adonis Maiquez: agende en línea, reciba su enlace seguro y consulte desde su casa. Medicina funcional desde cualquier parte del mundo.',
                keywords: 'teleconsulta Dr. Adonis, telemedicina Miami, consulta virtual medicina funcional, cita en línea doctor, telemedicina en español',
            }
            : {
                title: 'Telemedicine with Dr. Adonis | Online Functional Medicine',
                description: 'Learn how a teleconsultation with Dr. Adonis Maiquez works: schedule online, receive your secure link, and consult from home. Functional medicine from anywhere in the world.',
                keywords: 'telemedicine Dr. Adonis, teleconsultation Miami, virtual functional medicine visit, online doctor appointment, telehealth Miami',
            };

        this.seo.apply({
            ...config,
            url,
            lang,
            ogType: 'website',
            jsonLd: this.buildJsonLd(isEs, url),
        });
    }

    private buildJsonLd(isEs: boolean, url: string): Record<string, unknown>[] {
        const origin = this.seo.origin;
        const stepNames = isEs
            ? ['Agende su cita', 'Reciba su confirmación', 'Conéctese el día de su cita', 'Reciba su plan personalizado']
            : ['Schedule your appointment', 'Receive your confirmation', 'Connect on the day of your visit', 'Receive your personalized plan'];
        const stepTexts = isEs
            ? [
                'Complete el formulario de citas y elija la opción Teleconsulta, llame al (305) 204-7816 o escriba por WhatsApp.',
                'El equipo confirma fecha y hora, y envía el enlace seguro de la videollamada por correo o WhatsApp.',
                'Conéctese desde un teléfono o computadora con cámara e internet; el Dr. Adonis revisa su historia, síntomas y laboratorios.',
                'Recibe su plan de tratamiento, órdenes de laboratorio y recetas; el seguimiento continúa en línea.',
            ]
            : [
                'Fill out the appointment form and choose the Telemedicine option, call (305) 204-7816, or message us on WhatsApp.',
                'The team confirms date and time and sends the secure video call link by email or WhatsApp.',
                'Connect from a phone or computer with a camera and internet; Dr. Adonis reviews your history, symptoms, and labs.',
                'Receive your treatment plan, lab orders, and prescriptions; follow-up continues online.',
            ];

        return [
            {
                '@context': 'https://schema.org',
                '@type': 'MedicalBusiness',
                '@id': `${url}#telemedicine`,
                name: 'Dr. Adonis Maiquez, MD — Telemedicine',
                description: isEs
                    ? 'Teleconsultas de medicina funcional y regenerativa con el Dr. Adonis Maiquez'
                    : 'Functional and regenerative medicine teleconsultations with Dr. Adonis Maiquez',
                url,
                image: `${origin}/assets/images/logos/Logo_720x192.jpg`,
                telephone: '+1-305-204-7816',
                address: {
                    '@type': 'PostalAddress',
                    addressLocality: 'Miami',
                    addressRegion: 'FL',
                    addressCountry: 'US',
                },
            },
            {
                '@context': 'https://schema.org',
                '@type': 'HowTo',
                '@id': `${url}#howto`,
                name: isEs
                    ? 'Cómo hacer una teleconsulta con el Dr. Adonis'
                    : 'How to have a teleconsultation with Dr. Adonis',
                step: stepNames.map((name, i) => ({
                    '@type': 'HowToStep',
                    position: i + 1,
                    name,
                    text: stepTexts[i],
                })),
            },
        ];
    }
}
