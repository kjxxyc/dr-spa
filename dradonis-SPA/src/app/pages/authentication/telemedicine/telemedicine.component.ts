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

    faqs = [
        { q: 'telemedicinePage.faq1Q', a: 'telemedicinePage.faq1A' },
        { q: 'telemedicinePage.faq2Q', a: 'telemedicinePage.faq2A' },
        { q: 'telemedicinePage.faq3Q', a: 'telemedicinePage.faq3A' },
        { q: 'telemedicinePage.faq4Q', a: 'telemedicinePage.faq4A' },
    ];

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
            ? ['Agende su cita', 'Reciba su confirmación', 'Conéctese a su consulta', 'Reciba su plan']
            : ['Schedule your appointment', 'Receive your confirmation', 'Join your consultation', 'Receive your plan'];
        // Mirrors the visible step texts (Google requires structured data to
        // match on-page content).
        const stepTexts = isEs
            ? [
                'Use el formulario de citas, llámenos o escríbanos por WhatsApp.',
                'Le confirmamos fecha y hora, y le enviamos el enlace seguro de su videollamada.',
                'Únase desde su teléfono o computadora. El Dr. Adonis le atiende cara a cara.',
                'Plan de tratamiento, laboratorios y recetas. Seguimiento 100% en línea.',
            ]
            : [
                'Use the appointment form, call us, or message us on WhatsApp.',
                'We confirm your date and time and send you a secure video call link.',
                'Join from your phone or computer. Dr. Adonis sees you face to face.',
                'Treatment plan, labs, and prescriptions. Follow-up 100% online.',
            ];
        const faqData = isEs
            ? [
                { q: '¿Atiende pacientes fuera de Estados Unidos?', a: 'Sí. El Dr. Adonis atiende por teleconsulta a pacientes dentro y fuera de Estados Unidos. Solo necesita conexión a internet y un dispositivo con cámara.' },
                { q: '¿Puede recetar medicamentos por telemedicina?', a: 'Sí. Cuando está médicamente indicado, el Dr. Adonis emite recetas como parte de su teleconsulta.' },
                { q: '¿En qué idiomas se atiende?', a: 'Las consultas están disponibles en español e inglés.' },
                { q: '¿Qué pasa si necesito laboratorios?', a: 'El Dr. Adonis emite la orden de laboratorio a la clínica o al seguro de su preferencia, y los resultados se revisan juntos en su consulta.' },
            ]
            : [
                { q: 'Do you see patients outside the United States?', a: 'Yes. Dr. Adonis sees patients via teleconsultation both inside and outside the United States. All you need is an internet connection and a device with a camera.' },
                { q: 'Can you prescribe medication via telemedicine?', a: 'Yes. When medically indicated, Dr. Adonis issues prescriptions as part of your teleconsultation.' },
                { q: 'In which languages are consultations available?', a: 'Consultations are available in English and Spanish.' },
                { q: 'What if I need lab work?', a: 'Dr. Adonis sends the lab order to the clinic or insurance provider of your choice, and the results are reviewed together during your visit.' },
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
            {
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                '@id': `${url}#faq`,
                mainEntity: faqData.map(f => ({
                    '@type': 'Question',
                    name: f.q,
                    acceptedAnswer: { '@type': 'Answer', text: f.a },
                })),
            },
        ];
    }
}
