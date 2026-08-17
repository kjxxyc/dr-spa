import { Component, OnInit, OnDestroy, NgZone, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule, MatStepper } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { LanguageSelectorDialogComponent } from '../../../shared/language-selector-dialog/language-selector-dialog.component';
import { SeoService } from '../../../shared/seo/seo.service';
import emailjs from '@emailjs/browser';
import { SiteFooterComponent } from '../../../shared/site-footer/site-footer.component';

// ---------- translations ----------
const TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    title: 'Personalized Supplement Plan',
    subtitle: 'Please fill out the information below and Dr. Adonis will email you individualized nutritional and supplement recommendations based on your evaluation.',
    shippingNote: '(SHIPPING ONLY IN THE UNITED STATES)',
    fieldsRequired: 'Fields marked with * are required',
    // Step labels
    stepPersonal: 'Personal Information',
    stepLocation: 'Location',
    stepSymptoms: 'Symptoms',
    stepAllergies: 'Allergies',
    stepReview: 'Review & Submit',
    // Personal
    fullName: 'Full Name',
    fullNamePlaceholder: 'John Smith',
    fullNameRequired: 'Full Name is required.',
    sex: 'Sex',
    sexRequired: 'Sex is required.',
    female: 'Female',
    male: 'Male',
    email: 'Email',
    emailPlaceholder: 'mail@example.com',
    emailRequired: 'Email is required.',
    emailInvalid: 'Please enter a valid email.',
    phone: 'Phone Number',
    phonePlaceholder: '000 000 0000',
    phoneRequired: 'Phone is required.',
    phoneCode: 'Code',
    // Location
    country: 'Country',
    countryRequired: 'Country is required.',
    state: 'State',
    stateRequired: 'State is required for US residents.',
    // Symptoms & Allergies
    selectSymptoms: 'Select your symptoms',
    otherExplain: 'Other (explain)',
    selectAllergies: 'Select your allergies',
    // Review
    reviewTitle: 'Review your information',
    name: 'Name',
    symptoms: 'Symptoms',
    allergies: 'Allergies',
    otherSymptoms: 'Other symptoms',
    otherAllergies: 'Other allergies',
    none: 'None',
    // Buttons
    next: 'Next',
    back: 'Back',
    submit: 'Submit Request',
    sending: 'Sending...',
    // Messages
    successTitle: 'Request Submitted Successfully!',
    successMsg: 'Dr. Adonis will review your information and email you a protocol.',
    submitAnother: 'Submit Another Request',
    snackSuccess: '✅ Form submitted successfully!',

    snackError: '❌ Failed to send. Please try again.',
    snackInvalid: 'Please fill in all required fields.',
    langToggle: 'Español',
  },
  es: {
    title: 'Plan Personalizado de Suplementos',
    subtitle: 'Complete la información a continuación y el Dr. Adonis le enviará recomendaciones individualizadas de nutrición y suplementos según su evaluación.',
    shippingNote: '(ENVÍO SOLO EN ESTADOS UNIDOS)',
    fieldsRequired: 'Los campos marcados con * son obligatorios',
    stepPersonal: 'Información Personal',
    stepLocation: 'Ubicación',
    stepSymptoms: 'Síntomas',
    stepAllergies: 'Alergias',
    stepReview: 'Revisar y Enviar',
    fullName: 'Nombre Completo',
    fullNamePlaceholder: 'Juan Pérez',
    fullNameRequired: 'El nombre es obligatorio.',
    sex: 'Sexo',
    sexRequired: 'El sexo es obligatorio.',
    female: 'Femenino',
    male: 'Masculino',
    email: 'Correo Electrónico',
    emailPlaceholder: 'correo@ejemplo.com',
    emailRequired: 'El correo es obligatorio.',
    emailInvalid: 'Ingrese un correo válido.',
    phone: 'Número de Teléfono',
    phonePlaceholder: '000 000 0000',
    phoneRequired: 'El teléfono es obligatorio.',
    phoneCode: 'Cód.',
    country: 'País',
    countryRequired: 'El país es obligatorio.',
    state: 'Estado',
    stateRequired: 'El estado es obligatorio para residentes de EE.UU.',
    selectSymptoms: 'Seleccione sus síntomas',
    otherExplain: 'Otro (explique)',
    selectAllergies: 'Seleccione sus alergias',
    reviewTitle: 'Revise su información',
    name: 'Nombre',
    symptoms: 'Síntomas',
    allergies: 'Alergias',
    otherSymptoms: 'Otros síntomas',
    otherAllergies: 'Otras alergias',
    none: 'Ninguno',
    next: 'Siguiente',
    back: 'Atrás',
    submit: 'Enviar Solicitud',
    sending: 'Enviando...',
    successTitle: '¡Solicitud Enviada Exitosamente!',
    successMsg: 'El Dr. Adonis revisará su información y le enviará un protocolo.',
    submitAnother: 'Enviar Otra Solicitud',
    snackSuccess: '✅ ¡Formulario enviado exitosamente!',

    snackError: '❌ Error al enviar. Intente de nuevo.',
    snackInvalid: 'Complete todos los campos obligatorios.',
    langToggle: 'English',
  },
};

