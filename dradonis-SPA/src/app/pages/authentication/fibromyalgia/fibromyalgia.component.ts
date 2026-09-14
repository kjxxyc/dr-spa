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
 * `fibromyalgiaPage`. The arrays below hold only ids and presentation
 * details (icons, step numbers); the template resolves the text through
 * the translate pipe, so the language switcher works.
 */
export interface KeyedItem {
  /** Key suffix under the matching i18n list, e.g. 'd1'. */
  id: string;
  icon?: string;
  number?: string;
  /** Marks the card that links out to another service page. */
  link?: string;
}

export interface FaqItem {
  id: string;
  isOpen?: boolean;
}

/** Base key for every string on this page. */
const I18N = 'fibromyalgiaPage';

@Component({
  selector: 'app-fibromyalgia',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    TranslateModule
  ],
  templateUrl: './fibromyalgia.component.html',
  styleUrls: ['./fibromyalgia.component.scss']
})
export class FibromyalgiaComponent implements OnInit, OnDestroy {
  private langSub?: Subscription;
  currentLang = 'en';

  /** Exposed so the template can build keys without repeating the prefix. */
  readonly i18n = I18N;

  /**
   * Testable conditions that produce a fibromyalgia-like picture ->
   * fibromyalgiaPage.catalog.list.*
   *
   * d1 is hypothyroidism and carries the cross-link to the thyroid page.
   * The link is keyed off the id rather than the card's name, so it does
   * not depend on the display language.
   */
  mimics: KeyedItem[] = [
    { id: 'd1', link: '/functional-medicine/thyroid' },
    { id: 'd2' },
    { id: 'd3' },
    { id: 'd4' },
    { id: 'd5' },
    { id: 'd6' },
    { id: 'd7' },
    { id: 'd8' }
  ];

  // Our approach -> fibromyalgiaPage.approach.list.*
  pillars: KeyedItem[] = [
    { id: 'p1', icon: 'biotech' },
    { id: 'p2', icon: 'schedule' },
    { id: 'p3', icon: 'swap_horiz' },
    { id: 'p4', icon: 'favorite' }
  ];

  // Signs this could help you -> fibromyalgiaPage.signs.list.*
  signs: string[] = [
    's1', 's2', 's3', 's4', 's5', 's6', 's7',
    's8', 's9', 's10', 's11', 's12', 's13', 's14'
  ];

  // What's included in your care -> fibromyalgiaPage.included.list.*
  included: KeyedItem[] = [
    { id: 'i1', icon: 'person' },
    { id: 'i2', icon: 'biotech' },
    { id: 'i3', icon: 'schedule' },
    { id: 'i4', icon: 'medical_services' },
    { id: 'i5', icon: 'medication' },
    { id: 'i6', icon: 'monitor_weight' },
    { id: 'i7', icon: 'phone' },
    { id: 'i8', icon: 'verified' }
  ];

  // How treatment works — seven steps -> fibromyalgiaPage.steps.list.*
  treatmentSteps: KeyedItem[] = [
    { id: 's1', number: '1', icon: 'person' },
    { id: 's2', number: '2', icon: 'biotech' },
    { id: 's3', number: '3', icon: 'science' },
    { id: 's4', number: '4', icon: 'medical_information' },
    { id: 's5', number: '5', icon: 'medication' },
    { id: 's6', number: '6', icon: 'fitness_center' },
    { id: 's7', number: '7', icon: 'schedule' }
  ];

  // Benefits -> fibromyalgiaPage.benefits.list.*
  benefits: KeyedItem[] = [
    { id: 'b1', icon: 'self_improvement' },
    { id: 'b2', icon: 'schedule' },
    { id: 'b3', icon: 'fitness_center' },
    { id: 'b4', icon: 'science' },
    { id: 'b5', icon: 'health_and_safety' },
    { id: 'b6', icon: 'swap_horiz' },
    { id: 'b7', icon: 'favorite' },
    { id: 'b8', icon: 'medical_information' }
  ];

  // Who this is for -> fibromyalgiaPage.candidacy.fit / .unfit
  candidatePoints: string[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6'];
  nonCandidatePoints: string[] = ['n1', 'n2', 'n3', 'n4', 'n5', 'n6'];

  // Frequently asked questions -> fibromyalgiaPage.faq.list.*
  faqs: FaqItem[] = [
    { id: 'f1', isOpen: false },
    { id: 'f2', isOpen: false },
    { id: 'f3', isOpen: false },
    { id: 'f4', isOpen: false },
    { id: 'f5', isOpen: false },
    { id: 'f6', isOpen: false },
    { id: 'f7', isOpen: false },
    { id: 'f8', isOpen: false }
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
   * so the meta description and FAQ schema contain resolved text rather
   * than raw translation keys.
   */
  private refreshSeo(): void {
    this.translate.get(`${I18N}.seo.title`).subscribe(() => this.applySeo());
  }

  private applySeo(): void {
    const origin = this.seo.origin;
    const url = `${origin}/functional-medicine/fibromyalgia`;
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
        '@type': 'MedicalCondition',
        name: 'Fibromyalgia',
        relevantSpecialty: ['Functional Medicine', 'Rheumatology', 'Pain Medicine']
      },
      isPartOf: {
        '@type': 'MedicalWebPage',
        '@id': `${origin}/functional-medicine#webpage`,
        url: `${origin}/functional-medicine`,
        name: 'Functional Medicine'
      },
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
