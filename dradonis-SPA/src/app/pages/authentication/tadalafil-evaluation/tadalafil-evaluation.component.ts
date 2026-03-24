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
import { MaterialModule } from '../../../material.module';
import emailjs from '@emailjs/browser';

// ---------- translations ----------
const TRANSLATIONS: Record<string, Record<string, string>> = {
    en: {
        title: 'Tadalafil Medical Evaluation',
        subtitle: 'Please answer the following questions so we can determine if you are a candidate for Tadalafil (Cialis).',
        fieldsRequired: 'All questions are required',
        // Step labels
        stepQuestions1: 'Medical History (1–4)',
        stepQuestions2: 'Medical History (5–8)',
        stepReview: 'Review & Submit',
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
        disqualifiedTitle: 'Not Eligible for Direct Purchase',
        disqualifiedMsg: 'We\'re sorry, for medical safety reasons, you are not a candidate for direct purchase. We recommend scheduling a teleconsultation or in-person consultation with Dr. Adonis.',
        // Review
        reviewTitle: 'Review your answers',
        viewAnswers: 'View my answers',
        qualifiedTitle: 'You are eligible!',
        qualifiedMsg: 'Based on your answers, you can proceed to purchase Tadalafil (Cialis).',
        confirmLabel: 'I confirm that all the information provided is correct. I am aware that this data is the basis for determining my suitability for the use of Tadalafil and I assume responsibility for any omissions or inaccuracies therein.',
        // Buttons
        next: 'Next',
        back: 'Back',
        submit: 'Submit Evaluation',
        sending: 'Sending...',
        // Messages
        successTitle: 'Evaluation Submitted Successfully!',
        successMsg: 'Dr. Adonis will review your evaluation and contact you shortly.',
        paymentTitle: 'Proceed to Payment',
        payWithPaypal: 'Pay with PayPal',
        payWithClover: 'Pay with CLOVER',
        snackSuccess: '✅ Evaluation submitted successfully!',
        snackSuccessSim: '✅ Evaluation submitted! (EmailJS not configured yet)',
        snackError: '❌ Failed to send. Please try again.',
        snackInvalid: 'Please answer all required questions.',
        langToggle: 'Español',
    },
    es: {
        title: 'Evaluación Médica de Tadalafil',
        subtitle: 'Por favor responda las siguientes preguntas para determinar si usted es candidato para Tadalafil (Cialis).',
        fieldsRequired: 'Todas las preguntas son obligatorias',
        stepQuestions1: 'Historial Médico (1–4)',
        stepQuestions2: 'Historial Médico (5–8)',
        stepReview: 'Revisar y Enviar',
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
        disqualifiedTitle: 'No Elegible para Compra Directa',
        disqualifiedMsg: 'Lo sentimos, por razones de seguridad médica, usted no es candidato para la compra directa. Le recomendamos agendar una teleconsulta o consulta presencial con el Dr. Adonis.',
        reviewTitle: 'Revise sus respuestas',
        viewAnswers: 'Ver mis respuestas',
        qualifiedTitle: '¡Usted es elegible!',
        qualifiedMsg: 'Según sus respuestas, puede proceder a la compra de Tadalafil (Cialis).',
        confirmLabel: 'Confirmo que toda la información suministrada es correcta. Soy consciente de que estos datos son la base para determinar mi aptitud para el uso de Tadalafil y asumo la responsabilidad derivada de cualquier omisión o inexactitud en la misma.',
        next: 'Siguiente',
        back: 'Atrás',
        submit: 'Enviar Evaluación',
        sending: 'Enviando...',
        successTitle: '¡Evaluación Enviada Exitosamente!',
        successMsg: 'El Dr. Adonis revisará su evaluación y se comunicará con usted pronto.',
        paymentTitle: 'Proceder al Pago',
        payWithPaypal: 'Pagar con PayPal',
        payWithClover: 'Pagar con CLOVER',
        snackSuccess: '✅ ¡Evaluación enviada exitosamente!',
        snackSuccessSim: '✅ ¡Evaluación enviada! (EmailJS no configurado aún)',
        snackError: '❌ Error al enviar. Intente de nuevo.',
        snackInvalid: 'Por favor responda todas las preguntas obligatorias.',
        langToggle: 'English',
    },
};

@Component({
    selector: 'app-tadalafil-evaluation',
    standalone: true,
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    templateUrl: './tadalafil-evaluation.component.html',
})
export class TadalafilEvaluationComponent implements OnInit {
    lang: 'en' | 'es' = 'en';
    isSubmitting = false;
    submitted = false;
    confirmCheck = false;

