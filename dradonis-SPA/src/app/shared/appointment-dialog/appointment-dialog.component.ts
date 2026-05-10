import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import emailjs from '@emailjs/browser';

@Component({
  selector: 'app-appointment-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './appointment-dialog.component.html',
  styleUrls: ['./appointment-dialog.component.scss']
})
export class AppointmentDialogComponent implements OnInit {
  appointmentForm!: FormGroup;
  isSubmitting = false;

  private serviceId = 'service_ldtmz6n';
  private templateId = 'template_lgv92j9';
  private publicKey = 'vsVqtrledUCs4qrDT';
  // "pones el que va a quedar en producción que sería el de: aymee@dradonis.com"
  private targetEmail = 'aymee@dradonis.com';

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<AppointmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.appointmentForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/)]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{7,15}$/)]],
      reason: ['', Validators.required],
    });
  }

  onPhoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
    this.appointmentForm.get('phone')?.setValue(input.value, { emitEvent: false });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onSubmit(): void {
    if (this.appointmentForm.invalid) {
      this.appointmentForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formValue = this.appointmentForm.value;

    const message = `Full Name:\t${formValue.fullName}\nEmail:\t${formValue.email}\nPhone Number:\t${formValue.phone}\nReason for Appointment: ${formValue.reason}`;

    emailjs.send(this.serviceId, this.templateId, {
      client_email: this.targetEmail,
      client_subject: 'GENERAL APPOINTMENT',
      client_message: message,
    }, this.publicKey)
      .then(() => {
        this.isSubmitting = false;
        this.snackBar.open(this.translate.instant('appointmentModal.success'), 'OK', { duration: 5000 });
        this.dialogRef.close(true);
      })
      .catch((err) => {
        this.isSubmitting = false;
        console.error('Email send failed:', err);
        this.snackBar.open(this.translate.instant('appointmentModal.error'), 'OK', { duration: 5000 });
      });
  }
}
