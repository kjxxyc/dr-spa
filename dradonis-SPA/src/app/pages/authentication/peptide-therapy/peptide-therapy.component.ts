import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { SeoService } from '../../../shared/seo/seo.service';

export interface PeptideItem {
  name: string;
  category: string;
  fdaStatus: 'approved' | 'unapproved';
  fdaStatusLabel: string;
  description: string;
  indicationNote: string;
  linkText?: string;
  linkUrl?: string;
}

export interface ApproachStep {
  number: string;
  title: string;
  description: string;
  icon: string;
}

export interface BenefitCategory {
  title: string;
  description: string;
  icon: string;
}

export interface FaqItem {
  question: string;
  answer: string;
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

  // Peptides catalog per clinical documentation
  peptides: PeptideItem[] = [
    {
      name: 'Semaglutide & Tirzepatide',
      category: 'GLP-1 Receptor Agonists',
      fdaStatus: 'approved',
      fdaStatusLabel: 'FDA-Approved Product',
      description: 'GLP-1 receptor medications utilized in targeted medical weight management and metabolic care. These are the only peptides on this page that are FDA-approved products, supported by the largest body of clinical trial evidence.',
      indicationNote: 'Evaluated for chronic weight management and glycemic control in adults.',
      linkText: 'Learn about Medical Weight Loss',
      linkUrl: '/services'
    },
    {
      name: 'BPC-157',
      category: 'Synthetic Gastric Peptide',
      fdaStatus: 'unapproved',
      fdaStatusLabel: 'Compounded / Unapproved',
      description: 'A synthetic peptide derived from a protective protein found naturally in gastric juice. Extensively investigated in preclinical models for soft tissue, tendon, ligament, and gut mucosal healing.',
      indicationNote: 'The formal indication reviewed by the FDA was ulcerative colitis (narrower than general market claims).'
    },
    {
      name: 'TB-500',
      category: 'Thymosin Beta-4 Fragment',
      fdaStatus: 'unapproved',
      fdaStatusLabel: 'Compounded / Unapproved',
      description: 'A synthetic fragment of thymosin beta-4, an endogenous peptide involved in endothelial cell migration, actin regulation, and tissue repair. Frequently paired alongside BPC-157 in restorative protocols.',
      indicationNote: 'Formally reviewed by the FDA advisory panel in the context of wound healing.'
    },
    {
      name: 'CJC-1295',
      category: 'GHRH Analog',
      fdaStatus: 'unapproved',
      fdaStatusLabel: 'Compounded / Unapproved',
      description: 'A Growth Hormone Releasing Hormone analog. Rather than supplying exogenous growth hormone, it stimulates your pituitary gland to release endogenous growth hormone in a natural, pulsatile physiological pattern.',
      indicationNote: 'Supports natural pituitary secretion; position under continuing agency evaluation.'
    },
    {
      name: 'MOTS-c',
      category: 'Mitochondrial-Derived Peptide',
      fdaStatus: 'unapproved',
      fdaStatusLabel: 'Compounded / Unapproved',
      description: 'A mitochondrial-encoded signaling peptide that acts as an exercise mimetic, supporting cellular energy homeostasis, metabolic regulation, and glucose utilization.',
      indicationNote: 'Indications reviewed by the FDA advisory committee included obesity and osteoporosis.'
    }
  ];

  // Clinical Approach
  pillars = [
    {
      title: 'Testing Comes First',
      description: 'Peptides are never a blind starting point. If fatigue stems from thyroid dysfunction, insulin resistance, or low testosterone, a peptide is the wrong intervention. We test comprehensive hormones, thyroid, IGF-1, metabolic markers, and organ function before prescribing.',
      icon: 'biotech'
    },
    {
      title: 'Fix The Foundation First',
      description: 'Hormone deficiencies, thyroid dysregulation, nutrient depletion, sleep disruption, and metabolic imbalances get corrected before or alongside peptide therapy. Many patients resolve their symptoms at this stage alone.',
      icon: 'verified'
    },
    {
      title: 'Specific About Evidence',
      description: 'For any peptide discussed, you receive an honest account of proposed mechanisms, clinical evidence, regulatory status, and what remains unknown. We separate marketing hype from medical reality.',
      icon: 'science'
    },
    {
      title: 'No Public Dosing',
      description: 'Peptide protocols and dosages are strictly individualized, requiring direct physician direction and oversight. We never distribute generic dosing schedules publicly.',
      icon: 'lock'
    },
    {
      title: 'Continuous Monitoring',
      description: 'Follow-up laboratory panels every six months ensure optimal response, safety markers, and ongoing protocol refinement.',
      icon: 'schedule'
    }
  ];

