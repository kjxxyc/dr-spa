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
 * `enclomiphenePage`. The arrays below hold only ids and presentation
 * details (icons, step numbers); the template resolves the text through
 * the translate pipe, so the language switcher works.
 */
export interface KeyedItem {
  /** Key suffix under the matching i18n list, e.g. 'o1'. */
  id: string;
  icon?: string;
  number?: string;
}

export interface FaqItem {
  id: string;
  isOpen?: boolean;
}

/** Base key for every string on this page. */
const I18N = 'enclomiphenePage';

@Component({
  selector: 'app-enclomiphene',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    TranslateModule
  ],
  templateUrl: './enclomiphene.component.html',
  styleUrls: ['./enclomiphene.component.scss']
})
export class EnclomipheneComponent implements OnInit, OnDestroy {
  private langSub?: Subscription;
  currentLang = 'en';

  /** Exposed so the template can build keys without repeating the prefix. */
  readonly i18n = I18N;

  // Two routes to raising testosterone -> enclomiphenePage.catalog.list.*
  options: KeyedItem[] = [{ id: 'o1' }, { id: 'o2' }];

  // Our approach -> enclomiphenePage.approach.list.*
  pillars: KeyedItem[] = [
    { id: 'p1', icon: 'biotech' },
    { id: 'p2', icon: 'swap_horiz' },
    { id: 'p3', icon: 'monitor_weight' },
    { id: 'p4', icon: 'science' }
  ];

  // Signs enclomiphene could be right for you -> enclomiphenePage.signs.list.*
  signs: string[] = ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8'];

  // What's included in your care -> enclomiphenePage.included.list.*
  included: KeyedItem[] = [
    { id: 'i1', icon: 'person' },
    { id: 'i2', icon: 'biotech' },
    { id: 'i3', icon: 'medical_services' },
    { id: 'i4', icon: 'medication' },
    { id: 'i5', icon: 'science' },
    { id: 'i6', icon: 'schedule' },
    { id: 'i7', icon: 'phone' },
    { id: 'i8', icon: 'verified' }
  ];

  // How treatment works — seven steps -> enclomiphenePage.steps.list.*
  treatmentSteps: KeyedItem[] = [
    { id: 's1', number: '1', icon: 'person' },
    { id: 's2', number: '2', icon: 'biotech' },
    { id: 's3', number: '3', icon: 'science' },
    { id: 's4', number: '4', icon: 'medical_information' },
    { id: 's5', number: '5', icon: 'medication' },
    { id: 's6', number: '6', icon: 'monitor_weight' },
    { id: 's7', number: '7', icon: 'schedule' }
  ];

  // Benefits -> enclomiphenePage.benefits.list.*
  benefits: KeyedItem[] = [
    { id: 'b1', icon: 'favorite' },
    { id: 'b2', icon: 'man' },
    { id: 'b3', icon: 'health_and_safety' },
    { id: 'b4', icon: 'medication' },
    { id: 'b5', icon: 'swap_horiz' },
    { id: 'b6', icon: 'fitness_center' },
    { id: 'b7', icon: 'self_improvement' }
  ];

  // Who this is for -> enclomiphenePage.candidacy.fit / .unfit
  candidatePoints: string[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6'];
  nonCandidatePoints: string[] = ['n1', 'n2', 'n3', 'n4', 'n5', 'n6'];

  // Frequently asked questions -> enclomiphenePage.faq.list.*
  faqs: FaqItem[] = [
    { id: 'f1', isOpen: false },
    { id: 'f2', isOpen: false },
    { id: 'f3', isOpen: false },
    { id: 'f4', isOpen: false },
    { id: 'f5', isOpen: false },
    { id: 'f6', isOpen: false },
    { id: 'f7', isOpen: false },
    { id: 'f8', isOpen: false },
    { id: 'f9', isOpen: false }
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
    const url = `${origin}/enclomiphene`;
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
        '@type': 'MedicalTherapy',
        name: 'Enclomiphene Therapy',
        medicineSystem: 'WesternConventional',
        relevantSpecialty: ['Functional Medicine', 'Endocrinology', 'Urology']
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
