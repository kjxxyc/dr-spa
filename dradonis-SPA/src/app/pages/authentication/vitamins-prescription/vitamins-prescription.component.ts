import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
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
import { MatStepper } from '@angular/material/stepper';
import emailjs from '@emailjs/browser';

// ---------- translations ----------
const TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    title: 'Vitamins Prescription',
    subtitle: 'Please fill out the information below and Dr. Adonis will email you a protocol and vitamin recommendations.',
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
    snackSuccessSim: '✅ Form submitted! (EmailJS not configured yet)',
    snackError: '❌ Failed to send. Please try again.',
    snackInvalid: 'Please fill in all required fields.',
    langToggle: 'Español',
  },
  es: {
    title: 'Prescripción de Vitaminas',
    subtitle: 'Complete la información a continuación y el Dr. Adonis le enviará un protocolo y recomendaciones de vitaminas.',
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
    snackSuccessSim: '✅ ¡Formulario enviado! (EmailJS no configurado aún)',
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
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './vitamins-prescription.component.html',
  styleUrls: ['./vitamins-prescription.component.scss'],
})
export class VitaminsPrescriptionComponent implements OnInit {
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

  countries: string[] = [
    'Argentina', 'Australia', 'Brazil', 'Canada', 'Chile',
    'Colombia', 'Costa Rica', 'Cuba', 'Dominican Republic',
    'Ecuador', 'El Salvador', 'France', 'Germany', 'Guatemala',
    'Honduras', 'Italy', 'Mexico', 'Nicaragua', 'Panama',
    'Peru', 'Puerto Rico', 'Spain', 'United Kingdom',
    'United States', 'Venezuela',
  ];

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

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private ngZone: NgZone,
  ) { }

  ngOnInit(): void {
    this.personalForm = this.fb.group({
      fullName: ['', Validators.required],
      sex: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
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
      sex: personal.sex,
      country: location.country,
      state: location.state || 'N/A',
      symptoms: this.selectedSymptoms.join(', ') || 'None',
      other_symptoms: symptoms.otherSymptoms || 'None',
      allergies: this.selectedAllergies.join(', ') || 'None',
      other_allergies: allergies.otherAllergies || 'None',
      reply_to: personal.email,
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
