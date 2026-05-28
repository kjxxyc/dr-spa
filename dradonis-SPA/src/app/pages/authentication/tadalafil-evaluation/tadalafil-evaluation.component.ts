import { Component, OnInit, OnDestroy, NgZone, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import type { StepperSelectionEvent } from '@angular/cdk/stepper';
import type { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import emailjs from '@emailjs/browser';
import { SeoService } from '../../../shared/seo/seo.service';

// ---------- translations ----------
const TRANSLATIONS: Record<string, Record<string, string>> = {
    en: {
        title: 'Tadalafil Medical Evaluation',
        subtitle: 'Answer the following questions to determine your profile\'s compatibility with our available options. This process is quick, secure, and for internal use only.',
        fieldsRequired: 'All fields are required',
        // Step labels
        stepPersonalInfo: 'Personal Information',
        stepQuestions1: 'Medical History (1–4)',
        stepQuestions2: 'Medical History (5–8)',
        stepReview: 'Review & Submit',
        // Personal info fields
        dateOfBirth: 'Date of Birth',
        sex: 'Biological Sex',
        sexMale: 'Male',
        sexFemale: 'Female',
        edQuestion: 'Are you looking for a treatment to improve your intimate performance?',
        // Questions
        q1: '1. Are you currently using any medications containing nitrates? (Examples: Nitroglycerin, Isosorbide, or recreational drugs known as "poppers")',
        q1Note: 'Note: For your safety, combined use is not compatible due to blood pressure risks. If in doubt, please contact us.',
        q2: '2. Have you experienced any cardiovascular events in the last 6 months? (Myocardial infarction, stroke, or serious arrhythmias)',
        q3: '3. Do you suffer from heart failure or unstable angina (chest pain)?',
        q4: '4. What is your usual blood pressure?',
        q4Opt1: 'It is controlled/Normal.',
        q4OptNeutral: 'I do not suffer from high blood pressure / I believe it is normal.',
        q4Opt2: 'I suffer from very low blood pressure (Hypotension).',
        q4Opt3: 'I suffer from uncontrolled hypertension (high blood pressure).',
        q5: '5. Do you have any history of vision loss due to retinal or optic nerve problems (such as NAION optic neuropathy)?',
        q6: '6. Do you have any physical deformity or severe curvature of the penis (Peyronie\'s disease)?',
        q7: '7. Have you been diagnosed with severe kidney or liver failure?',
        q8: '8. Are you taking any other medications for erectile dysfunction or prostate problems (alpha blockers)?',
        // Options
        yes: 'Yes',
        no: 'No',
        // Disqualification
        disqualifiedTitle: 'Not Eligible for Online Prescription',
        disqualifiedMsg: 'We\'re sorry, for medical safety reasons, you are not a candidate for an online prescription.',
        disqualifiedLink: 'We recommend scheduling a teleconsultation or in-person consultation with Dr. Adonis.',
        // Review
        reviewTitle: 'Review your answers',
        viewAnswers: 'View my answers',
        qualifiedTitle: 'Evaluation Approved ✓',
        qualifiedMsg: 'Your evaluation has been reviewed by our healthcare providers. Based on your responses, you have been approved to proceed with the purchase of Tadalafil (Cialis).',
        confirmLabel: 'I confirm that all information provided is correct and truthful so the doctor can safely evaluate my case.',
        // Buttons
        next: 'Next',
        back: 'Back',
        submit: 'Submit Evaluation',
        sending: 'Sending...',
        // Messages
        reviewingTitle: 'Reviewing your evaluation...',
        reviewingMsg: 'A healthcare provider is reviewing your responses. This will only take a moment.',
        successTitle: 'Evaluation Reviewed Successfully!',
        successMsg: 'A health care provider has reviewed your evaluation. Please complete your contact information and proceed to payment.',
        // Product card shown post-approval, before the payment step
        productName: 'Tadalafil (Cialis®) 20 mg',
        productDetails: 'Bottle of 30 tablets',
        productPriceLabel: 'one-time payment',
        paymentTitle: 'Contact Information & Payment',
        paymentSubtitle: 'Please provide your details before proceeding to payment.',
        payWithPaypal: 'Pay with PayPal',
        payWithClover: 'Pay with CLOVER',
        snackSuccess: '✅ Ready! Please proceed with payment.',
        snackError: '❌ Failed to send. Please try again.',
        snackInvalid: 'Please answer all required questions.',
        snackPaymentInvalid: 'Please fill in all contact fields before proceeding to payment.',
        langToggle: 'Español',
        // Section 1: Contact info
        contactFullName: 'Full Name',
        contactEmailAddress: 'Email',
        securityMessage: 'The data shared in this form is handled under strict security and encryption standards. The information is exclusively used for processing your request and will not be shared with third parties under any circumstances.',
        contactNextBtn: 'Next',
        // Payment contact fields
        contactName: 'Full Name',
        contactAddress: 'Address',
        contactPhone: 'Phone Number',
        contactEmail: 'Email',
        // Validation errors
        errorPhoneDigits: 'Phone number must contain only digits.',
        errorEmailFormat: 'Please enter a valid email (e.g. name@mail.com).',
        errorRequired: 'This field is required.',
        // Eligibility
        ageIneligibleTitle: 'Age Requirement Not Met',
        ageIneligibleMsg: 'You must be between 21 and 80 years old to be eligible for an online prescription.',
        ageIneligibleLink: 'We recommend scheduling a consultation with Dr. Adonis.',
        sexIneligibleTitle: 'Not Eligible',
        sexIneligibleMsg: 'Tadalafil (Cialis) is indicated for male patients only.',
        sexIneligibleLink: 'We recommend scheduling a consultation with Dr. Adonis for an appropriate evaluation.',
        edIneligibleTitle: 'Consultation Recommended',
        edIneligibleMsg: 'Based on your responses, an online prescription is not applicable at this time.',
        edIneligibleLink: 'We recommend scheduling a teleconsultation or in-person visit with Dr. Adonis for a personalized evaluation.',
        // Payment email
        processingPayment: 'Processing... Please wait.',
        paymentEmailSent: '✅ Notification sent. Redirecting to payment...',
        paymentEmailError: '❌ Could not send notification. Please try again.', 
    },
    es: {
        title: 'Evaluación Médica de Tadalafil',
        subtitle: 'Responde las siguientes preguntas para determinar la compatibilidad de tu perfil con nuestras opciones disponibles. Este proceso es rápido, seguro y de uso interno exclusivo.',
        fieldsRequired: 'Todos los campos son obligatorios',
        stepPersonalInfo: 'Información Personal',
        stepQuestions1: 'Historial Médico (1–4)',
        stepQuestions2: 'Historial Médico (5–8)',
        stepReview: 'Revisar y Enviar',
        // Personal info fields
        dateOfBirth: 'Fecha de Nacimiento',
        sex: 'Sexo Biológico',
        sexMale: 'Masculino',
        sexFemale: 'Femenino',
        edQuestion: '¿Está en busca de un tratamiento para mejorar su rendimiento íntimo?',
        q1: '1. ¿Utiliza actualmente medicamentos que contengan nitratos? (Ejemplos: Nitroglicerina, Isosorbida, o drogas recreativas conocidas como "poppers")',
        q1Note: 'Nota: Por tu seguridad, el uso combinado no es compatible debido a riesgos en la presión arterial. Si tienes dudas, consúltanos.',
        q2: '2. ¿Ha sufrido algún evento cardiovascular en los últimos 6 meses? (Infarto al miocardio, accidente cerebrovascular/Ictus o arritmias graves)',
        q3: '3. ¿Padece de insuficiencia cardíaca o angina de pecho (dolor de pecho) inestable?',
        q4: '4. ¿Cómo se encuentra su presión arterial habitualmente?',
        q4Opt1: 'Está controlada / Normal.',
        q4OptNeutral: 'No sufro de presión alta / Creo que es normal.',
        q4Opt2: 'Sufro de presión muy baja (Hipotensión).',
        q4Opt3: 'Sufro de hipertensión (presión alta) no controlada.',
        q5: '5. ¿Tiene algún antecedente de pérdida de visión debido a problemas en la retina o nervio óptico (como la neuropatía óptica NAION)?',
        q6: '6. ¿Padece alguna deformidad física o curvatura severa en el pene (enfermedad de Peyronie)?',
        q7: '7. ¿Ha sido diagnosticado con insuficiencia renal o hepática grave?',
        q8: '8. ¿Está tomando otros medicamentos para la disfunción eréctil o para la próstata (bloqueadores alfa)?',
        yes: 'Sí',
        no: 'No',
        disqualifiedTitle: 'No Elegible para Prescripción en Línea',
        disqualifiedMsg: 'Lo sentimos, por razones de seguridad médica, usted no es candidato para una prescripción en línea.',
        disqualifiedLink: 'Le recomendamos agendar una teleconsulta o consulta presencial con el Dr. Adonis.',
        scheduleLink: 'Agendar una consulta',
        reviewTitle: 'Revise sus respuestas',
        viewAnswers: 'Ver mis respuestas',
        qualifiedTitle: 'Evaluación Aprobada ✓',
        qualifiedMsg: 'Su evaluación ha sido revisada por nuestros proveedores de salud. Según sus respuestas, ha sido aprobado para proceder con la compra de Tadalafil (Cialis).',
        confirmLabel: 'Confirmo que toda la información suministrada es correcta y verdadera para que el médico pueda evaluar mi caso de forma segura.',
        next: 'Siguiente',
        back: 'Atrás',
        submit: 'Enviar Evaluación',
        sending: 'Enviando...',
        reviewingTitle: 'Revisando su evaluación...',
        reviewingMsg: 'Un proveedor de salud está revisando sus respuestas. Esto tomará solo un momento.',
        successTitle: '¡Evaluación Revisada Exitosamente!',
        successMsg: 'Un proveedor de atención médica ha revisado su evaluación. Por favor complete sus datos de contacto y proceda al pago.',
        // Tarjeta de producto mostrada tras la aprobación, antes del pago
        productName: 'Tadalafil (Cialis®) 20 mg',
        productDetails: 'Frasco de 30 tabletas',
        productPriceLabel: 'pago único',
        paymentTitle: 'Información de Contacto y Pago',
        paymentSubtitle: 'Por favor ingrese sus datos antes de proceder al pago.',
        payWithPaypal: 'Pagar con PayPal',
        payWithClover: 'Pagar con CLOVER',
        snackSuccess: '✅ ¡Listo! Proceda con el método de pago.',
        snackError: '❌ Error al enviar. Intente de nuevo.',
        snackInvalid: 'Por favor responda todas las preguntas obligatorias.',
        snackPaymentInvalid: 'Por favor complete todos los campos de contacto antes de proceder al pago.',
        langToggle: 'English',
        // Section 1: Contact info
        contactFullName: 'Nombre Completo',
        contactEmailAddress: 'Correo Electrónico',
        securityMessage: 'Los datos compartidos en este formulario se manejan bajo estrictos estándares de seguridad y cifrado. La información es de uso exclusivo para el procesamiento de tu solicitud y no será compartida con terceros bajo ningún concepto.',
        contactNextBtn: 'Siguiente',
        // Payment contact fields
        contactName: 'Nombre Completo',
        contactAddress: 'Dirección',
        contactPhone: 'Teléfono',
        contactEmail: 'Correo Electrónico',
        // Validation errors
        errorPhoneDigits: 'El número de teléfono solo debe contener dígitos.',
        errorEmailFormat: 'Ingrese un correo válido (ej. nombre@correo.com).',
        errorRequired: 'Este campo es obligatorio.',
        // Eligibility
        ageIneligibleTitle: 'Requisito de Edad No Cumplido',
        ageIneligibleMsg: 'Debe tener entre 21 y 80 años para ser elegible para una prescripción en línea.',
        ageIneligibleLink: 'Le recomendamos agendar una consulta con el Dr. Adonis.',
        sexIneligibleTitle: 'No Elegible',
        sexIneligibleMsg: 'Tadalafil (Cialis) está indicado únicamente para pacientes masculinos.',
        sexIneligibleLink: 'Le recomendamos agendar una consulta con el Dr. Adonis para una evaluación adecuada.',
        edIneligibleTitle: 'Consulta Recomendada',
        edIneligibleMsg: 'Según sus respuestas, una prescripción en línea no aplica en este momento.',
        edIneligibleLink: 'Le recomendamos agendar una teleconsulta o visita presencial con el Dr. Adonis para una evaluación personalizada.',
        // Payment email
        processingPayment: 'Procesando... Por favor espere.',
        paymentEmailSent: '✅ Notificación enviada. Redirigiendo al pago...',
        paymentEmailError: '❌ No se pudo enviar la notificación. Intente de nuevo.',
    },
};

@Component({
    selector: 'app-tadalafil-evaluation',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatRadioModule,
        MatSelectModule,
        MatStepperModule,
        MatCheckboxModule,
        MatSnackBarModule,
        MatExpansionModule,
        MatProgressSpinnerModule
    ],
    templateUrl: './tadalafil-evaluation.component.html',
    styleUrls: ['./tadalafil-evaluation.component.scss'],
})
export class TadalafilEvaluationComponent implements OnInit, OnDestroy {
    @ViewChild('stepper') stepper!: MatStepper;

    lang: 'en' | 'es' = 'en';
    isSubmitting = false;
    submitted = false;
    isReviewingEvaluation = false;
    confirmCheck = false;

    /**
     * Scroll the newly-active step header into view when the user advances
     * the vertical stepper. Without this, on mobile the page stays scrolled
     * near the previous "Next" button and the user lands mid-step (e.g. on
     * Q7 instead of Q5).
     *
     * IMPORTANT: Material's vertical stepper has a ~225ms expand animation.
     * We must wait for the new step's content to be laid out before reading
     * the header's position, otherwise we scroll to a stale offset.
     */
    onStepChange(event: StepperSelectionEvent): void {
        const scrollToActiveHeader = () => {
            const headers = document.querySelectorAll<HTMLElement>(
                '.tadalafil-eval .mat-step-header'
            );
            const target = headers[event.selectedIndex];
            if (!target) return;

            // Use absolute window scroll (more reliable than scrollIntoView
            // on mobile, especially inside scroll containers).
            const rect = target.getBoundingClientRect();
            const absoluteTop = rect.top + window.pageYOffset;
            const breathingRoom = 12; // tiny gap above the header

            window.scrollTo({
                top: Math.max(0, absoluteTop - breathingRoom),
                behavior: 'smooth',
            });
        };

        // Run outside Angular zone to avoid blocking change detection, then
        // wait long enough for the stepper's expand animation (~225ms) to
        // settle so getBoundingClientRect returns the final position.
        this.ngZone.runOutsideAngular(() => {
            // First quick scroll for snappy feedback…
            setTimeout(scrollToActiveHeader, 50);
            // …then a second one after the animation completes to land
            // precisely at the new step's header.
            setTimeout(scrollToActiveHeader, 320);
        });
    }

    personalInfoForm!: FormGroup;
    questionsForm1!: FormGroup;
    questionsForm2!: FormGroup;
    paymentContactForm!: FormGroup;
    maxDate = new Date(); // Cannot be born in the future

    // EmailJS (same config as vitamins form)
    private serviceId = 'service_ldtmz6n';
    private templateId = 'template_zbd3j1b';        // Admin notification (has auto-reply)
    private clientTemplateId = 'template_lgv92j9';  // Client email
    private publicKey = 'vsVqtrledUCs4qrDT';

    constructor(
        private fb: FormBuilder,
        private snackBar: MatSnackBar,
        private ngZone: NgZone,
        private router: Router,
        private seo: SeoService,
        @Inject(PLATFORM_ID) private platformId: Object,
    ) { }

    ngOnInit(): void {
        this.personalInfoForm = this.fb.group({
            dateOfBirth: [null, Validators.required],
            sex: ['male', Validators.required],
            edQuestion: ['yes', Validators.required],
        });

        this.questionsForm1 = this.fb.group({
            q1: ['', Validators.required],
            q2: ['', Validators.required],
            q3: ['', Validators.required],
            q4: ['', Validators.required],
        });

        this.questionsForm2 = this.fb.group({
            q5: ['', Validators.required],
            q6: ['', Validators.required],
            q7: ['', Validators.required],
            q8: ['', Validators.required],
        });

        this.paymentContactForm = this.fb.group({
            contactName: ['', Validators.required],
            contactAddress: ['', Validators.required],
            contactPhone: ['', [Validators.required, Validators.pattern(/^[0-9]{7,15}$/)]],
            contactEmail: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/)]],
        });

        // Read language preference passed from the landing page (Page 1) via router state.
        // `history` is a browser global — skip during SSR.
        if (isPlatformBrowser(this.platformId)) {
            const state = history.state as any;
            if (state?.lang) {
                this.lang = state.lang;
            }
        }

        // SEO: physician-prescribed evaluation positioning. Bilingual.
        // Avoid e-commerce / pharmacy keywords (legal compliance — site
        // does not sell as an online pharmacy, the clinic prescribes).
        this.applySeo();
    }

    ngOnDestroy(): void {
        // Restore site-wide defaults when leaving this route so the next
        // page doesn't inherit Tadalafil-specific tags.
        this.seo.reset();

        // Clean up Meta and TikTok pixels when leaving the evaluation flow.
        // The pixels are loaded in the landing page (men-wellness-contact) and
        // must stay alive through the evaluation so the Lead event fires at checkout.
        // Only clean up in the browser (not during SSR).
        if (isPlatformBrowser(this.platformId)) {
            this.removePixelTraces();
            this.removeTikTokTraces();
        }
    }

    // ─── Pixel Cleanup ──────────────────────────────────────────────

    /** Remove ALL traces of the Meta Pixel from the page. */
    private removePixelTraces(): void {
        const w = window as any;
        const noop = function () { };
        w.fbq = noop;
        w._fbq = noop;
        document.querySelectorAll('script[src*="connect.facebook.net"]').forEach(el => el.remove());
        document.querySelectorAll('script[src*="facebook.com"]').forEach(el => el.remove());
        document.querySelectorAll('img[src*="facebook.com/tr"]').forEach(el => el.remove());
        document.querySelectorAll('iframe[src*="facebook.com"]').forEach(el => el.remove());
        document.querySelectorAll('iframe[src*="facebook.net"]').forEach(el => el.remove());
        const fbGlobals = ['fbq', '_fbq', '__fbeventsModules', 'fbEvents',
            '_fbq_gtm', 'FB', '__fb_ev', 'fbds'];
        fbGlobals.forEach(key => {
            try { delete w[key]; } catch (_) { w[key] = undefined; }
        });
    }

    /** Remove ALL traces of the TikTok Pixel from the page. */
    private removeTikTokTraces(): void {
        const w = window as any;
        w.ttq = undefined;
        w.TiktokAnalyticsObject = undefined;
        document.querySelectorAll('script[src*="analytics.tiktok.com"]').forEach(el => el.remove());
        document.querySelectorAll('img[src*="analytics.tiktok.com"]').forEach(el => el.remove());
    }

    /**
     * Apply SEO metadata for this route. Re-runs whenever the user toggles
     * language so the localized meta take effect instantly.
     */
    private applySeo(): void {
        // Build URL from active origin so it auto-switches between
        // my.dradonis.com (current) and dradonis.com (post-migration)
        // without code changes.
        const url = this.seo.absoluteUrl('/men-wellness/evaluation');
        if (this.lang === 'es') {
            this.seo.apply({
                title: 'Evaluación Médica para Tadalafil (Cialis) en Miami | Dr. Adonis',
                description: 'Evaluación médica online para prescripción de Tadalafil (Cialis) 20 mg en Miami. Revisada por médico colegiado. Frasco de 30 tabletas por $19.99 con recogida en clínica o entrega local en Miami-Dade y Broward.',
                keywords: 'evaluación médica Tadalafil Miami, prescripción Cialis Florida, médico Tadalafil Miami, doctor disfunción eréctil Miami, Cialis 20mg Miami, telemedicina hombres Miami, Tadalafil entrega Miami, Dr. Adonis',
                url,
                lang: 'es',
                jsonLd: this.buildJsonLd('es', url),
            });
        } else {
            this.seo.apply({
                title: 'Tadalafil (Cialis) Medical Evaluation Miami | Dr. Adonis',
                description: 'Online medical evaluation for Tadalafil (Cialis) 20mg prescription in Miami. Reviewed by licensed physician. 30-tablet bottle for $19.99 with in-clinic pickup or local delivery in Miami-Dade and Broward counties.',
                keywords: 'Tadalafil medical evaluation Miami, Cialis prescription Florida, Tadalafil doctor Miami, erectile dysfunction physician Miami, Cialis 20mg Miami, men telemedicine Miami, Tadalafil delivery Miami, Dr. Adonis',
                url,
                lang: 'en',
                jsonLd: this.buildJsonLd('en', url),
            });
        }
    }

    /**
     * JSON-LD structured data for the evaluation page. Uses MedicalProcedure
     * + Service (not Product/Pharmacy) to signal Google this is a regulated
     * medical service, not an unregulated e-commerce listing.
     */
    private buildJsonLd(lang: 'en' | 'es', url: string): Record<string, unknown> {
        const isEs = lang === 'es';
        const origin = this.seo.origin;
        return {
            '@context': 'https://schema.org',
            '@graph': [
                {
                    '@type': 'MedicalProcedure',
                    '@id': `${url}#procedure`,
                    name: isEs
                        ? 'Evaluación médica para prescripción de Tadalafil (Cialis)'
                        : 'Medical evaluation for Tadalafil (Cialis) prescription',
                    procedureType: 'https://schema.org/DiagnosticProcedure',
                    bodyLocation: 'Genitourinary system',
                    howPerformed: isEs
                        ? 'Cuestionario médico online revisado por un médico colegiado en Florida.'
                        : 'Online medical questionnaire reviewed by a Florida-licensed physician.',
                    indication: {
                        '@type': 'MedicalCondition',
                        name: 'Erectile Dysfunction',
                    },
                    preparation: isEs
                        ? 'Tener a mano historial médico básico, lista de medicamentos actuales y fecha de nacimiento.'
                        : 'Have basic medical history, current medications list, and date of birth ready.',
                },
                {
                    '@type': 'Service',
                    '@id': `${url}#service`,
                    serviceType: isEs
                        ? 'Evaluación médica y prescripción de Tadalafil (Cialis)'
                        : 'Tadalafil (Cialis) medical evaluation and prescription',
                    provider: {
                        '@type': 'Physician',
                        '@id': `${origin}/#physician`,
                        name: 'Dr. Adonis Maiquez',
                        telephone: '+1-305-204-7816',
                        url: origin,
                    },
                    areaServed: [
                        { '@type': 'City', name: 'Miami' },
                        { '@type': 'City', name: 'Coral Gables' },
                        { '@type': 'City', name: 'Aventura' },
                        { '@type': 'City', name: 'Doral' },
                        { '@type': 'City', name: 'Hialeah' },
                        { '@type': 'City', name: 'Pembroke Pines' },
                        { '@type': 'City', name: 'Fort Lauderdale' },
                        { '@type': 'City', name: 'Boca Raton' },
                    ],
                    availableChannel: {
                        '@type': 'ServiceChannel',
                        serviceUrl: url,
                        availableLanguage: ['English', 'Spanish'],
                    },
                    offers: {
                        '@type': 'Offer',
                        price: '19.99',
                        priceCurrency: 'USD',
                        url,
                        availability: 'https://schema.org/InStock',
                        description: isEs
                            ? 'Frasco de 30 tabletas de Tadalafil (Cialis) 20 mg con prescripción médica. Recogida en clínica o entrega local en el sur de Florida.'
                            : '30-tablet bottle of Tadalafil (Cialis) 20mg with physician prescription. In-clinic pickup or local delivery in South Florida.',
                    },
                },
                {
                    '@type': 'MedicalWebPage',
                    '@id': `${url}#webpage`,
                    url,
                    inLanguage: isEs ? 'es-US' : 'en-US',
                    name: isEs
                        ? 'Evaluación Médica de Tadalafil (Cialis) Miami'
                        : 'Tadalafil (Cialis) Medical Evaluation Miami',
                    about: {
                        '@type': 'MedicalCondition',
                        name: 'Erectile Dysfunction',
                        alternateName: ['ED', 'Disfunción Eréctil'],
                    },
                    audience: {
                        '@type': 'PeopleAudience',
                        suggestedGender: 'Male',
                        suggestedMinAge: 21,
                        suggestedMaxAge: 80,
                    },
                },
            ],
        };
    }

    /** Translation helper */
    t(key: string): string {
        return TRANSLATIONS[this.lang]?.[key] ?? key;
    }

    get bannerImage(): string {
        return this.lang === 'en'
            ? '/assets/images/tadalafil-cialis-en.webp'
            : '/assets/images/tadalafil-cialis-es.webp';
    }

    get flagIcon(): string {
        return this.lang === 'en'
            ? '/assets/images/flag/icon-flag-en.svg'
            : '/assets/images/flag/icon-flag-es.svg';
    }

    get scheduleUrl(): string {
        return this.lang === 'en'
            ? 'https://dradonis.com/appointments/'
            : 'https://dradonis.com/citas/';
    }

    get otherFlagIcon(): string {
        return this.lang === 'en'
            ? '/assets/images/flag/icon-flag-es.svg'
            : '/assets/images/flag/icon-flag-en.svg';
    }

    toggleLanguage(): void {
        this.lang = this.lang === 'en' ? 'es' : 'en';
        // Re-apply SEO so title/description/og:locale switch immediately.
        this.applySeo();
    }

    /** Calculate age from date of birth */
    get calculatedAge(): number | null {
        const dob = this.personalInfoForm?.get('dateOfBirth')?.value;
        if (!dob) return null;
        const today = new Date();
        const birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    /** Check if age is between 21 and 80 */
    get isAgeEligible(): boolean {
        const age = this.calculatedAge;
        if (age === null) return true; // No date selected yet, don't block
        return age >= 21 && age <= 80;
    }

    /** Check if ED question is answered "yes" */
    get isEdEligible(): boolean {
        const ed = this.personalInfoForm?.get('edQuestion')?.value;
        if (!ed) return true; // Not answered yet, don't block
        return ed === 'yes';
    }

    /** Check if biological sex is male */
    get isSexEligible(): boolean {
        const sex = this.personalInfoForm?.get('sex')?.value;
        if (!sex) return true; // Not selected yet, don't block
        return sex === 'male';
    }

    /** Overall payment eligibility: age 21-80, male, ED=yes, not medically disqualified */
    get isPaymentEligible(): boolean {
        return this.isAgeEligible && this.isSexEligible && this.isEdEligible && !this.isDisqualified;
    }

    /** Check if user is disqualified based on answers to Q1, Q2, Q3, Q5, Q7 */
    get isDisqualified(): boolean {
        const q1 = this.questionsForm1.get('q1')?.value;
        const q2 = this.questionsForm1.get('q2')?.value;
        const q3 = this.questionsForm1.get('q3')?.value;
        const q5 = this.questionsForm2.get('q5')?.value;
        const q7 = this.questionsForm2.get('q7')?.value;
        return q1 === 'yes' || q2 === 'yes' || q3 === 'yes' || q5 === 'yes' || q7 === 'yes';
    }

    /** Check if a specific question's answer is disqualifying (for review highlighting) */
    isAnswerDisqualifying(question: string): boolean {
        switch (question) {
            case 'dob': return !this.isAgeEligible;
            case 'sex': return !this.isSexEligible;
            case 'ed': return !this.isEdEligible;
            case 'q1': return this.questionsForm1.get('q1')?.value === 'yes';
            case 'q2': return this.questionsForm1.get('q2')?.value === 'yes';
            case 'q3': return this.questionsForm1.get('q3')?.value === 'yes';
            case 'q5': return this.questionsForm2.get('q5')?.value === 'yes';
            case 'q7': return this.questionsForm2.get('q7')?.value === 'yes';
            default: return false;
        }
    }

    /** Helper to get translated answer */
    answerLabel(value: string, questionKey?: string): string {
        if (!value) return '—';
        if (questionKey === 'q4') {
            if (value === 'opt1') return this.t('q4Opt1');
            if (value === 'optNeutral') return this.t('q4OptNeutral');
            if (value === 'opt2') return this.t('q4Opt2');
            if (value === 'opt3') return this.t('q4Opt3');
        }
        if (questionKey === 'sex') {
            return value === 'male' ? this.t('sexMale') : this.t('sexFemale');
        }
        return value === 'yes' ? this.t('yes') : this.t('no');
    }

    /** Format date for display */
    formatDate(date: Date | null): string {
        if (!date) return '—';
        return date.toLocaleDateString(this.lang === 'en' ? 'en-US' : 'es-ES', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    }

    onSubmit(): void {
        this.personalInfoForm.markAllAsTouched();
        this.questionsForm1.markAllAsTouched();
        this.questionsForm2.markAllAsTouched();

        if (this.personalInfoForm.invalid || this.questionsForm1.invalid || this.questionsForm2.invalid) {
            this.snackBar.open(this.t('snackInvalid'), 'OK', { duration: 4000 });
            return;
        }

        // No email sent here — the admin + client notification is sent when clicking "Pay with Clover"
        this.isReviewingEvaluation = true;
        setTimeout(() => {
            this.isReviewingEvaluation = false;
            this.submitted = true;
            // Meta Pixel: fire Lead ONLY when user reaches the checkout/payment screen
            const w = window as any;
            if (typeof w.fbq === 'function') {
                w.fbq('track', 'Lead');
            }
            // TikTok Pixel: fire SubmitForm when evaluation is approved and checkout loads
            if (w.ttq && typeof w.ttq.track === 'function') {
                w.ttq.track('SubmitForm');
            }
            this.snackBar.open(this.t('snackSuccess'), 'OK', { duration: 5000 });
        }, 4800);
    }

    onPayPal(): void {
        if (!this.validatePaymentContact()) return;
        window.open('https://www.paypal.com', '_blank');
    }

    isProcessingPayment = false;

    /**
     * Creates a Clover Hosted Checkout session via our Azure Function backend
     * (/api/clover-create-checkout) and redirects the user to the returned
     * public checkout URL. The backend holds the Clover Ecommerce API token
     * (kept server-side as an Azure SWA Application Setting), so the secret
     * never reaches the browser.
     *
     * The returned URL has the format `https://www.clover.com/checkout/[id]`
     * — a real public page that works in every browser, including Chrome
     * iOS where the legacy `/pay-widgets/[uuid]` endpoint was being treated
     * as a .txt file download.
     */
    async onClover(): Promise<void> {
        if (!this.validatePaymentContact()) return;
        if (this.isProcessingPayment) return;

        this.isProcessingPayment = true;
        this.snackBar.open(this.t('processingPayment'), '', { duration: 8000 });

        const contact = this.paymentContactForm.value;
        const personalInfo = this.personalInfoForm.value;
        const answers = {
            ...this.questionsForm1.value,
            ...this.questionsForm2.value,
        };

        // Build admin message with all patient info
        const adminMessage = `TADALAFIL (CIALIS) - PAYMENT INITIATED\n\n`
            + `Patient ${contact.contactName} has completed the Tadalafil (Cialis) medical evaluation and PASSED.\n`
            + `They have been redirected to Clover for payment.\n`
            + `Please verify the payment in Clover and proceed to contact the patient to coordinate delivery.\n\n`
            + `--- Patient Information ---\n`
            + `Name: ${contact.contactName}\n`
            + `Email: ${contact.contactEmail}\n`
            + `Phone: ${contact.contactPhone}\n`
            + `Address: ${contact.contactAddress}\n`
            + `Date of Birth: ${this.formatDate(personalInfo.dateOfBirth)}\n`
            + `Sex: ${this.answerLabel(personalInfo.sex, 'sex')}\n`
            + `ED Question: ${this.answerLabel(personalInfo.edQuestion)}\n\n`
            + `--- Medical Evaluation ---\n`
            + `Q1 Nitrates: ${this.answerLabel(answers.q1)}\n`
            + `Q2 Cardiovascular: ${this.answerLabel(answers.q2)}\n`
            + `Q3 Heart Failure: ${this.answerLabel(answers.q3)}\n`
            + `Q4 Blood Pressure: ${this.answerLabel(answers.q4, 'q4')}\n`
            + `Q5 Vision Loss: ${this.answerLabel(answers.q5)}\n`
            + `Q6 Peyronie: ${this.answerLabel(answers.q6)}\n`
            + `Q7 Kidney/Liver: ${this.answerLabel(answers.q7)}\n`
            + `Q8 Other Meds: ${this.answerLabel(answers.q8)}\n`
            + `Result: ELIGIBLE\n`
            + `Language: ${this.lang === 'en' ? 'English' : 'Spanish'}`;

        const clientMessage = this.lang === 'en'
            ? `Dear ${contact.contactName},\n\nYour medical evaluation for Tadalafil (Cialis) has been reviewed and approved by our healthcare providers. You are eligible for the use of this medication.\n\nOnce your payment is confirmed through Clover, we will contact you to coordinate the delivery of your prescription.\n\nPlease feel free to contact us at 305-204-7816 if you have any questions.\n\nBest regards,\nDr. Adonis Medical Team`
            : `Estimado ${contact.contactName},\n\nSu evaluación médica para Tadalafil (Cialis) ha sido revisada y aprobada por nuestros proveedores de salud. Usted es apto para el uso de este medicamento.\n\nUna vez que su pago sea confirmado a través de Clover, nos comunicaremos con usted para coordinar la entrega de su prescripción.\n\nPor favor, no dude en contactarnos al 305-204-7816 si tiene alguna pregunta.\n\nAtentamente,\nEquipo Médico Dr. Adonis`;

        const clientSubject = this.lang === 'en'
            ? 'Your Tadalafil (Cialis) Evaluation Has Been Approved'
            : 'Su Evaluación de Tadalafil (Cialis) Ha Sido Aprobada';

        // Email 1: Admin notification (using CLIENT template which is proven to work)
        const adminEmail = emailjs.send(this.serviceId, this.clientTemplateId, {
            client_email: 'solangie@dradonis.com,maria@dradonis.com',
            client_subject: 'Tadalafil (Cialis) – Payment Initiated – ' + contact.contactName,
            client_message: adminMessage,
        }, this.publicKey);

        // Email 2: Client confirmation
        const clientEmail = emailjs.send(this.serviceId, this.clientTemplateId, {
            client_email: contact.contactEmail,
            client_subject: clientSubject,
            client_message: clientMessage,
        }, this.publicKey);

        // Fire-and-forget: the EmailJS notifications send in parallel while
        // we ask our backend for a Clover checkout URL. If they fail the
        // user already reached the checkout — we just log it.
        // Meta Pixel: NO e-commerce events here. Lead fires once in
        // Section 1; do NOT re-add Purchase / InitiateCheckout / AddToCart
        // / Lead — Meta flags this page as pharmaceutical sales otherwise.
        Promise.all([adminEmail, clientEmail])
            .catch((err) => console.error('Payment email send failed:', err));

        // Request a Hosted Checkout session from our Azure Function backend.
        // The function calls Clover's /invoicingcheckoutservice/v1/checkouts
        // server-side (the API token never leaves the server) and returns a
        // public checkout URL that works in every browser.
        try {
            const response = await fetch('/api/clover-create-checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contact: {
                        name: contact.contactName,
                        email: contact.contactEmail,
                        phone: contact.contactPhone,
                        address: contact.contactAddress,
                    },
                    lang: this.lang,
                }),
            });

            if (!response.ok) {
                throw new Error(`checkout_create_failed_${response.status}`);
            }
            const data = await response.json() as { href?: string };
            if (!data.href) {
                throw new Error('checkout_missing_href');
            }

            // Same-tab redirect — matches Stripe / PayPal / Square checkout
            // conventions and avoids the new-tab download-fallback issue on
            // Chrome iOS. The form behind is intentionally replaced because
            // the user is now in the payment flow.
            window.location.href = data.href;
        } catch (err) {
            console.error('Clover checkout creation failed:', err);
            this.ngZone.run(() => {
                this.isProcessingPayment = false;
                this.snackBar.open(this.t('paymentEmailError'), 'OK', { duration: 5000 });
            });
        }
    }

    /** Strip non-numeric characters from phone input */
    onPhoneInput(event: Event): void {
        const input = event.target as HTMLInputElement;
        input.value = input.value.replace(/[^0-9]/g, '');
        this.paymentContactForm.get('contactPhone')?.setValue(input.value, { emitEvent: false });
    }

    /** Whether the payment contact form is fully valid */
    get isPaymentContactValid(): boolean {
        return this.paymentContactForm.valid;
    }

    private validatePaymentContact(): boolean {
        this.paymentContactForm.markAllAsTouched();
        if (this.paymentContactForm.invalid) {
            this.snackBar.open(this.t('snackPaymentInvalid'), 'OK', { duration: 4000 });
            return false;
        }
        return true;
    }

}