    questionsForm1!: FormGroup;
    questionsForm2!: FormGroup;

    // EmailJS
    private serviceId = 'YOUR_SERVICE_ID';
    private templateId = 'YOUR_TEMPLATE_ID';
    private publicKey = 'YOUR_PUBLIC_KEY';

    constructor(
        private fb: FormBuilder,
        private snackBar: MatSnackBar,
        private ngZone: NgZone,
    ) { }

    ngOnInit(): void {
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
    }

    /** Translation helper */
    t(key: string): string {
        return TRANSLATIONS[this.lang]?.[key] ?? key;
    }

    get bannerImage(): string {
        return this.lang === 'en'
            ? '/assets/images/tadalafil-head-en.png'
            : '/assets/images/tadalafil-head-es.png';
    }

    get flagIcon(): string {
        return this.lang === 'en'
            ? '/assets/images/flag/icon-flag-en.svg'
            : '/assets/images/flag/icon-flag-es.svg';
    }

    get otherFlagIcon(): string {
        return this.lang === 'en'
            ? '/assets/images/flag/icon-flag-es.svg'
            : '/assets/images/flag/icon-flag-en.svg';
    }

    toggleLanguage(): void {
        this.lang = this.lang === 'en' ? 'es' : 'en';
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

    /** Helper to get translated answer */
    answerLabel(value: string, questionKey?: string): string {
        if (!value) return '—';
        if (questionKey === 'q4') {
            if (value === 'opt1') return this.t('q4Opt1');
            if (value === 'opt2') return this.t('q4Opt2');
            if (value === 'opt3') return this.t('q4Opt3');
        }
        return value === 'yes' ? this.t('yes') : this.t('no');
    }

    onSubmit(): void {
        this.questionsForm1.markAllAsTouched();
        this.questionsForm2.markAllAsTouched();

        if (this.questionsForm1.invalid || this.questionsForm2.invalid) {
            this.snackBar.open(this.t('snackInvalid'), 'OK', { duration: 4000 });
            return;
        }

        this.isSubmitting = true;

        const answers = {
            ...this.questionsForm1.value,
            ...this.questionsForm2.value,
        };

        const templateParams = {
            to_email: 'kevin@dradonis.com,solangie@dradonis.com',
            form_type: 'Tadalafil (Cialis) Evaluation',
            q1_nitrates: this.answerLabel(answers.q1),
            q2_cardiovascular: this.answerLabel(answers.q2),
            q3_heart_failure: this.answerLabel(answers.q3),
            q4_blood_pressure: this.answerLabel(answers.q4, 'q4'),
            q5_vision_loss: this.answerLabel(answers.q5),
            q6_peyronie: this.answerLabel(answers.q6),
            q7_kidney_liver: this.answerLabel(answers.q7),
            q8_other_meds: this.answerLabel(answers.q8),
            is_disqualified: this.isDisqualified ? 'YES — Not eligible' : 'NO — Eligible',
            language: this.lang === 'en' ? 'English' : 'Spanish',
        };

        if (this.serviceId === 'YOUR_SERVICE_ID') {
            console.log('EmailJS not configured. Payload:', templateParams);
            setTimeout(() => {
                this.ngZone.run(() => {
                    this.isSubmitting = false;
                    this.submitted = true;
                    this.snackBar.open(this.t('snackSuccessSim'), 'OK', { duration: 5000 });
                });
            }, 1000);
        } else {
            emailjs.send(this.serviceId, this.templateId, templateParams, this.publicKey)
                .then(() => {
                    this.ngZone.run(() => {
                        this.isSubmitting = false;
                        this.submitted = true;
                        this.snackBar.open(this.t('snackSuccess'), 'OK', { duration: 5000 });
                    });
                })
                .catch((err) => {
                    this.ngZone.run(() => {
                        this.isSubmitting = false;
                        console.error('Email send failed:', err);
                        this.snackBar.open(this.t('snackError'), 'OK', { duration: 5000 });
                    });
                });
        }
    }

    onPayPal(): void {
        // TODO: Redirect to PayPal payment link
        console.log('Redirecting to PayPal...');
        window.open('https://www.paypal.com', '_blank');
    }

    onClover(): void {
        // TODO: Redirect to Clover payment link
        console.log('Redirecting to Clover...');
        window.open('https://link.clover.com/urlshortener/4wbzLj', '_blank');
    }
}