  // Treatment Process Steps
  treatmentSteps: ApproachStep[] = [
    {
      number: '01',
      title: 'Initial Consultation',
      description: 'Direct review of your medical history, goals, symptoms, prior therapies, and an honest discussion of realistic outcomes.',
      icon: 'calendar_today'
    },
    {
      number: '02',
      title: 'Advanced Testing',
      description: 'Comprehensive diagnostic panel (hormones, full thyroid, IGF-1, metabolic & inflammatory markers). Completed in-office or at Quest/LabCorp.',
      icon: 'biotech'
    },
    {
      number: '03',
      title: 'Clinical Interpretation',
      description: 'Dr. Adonis analyzes your root-cause biomarkers to determine whether peptide therapy is genuinely indicated or if foundational correction comes first.',
      icon: 'medical_services'
    },
    {
      number: '04',
      title: 'Results Consultation',
      description: 'In-depth review of findings, building your foundational care plan, and presenting prescribed peptide options with full regulatory transparency.',
      icon: 'school'
    },
    {
      number: '05',
      title: 'Foundation First',
      description: 'Restoring hormone balance, metabolic function, sleep architecture, and key nutrients for optimal cellular responsiveness.',
      icon: 'self_improvement'
    },
    {
      number: '06',
      title: 'Targeted Protocol',
      description: 'Precise, physician-directed compounded peptide protocol with administration guidance, progress markers, and safety protocols.',
      icon: 'local_pharmacy'
    },
    {
      number: '07',
      title: '6-Month Lab Monitoring',
      description: 'Follow-up lab re-evaluations every six months to monitor safety markers and objectively assess therapeutic response.',
      icon: 'verified'
    }
  ];

  // Candidacy Criteria
  candidatePoints = [
    'Have completed comprehensive diagnostic testing and addressed foundational health',
    'Have a specific, plausible physiological goal that peptide therapy addresses',
    'Want an experienced physician determining appropriateness rather than buying online',
    'Expect a transparent, honest account of clinical evidence and regulatory status',
    'Are committed to mandatory 6-month safety and biomarker monitoring'
  ];

  nonCandidatePoints = [
    'Have not completed comprehensive baseline lab testing',
    'Have active malignancy or a recent cancer history (growth-signaling peptides are contraindicated)',
    'Are currently pregnant, breastfeeding, or actively attempting to conceive',
    'Have significant, unmanaged liver or kidney impairment',
    'Want peptides without medical supervision or follow-up bloodwork',
    'Are seeking speculative compounds read about online without clinical evaluation',
    'Expect unsupported anti-aging or miracle lifespan claims'
  ];

  // Benefits
  benefits: BenefitCategory[] = [
    { title: 'Recovery & Tissue Repair', description: 'Supporting musculoskeletal, tendon, and soft tissue healing after injury or surgery.', icon: 'biotech' },
    { title: 'Body Composition', description: 'Optimizing lean muscle preservation and fat distribution alongside metabolic correction.', icon: 'monitor_weight' },
    { title: 'Sleep Quality', description: 'Enhancing slow-wave sleep depth through natural growth hormone secretagogue signaling.', icon: 'schedule' },
    { title: 'Metabolic Function', description: 'Improving insulin sensitivity and metabolic efficiency with GLP-1 receptor pathways.', icon: 'science' },
    { title: 'Immune & Inflammatory Balance', description: 'Investigated for modulating healthy inflammatory response at the cellular level.', icon: 'verified' },
    { title: 'Cognitive & Cellular Energy', description: 'Supporting mitochondrial bioenergetics and focus through targeted signaling.', icon: 'auto_stories' },
    { title: 'Joint & Connective Comfort', description: 'Promoting localized collagen and soft tissue regeneration in stressed joints.', icon: 'self_improvement' },
    { title: 'Overall Vitality', description: 'Layered after foundational hormone and nutrient optimization for complete wellness.', icon: 'workspace_premium' }
  ];