@Component({
  selector: 'app-vitamins-prescription',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatStepperModule,
    MatSelectModule,
    MatRadioModule,
    MatSnackBarModule,
    TranslateModule,
        SiteFooterComponent
    ],
  templateUrl: './vitamins-prescription.component.html',
  styleUrls: ['./vitamins-prescription.component.scss'],
})
export class VitaminsPrescriptionComponent implements OnInit, OnDestroy {
  @ViewChild('stepper') stepper!: MatStepper;
  lang: 'en' | 'es' = 'en';
  isSubmitting = false;
  submitted = false;

  personalForm!: FormGroup;
  locationForm!: FormGroup;
  symptomsForm!: FormGroup;
  allergiesForm!: FormGroup;

  // EmailJS
  private serviceId = 'service_ldtmz6n';
  private templateId = 'template_zbd3j1b';
  private publicKey = 'vsVqtrledUCs4qrDT';

  symptomsList: string[] = [
    'Fatigue / tiredness', 'Brain fog', 'Memory loss',
    'Lack of concentration', 'Pains', 'Arthritis',
    'Weight gain', 'Difficulty losing weight', 'Loss of muscle mass',
    'Constipation', 'Diarrhea', 'Gas',
    'Bloating', 'Low sex drive', 'Weak erections',
    'Weak orgasm', 'Anxiety', 'Depression',
    'Insomnia', 'Hot flashes', 'Night sweats',
    'Vaginal dryness', 'Allergies', 'Dementia',
    'Hypothyroidism', 'Hashimoto', 'Fibromyalgia',
    'Autoimmune', 'Diabetes', 'Hypertension',
  ];

  allergiesList: string[] = [
    'Penicillin', 'Other antibiotics', 'Iodine', 'Eggs',
    'Dairy', 'Almond', 'Soy', 'Wheat',
    'Nuts', 'Seafood', 'Fish', 'Sesame',
  ];

  countries: string[] = [];

