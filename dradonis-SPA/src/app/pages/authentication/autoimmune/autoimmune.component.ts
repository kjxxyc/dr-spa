import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { SeoService } from '../../../shared/seo/seo.service';

export interface ComponentItem {
  name: string;
  category: string;
  description: string;
}

export interface ApproachPillar {
  title: string;
  description: string;
  icon: string;
}

export interface TreatmentStep {
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

export interface IncludedItem {
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
  selector: 'app-autoimmune',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    TranslateModule
  ],
  templateUrl: './autoimmune.component.html',
  styleUrls: ['./autoimmune.component.scss']
})
export class AutoimmuneComponent implements OnInit, OnDestroy {
  private langSub?: Subscription;
  currentLang = 'en';

  // The three components the research consistently describes
  components: ComponentItem[] = [
    {
      name: 'Genetic Susceptibility',
      category: 'Loads The Gun',
      description: 'Your inherited risk determines which tissue is vulnerable and how readily tolerance is lost. This is the one component of the three that cannot be changed, which is precisely why the other two matter so much.'
    },
    {
      name: 'An Environmental Trigger',
      category: 'Pulls It',
      description: 'Infection, toxin, chronic stress, or dietary antigen. Something set the immune activity in motion, and identifying it is the question conventional care most often sets aside in favor of suppressing the attack.'
    },
    {
      name: 'Increased Intestinal Permeability',
      category: 'A Common Feature',
      description: 'A loosened intestinal barrier appears across a wide range of autoimmune conditions. Proteins that should stay inside the gut reach the bloodstream and provoke immune responses, which is one proposed route to loss of tolerance.'
    }
  ];

  // Our approach
  pillars: ApproachPillar[] = [
    {
      title: 'We Treat The Immune System, Not Only The Target Organ',
      description: 'Your rheumatologist manages your joints. Your gastroenterologist manages your gut. Someone should be looking at why your immune system is doing this in the first place, and coordinating across all of it.',
      icon: 'health_and_safety'
    },
    {
      title: 'We Investigate Triggers',
      description: 'Chronic or reactivated viral infections, bacterial overgrowth and dysbiosis, heavy metals and environmental toxins, food antigens, chronic stress and sustained cortisol elevation, nutrient deficiencies particularly vitamin D, and hormone imbalance. Which of these matter differs by patient, which is why the workup is broad.',
      icon: 'science'
    },
    {
      title: 'Gut Integrity Is Central',
      description: 'The majority of your immune tissue sits in the intestinal lining. When that barrier becomes permeable, proteins that should stay inside the gut reach the bloodstream and provoke immune responses. Gut repair is a component of nearly every protocol we build here.',
      icon: 'restaurant'
    },
    {
      title: 'We Work Alongside Your Specialists',
      description: 'This is not a replacement for rheumatology, gastroenterology, or neurology, and we do not ask you to stop prescribed immunosuppressive therapy. Medication changes are made with the physician who prescribed them.',
      icon: 'medical_services'
    },
    {
      title: 'We Screen For What Is Coming',
      description: 'Given how autoimmune conditions cluster, we look for early markers of additional autoimmune activity rather than waiting for symptoms to declare it.',
      icon: 'biotech'
    }
  ];

  // Signs this could help you
  signs: string[] = [
    'An autoimmune diagnosis managed with medication and no investigation of cause',
    'Symptoms continuing despite treatment',
    'More than one autoimmune diagnosis',
    'Positive ANA or other autoimmune markers without a specific diagnosis',
    'Told you have “something autoimmune” that nobody has named',
    'Flares with no identifiable pattern',
    'Digestive symptoms alongside your primary condition',
    'Persistent fatigue that your specialist considers unrelated',
    'Joint pain, brain fog, or skin problems on top of your diagnosis',
    'Strong family history of autoimmune disease',
    'Symptoms that began after an infection, pregnancy, or major stress',
    'Wanting to reduce reliance on immunosuppressive medication over time',
    'Elevated inflammatory markers with no clear source'
  ];

