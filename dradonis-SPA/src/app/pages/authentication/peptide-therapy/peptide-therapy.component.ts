import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { SeoService } from '../../../shared/seo/seo.service';

const I18N = 'peptideTherapyPage';

export interface PeptideItem {
  id: string;
  fdaStatus: 'approved' | 'unapproved';
  linkUrl?: string;
}

export interface ApproachStep {
  id: string;
  step: string;
  icon: string;
}

export interface ApproachPillar {
  id: string;
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

export interface FaqItem {
  id: string;
  isOpen?: boolean;
}

@Component({
  selector: 'app-peptide-therapy',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    TranslateModule
  ],
  templateUrl: './peptide-therapy.component.html',
  styleUrls: ['./peptide-therapy.component.scss']
})
export class PeptideTherapyComponent implements OnInit, OnDestroy {
  private langSub?: Subscription;
  currentLang = 'en';

  // Peptides catalog
  peptides: PeptideItem[] = [
    {
      id: 'p1',
      fdaStatus: 'approved',
      linkUrl: '/medical-weight-loss'
    },
    {
      id: 'p2',
      fdaStatus: 'unapproved'
    },
    {
      id: 'p3',
      fdaStatus: 'unapproved'
    },
    {
      id: 'p4',
      fdaStatus: 'unapproved'
    },
    {
      id: 'p5',
      fdaStatus: 'unapproved'
    }
  ];

  // Clinical Approach
  pillars: ApproachPillar[] = [
    { id: 'p1', icon: 'biotech' },
    { id: 'p2', icon: 'verified' },
    { id: 'p3', icon: 'science' },
    { id: 'p4', icon: 'lock' },
    { id: 'p5', icon: 'schedule' }
  ];

  // Candidacy Criteria
  candidatePoints: string[] = ['c1', 'c2', 'c3', 'c4', 'c5'];
  nonCandidatePoints: string[] = ['n1', 'n2', 'n3', 'n4', 'n5', 'n6', 'n7'];

  // Treatment Process Steps
  treatmentSteps: ApproachStep[] = [
    { id: 's1', step: '01', icon: 'calendar_today' },
    { id: 's2', step: '02', icon: 'biotech' },
    { id: 's3', step: '03', icon: 'medical_services' },
    { id: 's4', step: '04', icon: 'school' },
    { id: 's5', step: '05', icon: 'self_improvement' },
    { id: 's6', step: '06', icon: 'local_pharmacy' },
    { id: 's7', step: '07', icon: 'verified' }
  ];

  // Program inclusions
  included: IncludedItem[] = [
    { id: 'inc1', icon: 'person' },
    { id: 'inc2', icon: 'biotech' },
    { id: 'inc3', icon: 'medical_services' },
    { id: 'inc4', icon: 'self_improvement' },
    { id: 'inc5', icon: 'local_pharmacy' },
    { id: 'inc6', icon: 'schedule' },
    { id: 'inc7', icon: 'phone' },
    { id: 'inc8', icon: 'verified' }
  ];

  // Benefits
  benefits: BenefitCategory[] = [
    { id: 'b1', icon: 'biotech' },
    { id: 'b2', icon: 'monitor_weight' },
    { id: 'b3', icon: 'schedule' },
    { id: 'b4', icon: 'science' },
    { id: 'b5', icon: 'verified' },
    { id: 'b6', icon: 'auto_stories' },
    { id: 'b7', icon: 'self_improvement' },
    { id: 'b8', icon: 'workspace_premium' }
  ];

  // FAQs
  faqs: FaqItem[] = [
    { id: 'f1', isOpen: true },
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
    const url = `${origin}/peptide-therapy`;
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
        name: 'Peptide Therapy',
        medicineSystem: 'WesternConventional',
        relevantSpecialty: ['Functional Medicine', 'Anti-Aging Medicine', 'Regenerative Medicine']
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
      image: `${origin}/assets/images/peptidos-en.webp`,
      jsonLd: [medicalWebPageSchema, faqSchema]
    });
  }
}
