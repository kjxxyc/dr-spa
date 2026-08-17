import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { SeoService } from '../../../shared/seo/seo.service';
import emailjs from '@emailjs/browser';
import { SiteFooterComponent } from '../../../shared/site-footer/site-footer.component';

@Component({
    selector: 'app-make-appointment',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        TranslateModule,
        MatButtonModule,
        MatIconModule,
        MatSnackBarModule,
        RouterModule,
        SiteFooterComponent
    ],
    templateUrl: './make-appointment.component.html',
    styleUrls: ['./make-appointment.component.scss']
})
export class MakeAppointmentComponent implements OnInit, OnDestroy {
    appointmentForm!: FormGroup;
    isSubmitting = false;
    isSubmitted = false;
    currentYear = new Date().getFullYear();
    currentLang = 'en';

    private serviceId = 'service_ldtmz6n';
    private templateId = 'template_lgv92j9';
    private publicKey = 'vsVqtrledUCs4qrDT';
    private targetEmail = 'aymee@dradonis.com, solangie@dradonis.com';
    private langSub?: Subscription;

    constructor(
        private fb: FormBuilder,
        private snackBar: MatSnackBar,
        private translate: TranslateService,
        private seo: SeoService,
    ) {
        this.currentLang = this.translate.currentLang || 'en';
    }

    ngOnInit(): void {
        this.appointmentForm = this.fb.group({
            fullName: ['', Validators.required],
            email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/)]],
            phone: ['', [Validators.required, Validators.pattern(/^[0-9]{7,15}$/)]],
            appointmentType: ['inPerson', Validators.required],
            reason: ['', Validators.required],
        });

        this.applySeo();
        this.langSub = this.translate.onLangChange.subscribe(() => {
            this.currentLang = this.translate.currentLang;
            this.applySeo();
        });
    }

    ngOnDestroy(): void {
        this.langSub?.unsubscribe();
        this.seo.reset();
    }

    toggleLanguage(): void {
        this.currentLang = this.currentLang === 'en' ? 'es' : 'en';
        this.translate.use(this.currentLang);
    }

    onPhoneInput(event: Event): void {
        const input = event.target as HTMLInputElement;
        input.value = input.value.replace(/[^0-9]/g, '');
        this.appointmentForm.get('phone')?.setValue(input.value, { emitEvent: false });
    }

    onSubmit(): void {
        if (this.appointmentForm.invalid) {
            this.appointmentForm.markAllAsTouched();
            return;
        }

        this.isSubmitting = true;
        const formValue = this.appointmentForm.value;
        const typeLabel = formValue.appointmentType === 'telemedicine' ? 'TELECONSULTA' : 'PRESENCIAL';
        const finalReason = `${typeLabel} - ${formValue.reason}`;

        const message = `Full Name:\t${formValue.fullName}\nEmail:\t${formValue.email}\nPhone Number:\t${formValue.phone}\nReason for Appointment: ${finalReason}\n\n[Source: /makeanappointment]`;

        emailjs.send(this.serviceId, this.templateId, {
            client_email: this.targetEmail,
            client_subject: `NEW APPOINTMENT REQUEST (Meta) ${typeLabel}`,
            client_message: message,
        }, this.publicKey)
            .then(() => {
                this.isSubmitting = false;
                this.isSubmitted = true;
                this.snackBar.open(this.translate.instant('appointmentModal.success'), 'OK', { duration: 5000 });
            })
            .catch((err) => {
                this.isSubmitting = false;
                console.error('Email send failed:', err);
                this.snackBar.open(this.translate.instant('appointmentModal.error'), 'OK', { duration: 5000 });
            });
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
                telephone: '+1-305-204-7816',
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