  // What's included in your care
  included: IncludedItem[] = [
    {
      title: 'Initial Comprehensive Consultation',
      description: 'Extended visit covering your diagnosis and history, symptom timeline, what preceded onset, infections, stress, exposures, diet, digestion, and family history.',
      icon: 'person'
    },
    {
      title: 'Comprehensive Laboratory Testing',
      description: 'Autoimmune and antibody markers, inflammatory markers, complete thyroid function, hormones, vitamin D and nutrient status, food sensitivities, intestinal permeability, gut and microbiome assessment, chronic infection markers, and heavy metal and toxin screening.',
      icon: 'biotech'
    },
    {
      title: 'Results Consultation with Dr. Adonis',
      description: 'What the testing shows about your immune activity, which triggers appear to be operating, and the order in which we address them.',
      icon: 'medical_services'
    },
    {
      title: 'Your Treatment Protocol',
      description: 'Trigger removal, gut repair, immune modulation and anti-inflammatory support, targeted nutrient correction, hormone correction where relevant, and a nutrition plan built for your specific findings.',
      icon: 'medication'
    },
    {
      title: 'Coordination With Your Specialists',
      description: 'We work alongside your existing care rather than around it.',
      icon: 'swap_horiz'
    },
    {
      title: 'Follow-Up Lab Testing Every Six Months',
      description: 'Tracking inflammatory and autoimmune markers alongside symptoms.',
      icon: 'schedule'
    },
    {
      title: 'Direct Access To The Practice',
      description: 'Call or text the clinic at (305) 290-4691 at any time and message directly with our staff.',
      icon: 'phone'
    },
    {
      title: 'Labs And Consultations Included',
      description: 'This is a cash-pay practice. Superbills are not provided.',
      icon: 'verified'
    }
  ];

  // How treatment works
  treatmentSteps: TreatmentStep[] = [
    {
      number: '1',
      title: 'Consultation',
      description: 'Your diagnosis, your treatment, and what was happening in your life in the year or two before symptoms started. That period frequently contains the trigger.',
      icon: 'person'
    },
    {
      number: '2',
      title: 'Testing',
      description: 'Broad, because autoimmune triggers are varied and we cannot narrow the search before we look. Labs can be completed in our office, or locally at any Quest or LabCorp.',
      icon: 'biotech'
    },
    {
      number: '3',
      title: 'Interpretation',
      description: 'Dr. Adonis assesses immune activity, inflammatory load, and which of the likely triggers your testing supports.',
      icon: 'science'
    },
    {
      number: '4',
      title: 'Results Consultation',
      description: 'Findings explained, triggers identified, and a sequenced plan. Order matters in autoimmune care and we will tell you why we are starting where we are.',
      icon: 'medical_information'
    },
    {
      number: '5',
      title: 'Treatment Begins',
      description: 'Usually with gut repair and trigger removal, alongside anti-inflammatory nutrition and targeted supplementation.',
      icon: 'medication'
    },
    {
      number: '6',
      title: 'Follow-Up Testing Every Six Months',
      description: 'Inflammatory and autoimmune markers rechecked to confirm the direction of travel.',
      icon: 'schedule'
    }
  ];

  // Benefits of root-cause autoimmune care
  benefits: BenefitCategory[] = [
    {
      title: 'Reduced Inflammatory Markers',
      description: 'Objective evidence that immune activity is calming.',
      icon: 'monitor_weight'
    },
    {
      title: 'Fewer And Less Severe Flares',
      description: 'Frequently reported once triggers are identified and removed.',
      icon: 'health_and_safety'
    },
    {
      title: 'Fatigue Improvement',
      description: 'The symptom that affects daily life most and that specialists most often consider outside their remit.',
      icon: 'fitness_center'
    },
    {
      title: 'Digestive Improvement',
      description: 'Almost universal, since gut repair is part of nearly every protocol.',
      icon: 'restaurant'
    },
    {
      title: 'Joint Pain And Stiffness Reduction',
      description: 'As systemic inflammation falls.',
      icon: 'self_improvement'
    },
    {
      title: 'Cognitive Clarity',
      description: 'Autoimmune brain fog is real and frequently improves with inflammatory control.',
      icon: 'science'
    },
    {
      title: 'Better Response To Existing Medication',
      description: 'Reducing overall inflammatory load often improves how well your current treatment works.',
      icon: 'medication'
    },
    {
      title: 'A Possible Path To Lower Medication Needs',
      description: 'For some patients, over time, in coordination with the prescribing specialist. Never independently.',
      icon: 'spa'
    }
  ];

