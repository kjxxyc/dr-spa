import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { SeoService } from '../../../shared/seo/seo.service';

const I18N = 'hrtPage';

export interface TransitionItem {
  id: string;
  linkUrl?: string;
}

export interface ApproachPillar {
  id: string;
  icon: string;
}

export interface TreatmentStep {
  id: string;
  step: string;
  icon: string;
}

export interface BenefitCategory {
  id: string;
  icon: string;
}

export interface IncludedItem {
  id: string;
  icon: string;
}

export interface Testimonial {
  id: string;
}

export interface FaqItem {
  id: string;
  isOpen?: boolean;
}

@Component({
  selector: 'app-hrt',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    TranslateModule
  ],
  templateUrl: './hrt.component.html',
  styleUrls: ['./hrt.component.scss']
})
export class HrtComponent implements OnInit, OnDestroy {
  private langSub?: Subscription;
  currentLang = 'en';

  // The transitions HRT is used across -> hrtPage.transitions.list.*
  transitions: TransitionItem[] = [
    { id: 't1' },
    { id: 't2' },
    { id: 't3', linkUrl: '/testosterone-replacement-therapy' },
    { id: 't4' }
  ];

  // Our approach -> hrtPage.approach.pillars.*
  pillars: ApproachPillar[] = [
    { id: 'p1', icon: 'biotech' },
    { id: 'p2', icon: 'science' },
    { id: 'p3', icon: 'monitor_weight' },
    { id: 'p4', icon: 'person' }
  ];

  // Signs HRT could help you -> hrtPage.signs.womenList / .menList
  womenSigns: string[] = ['w1', 'w2', 'w3', 'w4', 'w5', 'w6', 'w7', 'w8', 'w9', 'w10'];
  menSigns: string[] = ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7'];

  // What's included in your care -> hrtPage.included.list.*
  included: IncludedItem[] = [
    { id: 'inc1', icon: 'person' },
    { id: 'inc2', icon: 'biotech' },
    { id: 'inc3', icon: 'medical_services' },
    { id: 'inc4', icon: 'medication' },
    { id: 'inc5', icon: 'restaurant' },
    { id: 'inc6', icon: 'schedule' },
    { id: 'inc7', icon: 'phone' },
    { id: 'inc8', icon: 'verified' }
  ];

  // How treatment works -> hrtPage.treatmentSteps.steps.*
  treatmentSteps: TreatmentStep[] = [
    { id: 's1', step: '1', icon: 'person' },
    { id: 's2', step: '2', icon: 'biotech' },
    { id: 's3', step: '3', icon: 'science' },
    { id: 's4', step: '4', icon: 'medical_information' },
    { id: 's5', step: '5', icon: 'medication' },
    { id: 's6', step: '6', icon: 'monitor_weight' },
    { id: 's7', step: '7', icon: 'schedule' }
  ];

  // Benefits of bioidentical hormone therapy -> hrtPage.benefits.list.*
  benefits: BenefitCategory[] = [
    { id: 'b1', icon: 'spa' },
    { id: 'b2', icon: 'schedule' },
    { id: 'b3', icon: 'monitor_weight' },
    { id: 'b4', icon: 'science' },
    { id: 'b5', icon: 'favorite' },
    { id: 'b6', icon: 'health_and_safety' },
    { id: 'b7', icon: 'self_improvement' },
    { id: 'b8', icon: 'medication' }
  ];

  // Who this is for -> hrtPage.candidacy.fitList / .unfitList
  candidatePoints: string[] = ['c1', 'c2', 'c3', 'c4', 'c5'];
  nonCandidatePoints: string[] = ['n1', 'n2', 'n3', 'n4', 'n5'];

  // What patients say -> hrtPage.testimonials.list.*
  testimonials: Testimonial[] = [
    { id: 't1' },
    { id: 't2' },
    { id: 't3' }
  ];

  // Frequently asked questions -> hrtPage.faq.list.*
  faqs: FaqItem[] = [
    { id: 'f1', isOpen: false },
    { id: 'f2', isOpen: false },
    { id: 'f3', isOpen: false },
    { id: 'f4', isOpen: false },
    { id: 'f5', isOpen: false },
    { id: 'f6', isOpen: false },
    { id: 'f7', isOpen: false },
    { id: 'f8', isOpen: false },
    { id: 'f9', isOpen: false },
    { id: 'f10', isOpen: false }
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
    const url = `${origin}/hormone-replacement-therapy`;
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
        name: 'Bioidentical Hormone Replacement Therapy',
        alternateName: 'HRT',
        medicineSystem: 'WesternConventional',
        relevantSpecialty: ['Functional Medicine', 'Endocrinology', 'Anti-Aging Medicine']
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
