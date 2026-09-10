import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { SeoService } from '../../../shared/seo/seo.service';

/** A child service page surfaced as a card on this hub page. */
export interface ServiceAreaItem {
  name: string;
  category: string;
  description: string;
  linkText: string;
  linkUrl: string;
}

@Component({
  selector: 'app-functional-medicine',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    TranslateModule
  ],
  templateUrl: './functional-medicine.component.html',
  styleUrls: ['./functional-medicine.component.scss']
})
export class FunctionalMedicineComponent implements OnInit, OnDestroy {
  private langSub?: Subscription;
  currentLang = 'en';

  /**
   * Child pages of functional medicine. Adding a new service page means
   * adding an entry here and a child route in authentication.routes.ts.
   */
  serviceAreas: ServiceAreaItem[] = [
    {
      name: 'Gut Health',
      category: 'Digestive & Microbiome Care',
      description: 'Comprehensive testing for dysbiosis, SIBO, intestinal permeability, and food sensitivity, with a sequenced protocol that repairs rather than suppresses. For bloating, reflux, irregularity, and the fatigue, skin, and brain fog that travel with them.',
      linkText: 'Learn More',
      linkUrl: '/functional-medicine/gut-health'
    },
    {
      name: 'Brain Health',
      category: 'Cognitive & Metabolic Care',
      description: 'Root-cause evaluation of brain fog, memory, and focus. We test the metabolic, vascular, hormonal, inflammatory, nutritional, and sleep drivers of cognition rather than attributing symptoms to age or stress.',
      linkText: 'Learn More',
      linkUrl: '/functional-medicine/brain-health'
    }
  ];

  constructor(
    private translate: TranslateService,
    private dialog: MatDialog,
    private seo: SeoService
  ) {}

  ngOnInit(): void {
    this.currentLang = this.translate.currentLang || 'en';
    this.applySeo();

    this.langSub = this.translate.onLangChange.subscribe((event) => {
      this.currentLang = event.lang;
      this.applySeo();
    });
  }

  ngOnDestroy(): void {
    this.langSub?.unsubscribe();
    this.seo.reset();
  }

  async openAppointment(): Promise<void> {
    const { AppointmentDialogComponent } = await import(
      '../../../shared/appointment-dialog/appointment-dialog.component'
    );
    this.dialog.open(AppointmentDialogComponent, {
      width: '600px',
      maxWidth: '95vw',
      autoFocus: false
    });
  }

  private applySeo(): void {
    const origin = this.seo.origin;
    const url = `${origin}/functional-medicine`;
    const isEs = this.currentLang === 'es';

    const title = isEs
      ? 'Medicina Funcional en Miami | Atención de Causa Raíz — Dr. Adonis Maiquez, MD'
      : 'Functional Medicine Miami | Root-Cause Medical Care — Dr. Adonis Maiquez, MD';

    const description = isEs
      ? 'Medicina funcional en Miami con el Dr. Adonis Maiquez. Pruebas completas para identificar la causa de sus síntomas, con programas de salud intestinal y salud cerebral. Telemedicina en Florida.'
      : 'Functional medicine in Miami with Dr. Adonis Maiquez. Comprehensive testing to find the cause of your symptoms, with gut health and brain health programs. Florida telehealth.';

    // No FAQPage schema here: this page has no visible FAQ section, and
    // Google requires FAQ markup to match content present on the page.
    const medicalWebPageSchema: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'MedicalWebPage',
      '@id': `${url}#webpage`,
      url,
      name: title,
      description,
      inLanguage: isEs ? 'es' : 'en',
      about: {
        '@type': 'MedicalSpecialty',
        name: 'Functional Medicine'
      },
      // Declares the child pages beneath this hub.
      hasPart: this.serviceAreas.map((area) => ({
        '@type': 'MedicalWebPage',
        name: area.name,
        description: area.description,
        url: `${origin}${area.linkUrl}`
      })),
      author: {
        '@type': 'Physician',
        name: 'Dr. Adonis Maiquez, MD',
        url: `${origin}/meet-doctor`,
        telephone: '+1-305-290-4691',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Miami',
          addressRegion: 'FL',
          addressCountry: 'US'
        }
      }
    };

    this.seo.apply({
      title,
      description,
      url,
      lang: isEs ? 'es' : 'en',
      ogType: 'website',
      jsonLd: medicalWebPageSchema
    });
  }
}