  // FAQs
  faqs: FaqItem[] = [
    {
      question: 'Are peptides FDA approved?',
      answer: 'Semaglutide and tirzepatide are FDA-approved medications with extensive clinical trial data. BPC-157, TB-500, CJC-1295, and MOTS-c are not FDA-approved drugs. In July 2026, an FDA advisory committee voted to recommend three of them for pharmacy compounding eligibility, but that vote is non-binding and formal agency rulemaking remains pending. We review the precise regulatory status of every compound with you.',
      isOpen: true
    },
    {
      question: 'What does the July 2026 FDA advisory vote actually change?',
      answer: 'On its own, nothing immediately. An advisory committee recommendation is expert counsel to the FDA, not a finalized regulation. The agency must still formally accept the recommendation and complete administrative rulemaking before compounding pharmacies have clear statutory authority. We track this closely to ensure compliance.',
      isOpen: false
    },
    {
      question: 'Are peptides safe?',
      answer: 'Safety varies significantly depending on the specific peptide, dose, purity, and individual patient biology. Some peptides possess extensive human safety profiles, while others rely primarily on preclinical data. We discuss verified safety profiles, contraindications, and conduct required monitoring labs every 6 months.',
      isOpen: false
    },
    {
      question: 'Can I buy peptides online instead?',
      answer: 'Products sold online marked "for research purposes only" or "not for human consumption" are not manufactured under pharmaceutical CGMP standards. Contamination, endotoxins, degraded chains, and inaccurate dosing are widespread risks. We strongly advise against unmonitored online sourcing.',
      isOpen: false
    },
    {
      question: 'How are peptides administered?',
      answer: 'Most peptides are administered via subcutaneous micro-injections using an ultra-fine insulin needle, while others are available in oral or nasal formulations. Full step-by-step administration instructions and sterile supplies are provided at your visit. We do not publish dosing publicly.',
      isOpen: false
    },
    {
      question: 'Will peptides replace my hormone replacement therapy?',
      answer: 'No. Peptides and bioidentical hormones operate via different signaling mechanisms. Peptides generally work far more effectively once underlying hormone, thyroid, and nutrient levels are already balanced.',
      isOpen: false
    },
    {
      question: 'Are these considered performance enhancing drugs?',
      answer: 'Several growth hormone secretagogues and related peptides are prohibited by the World Anti-Doping Agency (WADA) and competitive athletic federations. If you participate in sanctioned competitive sports, please disclose this during your initial consultation.',
      isOpen: false
    },
    {
      question: 'How much do peptides help and how quickly do they work?',
      answer: 'Results vary based on the specific protocol, baseline health, and accompanying foundational corrections. Most patients report measurable improvements within 90 days when combined with nutrition, sleep, and hormone optimization.',
      isOpen: false
    },
    {
      question: 'Can peptide therapy be managed through telemedicine?',
      answer: 'Yes! Florida residents can complete their comprehensive consultations, results reviews, and ongoing check-ins via HIPAA-compliant telemedicine. Diagnostic lab testing is completed locally at any authorized Quest Diagnostics or LabCorp facility.',
      isOpen: false
    },
    {
      question: 'Do you accept insurance?',
      answer: 'Dr. Adonis is a cash-pay medical practice. We do not accept insurance, and superbills are not provided for peptide protocols. All diagnostic labs and physician consultations are included in your clear, upfront program pricing.',
      isOpen: false
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

  private applySeo(): void {
    const origin = this.seo.origin;
    const url = `${origin}/peptide-therapy`;
    const isEs = this.currentLang === 'es';

    const title = isEs
      ? 'Terapia con Péptidos en Miami | Protocolos Médicos Supervisados — Dr. Adonis Maiquez, MD'
      : 'Peptide Therapy Miami | Physician-Supervised Peptide Protocols — Dr. Adonis Maiquez, MD';

    const description = isEs
      ? 'Terapia de péptidos supervisada por médicos en Miami. Análisis primero, estado regulatorio claro y protocolos basados en sus análisis. Telemedicina en Florida.'
      : 'Physician-supervised peptide therapy in Miami. Testing first, clear discussion of regulatory status, and protocols built from your labs. Florida telehealth available.';

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
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
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
