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
  prescriptionForm!: FormGroup;
  isSubmitting = false;
  submitted = false;

  // EmailJS configuration — replace with your real keys
  private serviceId = 'YOUR_SERVICE_ID';
  private templateId = 'YOUR_TEMPLATE_ID';
  private publicKey = 'YOUR_PUBLIC_KEY';

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
  ) {}

  ngOnInit(): void {
    this.prescriptionForm = this.fb.group({
      fullName: ['', Validators.required],
      sex: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      country: ['', Validators.required],
      state: [''],
      otherSymptoms: [''],
      otherAllergies: [''],
    });

    this.prescriptionForm.get('country')?.valueChanges.subscribe((country) => {
      const stateCtrl = this.prescriptionForm.get('state');
      if (country === 'United States') {
        stateCtrl?.setValidators([Validators.required]);
      } else {
        stateCtrl?.clearValidators();
        stateCtrl?.setValue('');
      }
      stateCtrl?.updateValueAndValidity();
    });
  }

  get isUS(): boolean {
    return this.prescriptionForm.get('country')?.value === 'United States';
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

  onSubmit(): void {
    if (this.prescriptionForm.invalid) {
      Object.values(this.prescriptionForm.controls).forEach((c) => c.markAsTouched());
      this.snackBar.open('Please fill in all required fields.', 'Close', {
        duration: 4000,
        panelClass: ['error-snackbar'],
      });
      return;
    }

    this.isSubmitting = true;
    const fd = this.prescriptionForm.value;

    const templateParams = {
      to_email: 'kevin@dradonis.com,solangie@dradonis.com',
      from_name: fd.fullName,
      from_email: fd.email,
      sex: fd.sex,
      country: fd.country,
      state: fd.state || 'N/A',
      symptoms: this.selectedSymptoms.join(', ') || 'None',
      other_symptoms: fd.otherSymptoms || 'None',
      allergies: this.selectedAllergies.join(', ') || 'None',
      other_allergies: fd.otherAllergies || 'None',
      reply_to: fd.email,
    };

    if (this.serviceId === 'YOUR_SERVICE_ID') {
      // Simulation mode
      console.log('EmailJS not configured. Payload:', templateParams);
      setTimeout(() => {
        this.ngZone.run(() => {
          this.isSubmitting = false;
          this.submitted = true;
          this.prescriptionForm.reset();
          this.selectedSymptoms = [];
          this.selectedAllergies = [];
          this.snackBar.open('✅ Form submitted successfully! (EmailJS not configured yet)', 'Close', {
            duration: 5000,
          });
        });
      }, 1000);
    } else {
      emailjs.send(this.serviceId, this.templateId, templateParams, this.publicKey)
        .then(() => {
          this.ngZone.run(() => {
            this.isSubmitting = false;
            this.submitted = true;
            this.prescriptionForm.reset();
            this.selectedSymptoms = [];
            this.selectedAllergies = [];
            this.snackBar.open('✅ Prescription request sent successfully!', 'Close', {
              duration: 5000,
            });
          });
        })
        .catch((err) => {
          this.ngZone.run(() => {
            this.isSubmitting = false;
            console.error('Email send failed:', err);
            this.snackBar.open('❌ Failed to send. Please try again.', 'Close', {
              duration: 5000,
            });
          });
        });
    }
  }
}
