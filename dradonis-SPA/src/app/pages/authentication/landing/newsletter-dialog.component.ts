import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-newsletter-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  template: `
    <div class="newsletter-dialog">
      <h2 mat-dialog-title>{{ 'newsletter.title' | translate }}</h2>
      
      <mat-dialog-content>
        <p class="subtitle">{{ 'newsletter.subtitle' | translate }}</p>
        
        <form [formGroup]="newsletterForm" class="newsletter-form">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>{{ 'newsletter.emailPlaceholder' | translate }}</mat-label>
            <input 
              matInput 
              type="email" 
              formControlName="email"
              [placeholder]="'newsletter.emailPlaceholder' | translate">
            <mat-error *ngIf="newsletterForm.get('email')?.hasError('required')">
              {{ 'newsletter.errorMessage' | translate }}
            </mat-error>
            <mat-error *ngIf="newsletterForm.get('email')?.hasError('email')">
              {{ 'newsletter.errorMessage' | translate }}
            </mat-error>
          </mat-form-field>

          <mat-checkbox formControlName="consent" class="consent-checkbox">
            {{ 'newsletter.consent' | translate }}
          </mat-checkbox>

          <div class="success-message" *ngIf="submitted">
            <mat-icon>check_circle</mat-icon>
            {{ 'newsletter.successMessage' | translate }}
          </div>
        </form>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button (click)="onCancel()">
          {{ 'newsletter.btnCancel' | translate }}
        </button>
        <button 
          mat-raised-button 
          color="primary" 
          (click)="onSubmit()"
          [disabled]="!newsletterForm.valid || submitted">
          {{ 'newsletter.btnSubmit' | translate }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .newsletter-dialog {
      min-width: 400px;
      max-width: 500px;
    }

    .subtitle {
      color: #6B7280;
      margin-bottom: 1.5rem;
      font-size: 14px;
    }

    .newsletter-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .full-width {
      width: 100%;
    }

    .consent-checkbox {
      font-size: 13px;
      line-height: 1.5;
      
      ::ng-deep .mat-checkbox-label {
        white-space: normal;
      }
    }

    .success-message {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #10B981;
      font-weight: 500;
      padding: 1rem;
      background: #ECFDF5;
      border-radius: 8px;
      margin-top: 1rem;

      mat-icon {
        color: #10B981;
      }
    }

    mat-dialog-actions {
      padding: 1rem 1.5rem;
      margin: 0;
    }

    @media (max-width: 600px) {
      .newsletter-dialog {
        min-width: 300px;
      }
    }
  `]
})
export class NewsletterDialogComponent {
  newsletterForm: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<NewsletterDialogComponent>
  ) {
    this.newsletterForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      consent: [false, Validators.requiredTrue]
    });
  }

  onSubmit() {
    if (this.newsletterForm.valid) {
      // TODO: Integrate with email service (Mailchimp, SendGrid, etc.)
      const emailData = this.newsletterForm.value;
      console.log('Newsletter subscription:', emailData);

      this.submitted = true;

      // Close dialog after 2 seconds
      setTimeout(() => {
        this.dialogRef.close(emailData);
      }, 2000);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