  // Who this is for
  candidatePoints: string[] = [
    'Have an autoimmune diagnosis and want the drivers investigated',
    'Have multiple autoimmune conditions',
    'Have positive markers without a definitive diagnosis',
    'Continue to have symptoms despite appropriate specialist treatment',
    'Want to work alongside your rheumatologist or gastroenterologist',
    'Are prepared to make substantial dietary and lifestyle changes'
  ];

  nonCandidatePoints: string[] = [
    'Are in an acute severe flare or organ crisis. That needs urgent specialist care first.',
    'Want to stop your prescribed immunosuppressive therapy. We do not advise that, and any change is made by your prescribing physician.',
    'Are looking for a cure. Autoimmune conditions are managed. Sometimes very well, but managed.',
    'Are unwilling to change your diet. In autoimmune care this is not a peripheral recommendation.',
    'Need biologic therapy management. That belongs with rheumatology, and we will coordinate rather than substitute.'
  ];

  // Frequently asked questions
  faqs: FaqItem[] = [
    {
      question: 'Can autoimmune disease be cured?',
      answer: 'No, and anyone telling you otherwise is overselling. Autoimmune conditions are chronic. What can change is disease activity, symptom burden, flare frequency, and quality of life, and for many patients those change considerably.',
      isOpen: false
    },
    {
      question: 'Do I stop seeing my rheumatologist?',
      answer: 'No. We work alongside your specialists, and we do not manage biologics or make changes to immunosuppressive therapy. Those decisions belong with the physician who prescribed them.',
      isOpen: false
    },
    {
      question: 'Why do you test my gut for a joint condition?',
      answer: 'Because most immune tissue is located in the intestinal lining, and increased intestinal permeability is repeatedly implicated across a range of autoimmune conditions. Where the symptoms appear and where the problem originates are frequently different places.',
      isOpen: false
    },
    {
      question: 'I have a positive ANA but no diagnosis. Can you help?',
      answer: 'This is a common and frustrating position. Autoimmune activity is present but has not organized into a nameable disease. It is arguably the best moment to intervene, and it is a group conventional care struggles to do anything for.',
      isOpen: false
    },
    {
      question: 'Will I be able to reduce my medication?',
      answer: 'Sometimes, over time, and only in coordination with your prescribing specialist. We never present this as an expected outcome, and we never advise stopping medication on your own.',
      isOpen: false
    },
    {
      question: 'How long does this take?',
      answer: 'Most patients report meaningful change within 90 days, but autoimmune care is measured in years. Markers move slowly and the work is ongoing.',
      isOpen: false
    },
    {
      question: 'Do you take insurance?',
      answer: 'No. This is a cash-pay practice and we do not provide superbills. Your labs and consultations are included in your program.',
      isOpen: false
    },
    {
      question: 'Can this be managed by telehealth?',
      answer: 'Yes, for patients located in Florida. Labs can be completed in our office, or locally at any Quest or LabCorp.',
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
    const url = `${origin}/functional-medicine/autoimmune`;
    const isEs = this.currentLang === 'es';

    const title = isEs
      ? 'Tratamiento de Enfermedades Autoinmunes en Miami | Atención de Causa Raíz — Dr. Adonis Maiquez, MD'
      : 'Autoimmune Disease Treatment Miami | Root-Cause Care — Dr. Adonis Maiquez, MD';

    const description = isEs
      ? 'Medicina funcional para enfermedades autoinmunes en Miami. Investigamos los desencadenantes que impulsan la actividad inmunitaria en lugar de solo suprimir los síntomas. Telemedicina en Florida.'
      : 'Functional medicine for autoimmune conditions in Miami. We investigate the triggers driving immune activity rather than only suppressing the symptoms. Florida telehealth available.';

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
        name: 'Autoimmune Disease',
        relevantSpecialty: ['Functional Medicine', 'Rheumatology', 'Immunology']
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
      jsonLd: [medicalWebPageSchema, faqSchema]
    });
  }
}
