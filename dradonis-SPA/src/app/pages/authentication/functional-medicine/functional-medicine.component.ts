import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { SeoService } from '../../../shared/seo/seo.service';

/**
 * All copy for this page lives in assets/i18n/{en,es}.json under
 * `functionalMedicinePage`. The arrays below hold only ids and the
 * route each card links to; the template resolves the text through the
 * translate pipe, so the language switcher works.
 */
export interface ServiceAreaItem {
  /** Key suffix under functionalMedicinePage.areas.list, e.g. 'a1'. */
  id: string;
  /** Route for the card's Learn More link. Not translated. */
  linkUrl: string;
}

export interface FaqItem {
  id: string;
  isOpen?: boolean;
}

/** Base key for every string on this page. */
const I18N = 'functionalMedicinePage';

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

  /** Exposed so the template can build keys without repeating the prefix. */
  readonly i18n = I18N;

  /**
   * Child pages of functional medicine. Adding a new service page means
   * adding an entry here, its text under functionalMedicinePage.areas.list
   * in both language files, and a child route in authentication.routes.ts.
   */
  serviceAreas: ServiceAreaItem[] = [
    { id: 'a1', linkUrl: '/functional-medicine/gut-health' },
    { id: 'a2', linkUrl: '/functional-medicine/brain-health' },
    { id: 'a3', linkUrl: '/functional-medicine/autoimmune' },
    { id: 'a4', linkUrl: '/functional-medicine/hashimotos' },
    { id: 'a5', linkUrl: '/functional-medicine/thyroid' },
    { id: 'a6', linkUrl: '/functional-medicine/fibromyalgia' }
  ];

  // Frequently asked questions -> functionalMedicinePage.faq.list.*
  faqs: FaqItem[] = [
    { id: 'f1', isOpen: false },
    { id: 'f2', isOpen: false },
    { id: 'f3', isOpen: false },
    { id: 'f4', isOpen: false },
    { id: 'f5', isOpen: false },
    { id: 'f6', isOpen: false },
    { id: 'f7', isOpen: false }
  ];

  constructor(
    private translate: TranslateService,
    private dialog: MatDialog,
    private seo: SeoService
  ) {}

  ngOnInit(): void {
    this.currentLang = this.translate.currentLang || 'en';
    this.refreshSeo();

    this.langSub = this.translate.onLangChange.subscribe((event) => {
      this.currentLang = event.lang;
      this.refreshSeo();
    });
  }

  ngOnDestroy(): void {
    this.langSub?.unsubscribe();
    this.seo.reset();
  }

  toggleFaq(faq: FaqItem): void {
    faq.isOpen = !faq.isOpen;
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

  /**
   * Waits for the active language file to load before building the tags,
   * so the meta description and the hasPart child declarations contain
   * resolved text rather than raw translation keys.
   */
  private refreshSeo(): void {
    this.translate.get(`${I18N}.seo.title`).subscribe(() => this.applySeo());
  }

  private applySeo(): void {
    const origin = this.seo.origin;
    const url = `${origin}/functional-medicine`;
    const isEs = this.currentLang === 'es';

    const title = this.translate.instant(`${I18N}.seo.title`);
    const description = this.translate.instant(`${I18N}.seo.description`);

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
        name: this.translate.instant(`${I18N}.areas.list.${area.id}.name`),
        description: this.translate.instant(`${I18N}.areas.list.${area.id}.description`),
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

    const faqSchema: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: this.faqs.map((faq) => ({
        '@type': 'Question',
        name: this.translate.instant(`${I18N}.faq.list.${faq.id}.q`),
        acceptedAnswer: {
          '@type': 'Answer',
          text: this.translate.instant(`${I18N}.faq.list.${faq.id}.a`)
        }
      }))
    };

    this.seo.apply({
      title,
      description,
      url,
      lang: isEs ? 'es' : 'en',
      ogType: 'website',
      jsonLd: [medicalWebPageSchema, faqSchema]
    });
  }
}