  usStates: string[] = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
    'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
    'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
    'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
    'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
    'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
    'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
    'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
    'West Virginia', 'Wisconsin', 'Wyoming',
  ];

  selectedSymptoms: string[] = [];
  selectedAllergies: string[] = [];

  private seoLangSub?: Subscription;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private ngZone: NgZone,
    private http: HttpClient,
    private dialog: MatDialog,
    private seo: SeoService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) { }

  ngOnDestroy(): void {
    this.seoLangSub?.unsubscribe();
    this.seo.reset();
  }

  /**
   * Vitamins Prescription page SEO. Positions as a physician-prescribed
   * personalized vitamin protocol service (not online pharmacy).
   */
  private applySeo(): void {
    const url = this.seo.absoluteUrl('/vitamins-prescription');
    const lang: 'en' | 'es' = this.lang === 'es' ? 'es' : 'en';
    const isEs = lang === 'es';
    const config = isEs
      ? {
          title: 'Plan Personalizado de Suplementos | Dr. Adonis Miami',
          description: 'Recomendaciones individualizadas de nutrición y suplementos del Dr. Adonis Maiquez en Miami, según su historia clínica, sus objetivos de salud y su evaluación clínica.',
          keywords: 'plan de suplementos Miami, suplementos personalizados Miami, plan de vitaminas Dr. Adonis, evaluación nutricional Miami',
        }
      : {
          title: 'Personalized Supplement Plan | Dr. Adonis Miami',
          description: 'Individualized nutritional and supplement recommendations from Dr. Adonis Maiquez in Miami, based on your medical history, health goals, and clinical evaluation.',
          keywords: 'supplement plan Miami, personalized supplements Miami, Dr. Adonis vitamin plan, nutritional evaluation Miami',
        };

    this.seo.apply({
      ...config,
      url,
      lang,
      ogType: 'website',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'MedicalProcedure',
        '@id': `${url}#procedure`,
        name: isEs ? 'Plan Personalizado de Suplementos' : 'Personalized Supplement Plan',
        procedureType: 'TherapeuticProcedure',
        url,
        provider: { '@type': 'Physician', '@id': `${this.seo.origin}/#physician`, name: 'Dr. Adonis Maiquez, MD' },
      },
    });
  }

  ngOnInit(): void {
    // SEO: apply on mount (SSR-safe — no window access).
    this.applySeo();

    // Forms must initialize in both SSR and browser so the template can bind.
    this.personalForm = this.fb.group({
      fullName: ['', Validators.required],
      sex: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
    });

    this.locationForm = this.fb.group({
      country: ['United States', Validators.required],
      state: [''],
    });

    this.symptomsForm = this.fb.group({
      otherSymptoms: [''],
    });

    this.allergiesForm = this.fb.group({
      otherAllergies: [''],
    });

    // Browser-only: dialog open, external HTTP fetch, and form valueChanges
    // subscriptions. These don't need to run during SSR rendering.
    if (!isPlatformBrowser(this.platformId)) return;

    // Show language selector dialog on entry
    this.openLanguageDialog();

    this.http.get<any[]>('https://restcountries.com/v3.1/all?fields=name,idd').subscribe({
      next: (data) => {
        let allCountries = data
          .filter(c => c.name?.common)
          .map(c => c.name.common as string);

        // 1. Extraer Estados Unidos para forzarlo arriba
        const usIndex = allCountries.indexOf('United States');
        let us = null;
        if (usIndex > -1) {
          us = allCountries.splice(usIndex, 1)[0];
        }

        // 2. Ordenar alfabéticamente
        allCountries.sort((a, b) => a.localeCompare(b));

        // 3. Volver a meter Estados Unidos al principio del arreglo
        if (us) {
          allCountries.unshift(us);
        }

        this.countries = allCountries;
      },
      error: (err) => {
        console.error('Failed to load countries API', err);
      }
    });

    this.locationForm.get('country')?.valueChanges.subscribe((country) => {
      const stateCtrl = this.locationForm.get('state');
      if (country === 'United States') {
        stateCtrl?.setValidators([Validators.required]);
      } else {
        stateCtrl?.clearValidators();
        stateCtrl?.setValue('');
      }
      stateCtrl?.updateValueAndValidity();
    });
  }

  /** Translation helper */
  t(key: string): string {
    return TRANSLATIONS[this.lang]?.[key] ?? key;
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

  /** Open the language selector dialog (disableClose forces user to pick). */
  openLanguageDialog(): void {
    const dialogRef = this.dialog.open(LanguageSelectorDialogComponent, {
      disableClose: true,
      panelClass: 'language-selector-panel',
    });
    dialogRef.afterClosed().subscribe((lang: string) => {
      if (lang) {
        this.lang = lang as 'en' | 'es';
        // Refresh SEO with the new language's metadata.
        this.applySeo();
      }
    });
  }

  get isUS(): boolean {
    return this.locationForm.get('country')?.value === 'United States';
  }

  toggleSymptom(item: string): void {
    const idx = this.selectedSymptoms.indexOf(item);
    if (idx > -1) {
      this.selectedSymptoms.splice(idx, 1);
    } else {
      this.selectedSymptoms.push(item);
    }
  }

  toggleAllergy(item: string): void {
    const idx = this.selectedAllergies.indexOf(item);
    if (idx > -1) {
      this.selectedAllergies.splice(idx, 1);
    } else {
      this.selectedAllergies.push(item);
    }
  }

  isSymptomSelected(item: string): boolean {
    return this.selectedSymptoms.includes(item);
  }

  isAllergySelected(item: string): boolean {
    return this.selectedAllergies.includes(item);
  }

  get summarySymptoms(): string {
    return this.selectedSymptoms.length > 0
      ? this.selectedSymptoms.join(', ')
      : this.t('none');
  }

  get summaryAllergies(): string {
    return this.selectedAllergies.length > 0
      ? this.selectedAllergies.join(', ')
      : this.t('none');
  }

  allowOnlyNumbers(event: KeyboardEvent): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    // Allow only numeric characters (0-9)
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  onSubmit(): void {
    // Validate all required forms before submitting
    this.personalForm.markAllAsTouched();
    this.locationForm.markAllAsTouched();

    if (this.personalForm.invalid || this.locationForm.invalid) {
      this.snackBar.open(this.t('snackInvalid'), 'OK', { duration: 4000 });
      return;
    }

    this.isSubmitting = true;

    const personal = this.personalForm.value;
    const location = this.locationForm.value;
    const symptoms = this.symptomsForm.value;
    const allergies = this.allergiesForm.value;

    const templateParams = {
      to_email: 'kevin@dradonis.com,solangie@dradonis.com',
      from_name: personal.fullName,
      from_email: personal.email,
      phone: personal.phone,
      sex: personal.sex,
      country: location.country,
      state: location.state || 'N/A',
      symptoms: this.selectedSymptoms.join(', ') || 'None',
      other_symptoms: symptoms.otherSymptoms || 'None',
      allergies: this.selectedAllergies.join(', ') || 'None',
      other_allergies: allergies.otherAllergies || 'None',
      reply_to: personal.email,

      // --- Variables para el Auto-Responder (Correo al Cliente) ---
      client_email: personal.email,
      client_subject: this.lang === 'en' 
        ? 'Your Personalized Supplement Plan Request Has Been Received'
        : 'Su Solicitud de Receta de Vitaminas ha sido Recibida',
      client_message: this.lang === 'en'
        ? `Hi ${personal.fullName},\n\nThank you for submitting a personalized supplement plan request. You should be receiving a call from our office soon to complete the process.\n\nPlease feel free to contact us at 305-204-7816 if you have any questions.\n\nBest regards,\nDr. Adonis Clinic`
        : `Hola ${personal.fullName},\n\nGracias por enviar una solicitud de prescripción de vitaminas. Pronto recibirá una llamada de nuestra oficina para completar el proceso.\n\nPor favor, no dude en contactarnos al 305-204-7816 si tiene alguna pregunta.\n\nAtentamente,\nClínica Dr. Adonis`
    };

    if (this.serviceId === 'YOUR_SERVICE_ID') {

      setTimeout(() => {
        this.ngZone.run(() => {
          this.isSubmitting = false;
          this.submitted = true;
          this.snackBar.open(this.t('snackSuccess'), 'OK', { duration: 5000 });
          /*// Meta Pixel: track Lead event
          const fbq = (window as any).fbq;
          if (fbq) {
            fbq('track', 'Lead');
          }*/
        });
      }, 1000);
    } else {
      emailjs.send(this.serviceId, this.templateId, templateParams, this.publicKey)
        .then(() => {
          this.ngZone.run(() => {
            this.isSubmitting = false;
            this.submitted = true;
            this.snackBar.open(this.t('snackSuccess'), 'OK', { duration: 5000 });
            /*// Meta Pixel: track Lead event
            const fbq = (window as any).fbq;
            if (fbq) {
              fbq('track', 'Lead');
            }*/
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

  resetForm(): void {
    this.submitted = false;
    this.personalForm.reset();
    this.locationForm.reset();
    this.symptomsForm.reset();
    this.allergiesForm.reset();
    this.selectedSymptoms = [];
    this.selectedAllergies = [];
    if (this.stepper) {
      this.stepper.reset();
    }
  }
}
