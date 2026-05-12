import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

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
    MatSnackBarModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  template: `
    <div class="newsletter-dialog">
      <h2 mat-dialog-title>
        <span class="dialog-emoji" aria-hidden="true">📰</span>
        {{ 'newsletter.title' | translate }}
      </h2>
      
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
          [disabled]="!newsletterForm.valid || isSubmitting || submitted">
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

    .dialog-emoji {
      font-size: 1.4em;
      margin-right: 0.4rem;
      vertical-align: middle;
      line-height: 1;
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
  // MailChimp embedded form endpoint for the "Adonis Maiquez, MD" audience.
  // Extracted from the embedded form's <form action="..."> URL (Audience → Signup forms
  // → Embedded form). The `/post` path is swapped for `/post-json` to return JSONP.
  private readonly mailchimpUrl =
    'https://DrAdonis.us17.list-manage.com/subscribe/post-json?u=555536d54c3e113be047e52c3&id=4860348781';

  // Honeypot anti-bot field. MailChimp expects to receive this field empty
  // alongside EMAIL; if missing, the submission may be flagged as spam.
  // Name pattern: b_<u>_<id>
  private readonly mailchimpHoneypot = 'b_555536d54c3e113be047e52c3_4860348781';

  newsletterForm: FormGroup;
  submitted = false;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<NewsletterDialogComponent>,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {
    this.newsletterForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      consent: [false, Validators.requiredTrue]
    });
  }

  onSubmit() {
    if (!this.newsletterForm.valid || this.isSubmitting) return;
    this.isSubmitting = true;
    const email = this.newsletterForm.value.email;

    const params = new HttpParams()
      .set('EMAIL', email)
      .set(this.mailchimpHoneypot, '');
    const url = `${this.mailchimpUrl}&${params.toString()}`;

    this.http.jsonp<{ result: 'success' | 'error'; msg: string }>(url, 'c')
      .subscribe({
        next: (res) => {
          this.isSubmitting = false;
          if (res.result === 'success') {
            this.submitted = true;
            setTimeout(() => this.dialogRef.close({ email }), 2000);
          } else {
            const already = /already subscribed/i.test(res.msg);
            const key = already ? 'newsletter.alreadySubscribed' : 'newsletter.errorGeneric';
            this.snackBar.open(this.translate.instant(key), 'OK', { duration: 5000 });
          }
        },
        error: () => {
          this.isSubmitting = false;
          this.snackBar.open(this.translate.instant('newsletter.errorGeneric'), 'OK', { duration: 5000 });
        }
      });
  }

  onCancel() {
    this.dialogRef.close();
  }
}
