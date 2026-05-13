import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
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
        edQuestion: 'Do you currently experience difficulty achieving or maintaining adequate intimate performance?',
        // Questions
        q1: '1. Are you currently using any medications containing nitrates? (Examples: Nitroglycerin, Isosorbide, or recreational drugs known as "poppers")',
        q1Note: 'Note: Combined use can cause a life-threatening drop in blood pressure.',
        q2: '2. Have you experienced any cardiovascular events in the last 6 months? (Myocardial infarction, stroke, or serious arrhythmias)',
        q3: '3. Do you suffer from heart failure or unstable angina (chest pain)?',
        q4: '4. What is your usual blood pressure?',
        q4Opt1: 'It is controlled/Normal.',
        q4Opt2: 'I suffer from very low blood pressure (Hypotension).',
        q4Opt3: 'I suffer from uncontrolled hypertension (high blood pressure).',
        q5: '5. Do you have a history of vision loss due to optic neuropathy (NAION) or inherited retinal problems?',
        q6: '6. Do you have any physical deformities of the penis or Peyronie\'s disease?',
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
        qualifiedMsg: 'Your evaluation has been reviewed by Dr. Adonis. Based on your responses, you have been approved to proceed with the purchase of Tadalafil (Cialis).',
        confirmLabel: 'I confirm that all the information provided is correct. I am aware that this data is the basis for determining my suitability for the use of Tadalafil and I assume responsibility for any omissions or inaccuracies therein.',
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
        edQuestion: '¿Experimenta actualmente dificultad para lograr o mantener un rendimiento íntimo adecuado?',
        q1: '1. ¿Utiliza actualmente medicamentos que contengan nitratos? (Ejemplos: Nitroglicerina, Isosorbida, o drogas recreativas conocidas como "poppers")',
        q1Note: 'Nota: El uso conjunto puede causar una caída de presión arterial potencialmente mortal.',
        q2: '2. ¿Ha sufrido algún evento cardiovascular en los últimos 6 meses? (Infarto al miocardio, accidente cerebrovascular/Ictus o arritmias graves)',
        q3: '3. ¿Padece de insuficiencia cardíaca o angina de pecho (dolor de pecho) inestable?',
        q4: '4. ¿Cómo se encuentra su presión arterial habitualmente?',
        q4Opt1: 'Está controlada / Normal.',
        q4Opt2: 'Sufro de presión muy baja (Hipotensión).',
        q4Opt3: 'Sufro de hipertensión (presión alta) no controlada.',
        q5: '5. ¿Tiene algún antecedente de pérdida de visión debido a neuropatía óptica (NAION) o problemas hereditarios de la retina?',
        q6: '6. ¿Padece alguna deformidad física en el pene o enfermedad de Peyronie?',
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
        qualifiedMsg: 'Su evaluación ha sido revisada por el Dr. Adonis. Según sus respuestas, ha sido aprobado para proceder con la compra de Tadalafil (Cialis).',
        confirmLabel: 'Confirmo que toda la información suministrada es correcta. Soy consciente de que estos datos son la base para determinar mi aptitud para el uso de Tadalafil y asumo la responsabilidad derivada de cualquier omisión o inexactitud en la misma.',
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
export class TadalafilEvaluationComponent implements OnInit {
    lang: 'en' | 'es' = 'en';
    isSubmitting = false;
    submitted = false;
    isReviewingEvaluation = false;
    confirmCheck = false;
    showMedicalSection = false; // Controls Section 1 → Section 2 transition

