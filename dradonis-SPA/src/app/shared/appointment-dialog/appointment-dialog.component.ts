import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-appointment-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    TranslateModule
  ],
  templateUrl: './appointment-dialog.component.html',
  styleUrls: ['./appointment-dialog.component.scss']
})
export class AppointmentDialogComponent implements OnInit {
  private sanitizer = inject(DomSanitizer);
  private platformId = inject(PLATFORM_ID);
  public dialogRef = inject(MatDialogRef<AppointmentDialogComponent>);

  formUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
    'https://brand.dradonis.com/widget/form/ISdbjfvFOOPm2YQArfiL'
  );

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (typeof window !== 'undefined') {
        const existingScript = document.getElementById('ghl-form-embed-script');
        if (!existingScript) {
          const script = document.createElement('script');
          script.id = 'ghl-form-embed-script';
          script.src = 'https://brand.dradonis.com/js/form_embed.js';
          script.async = true;
          document.body.appendChild(script);
        }
      }
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