    contactInfoForm!: FormGroup;   // Section 1: Name + Email
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
    ) { }

    ngOnInit(): void {
        this.contactInfoForm = this.fb.group({
            contactFullName: ['', Validators.required],
            contactEmailAddress: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/)]],
        });

        this.personalInfoForm = this.fb.group({
            dateOfBirth: [null, Validators.required],
            sex: ['', Validators.required],
            edQuestion: ['', Validators.required],
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
            this.snackBar.open(this.t('snackSuccess'), 'OK', { duration: 5000 });
        }, 4800);
    }

    onPayPal(): void {
        if (!this.validatePaymentContact()) return;
        window.open('https://www.paypal.com', '_blank');
    }

    isProcessingPayment = false;

    onClover(): void {
        if (!this.validatePaymentContact()) return;

        this.isProcessingPayment = true;
        this.snackBar.open(this.t('processingPayment'), '', { duration: 10000 });

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
            ? `Dear ${contact.contactName},\n\nYour medical evaluation for Tadalafil (Cialis) has been reviewed and approved by Dr. Adonis. You are eligible for the use of this medication.\n\nOnce your payment is confirmed through Clover, we will contact you to coordinate the delivery of your prescription.\n\nPlease feel free to contact us at 305-204-7816 if you have any questions.\n\nBest regards,\nDr. Adonis Medical Team`
            : `Estimado/a ${contact.contactName},\n\nSu evaluación médica para Tadalafil (Cialis) ha sido revisada y aprobada por el Dr. Adonis. Usted es apto/a para el uso de este medicamento.\n\nUna vez que su pago sea confirmado a través de Clover, nos comunicaremos con usted para coordinar la entrega de su prescripción.\n\nPor favor, no dude en contactarnos al 305-204-7816 si tiene alguna pregunta.\n\nAtentamente,\nEquipo Médico Dr. Adonis`;

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

        Promise.all([adminEmail, clientEmail])
            .then(() => {
                this.ngZone.run(() => {
                    this.isProcessingPayment = false;
                    this.snackBar.open(this.t('paymentEmailSent'), 'OK', { duration: 4000 });
                    // Meta Pixel: track Lead event only.
                    // NOTE: Purchase event removed — Meta was flagging the page as
                    // pharmaceutical sales. Per client request only PageView + Lead
                    // are allowed. Do not re-add Purchase / InitiateCheckout /
                    // AddToCart / any other e-commerce events here.
                    const fbq = (window as any).fbq;
                    if (fbq) {
                        fbq('track', 'Lead');
                    }
                    // Small delay so the pixel events fire before Clover opens
                    setTimeout(() => {
                        window.open('https://link.clover.com/urlshortener/4wbzLj', '_blank');
                    }, 1000);
                });
            })
            .catch((err) => {
                this.ngZone.run(() => {
                    this.isProcessingPayment = false;
                    console.error('Payment email send failed:', err);
                    this.snackBar.open(this.t('paymentEmailError'), 'OK', { duration: 5000 });
                });
            });
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

    /** Section 1 → Section 2 transition: validate contact, load pixel, track Lead */
    onContactNext(): void {
        this.contactInfoForm.markAllAsTouched();
        if (this.contactInfoForm.invalid) {
            this.snackBar.open(this.t('snackInvalid'), 'OK', { duration: 4000 });
            return;
        }
        this.loadPixelAndTrackLead();
        // Pre-fill payment contact form with Section 1 data
        const name = this.contactInfoForm.get('contactFullName')?.value;
        const email = this.contactInfoForm.get('contactEmailAddress')?.value;
        this.paymentContactForm.patchValue({
            contactName: name,
            contactEmail: email,
        });
        this.showMedicalSection = true;
    }

    /** Fire Lead conversion event. Only loads Pixel script if not already present. */
    private loadPixelAndTrackLead(): void {
        const w = window as any;
        if (!w.fbq) {
            // First-time init: this route is excluded from the global Pixel,
            // so we load it dynamically on conversion.
            const n: any = (w.fbq = function () {
                n.callMethod
                    ? n.callMethod.apply(n, arguments)
                    : n.queue.push(arguments);
            });
            if (!w._fbq) w._fbq = n;
            n.push = n;
            n.loaded = true;
            n.version = '2.0';
            n.queue = [];
            const t = document.createElement('script');
            t.async = true;
            t.src = 'https://connect.facebook.net/en_US/fbevents.js';
            const s = document.getElementsByTagName('script')[0];
            s.parentNode?.insertBefore(t, s);
            w.fbq('init', '34862161576760674');
            w.fbq('track', 'PageView');
        }
        w.fbq('track', 'Lead');
    }
}
