import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { SeoService } from '../../../shared/seo/seo.service';

export interface MimicItem {
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

  /**
   * Distinct, testable conditions that produce a fibromyalgia-like
   * picture. Some patients carrying the diagnosis have one of these,
   * untreated, because a full panel was never run.
   */
  mimics: MimicItem[] = [
    {
      name: 'Hypothyroidism',
      category: 'Particularly Poor T4-to-T3 Conversion',
      description: 'Hypothyroid symptoms overlap heavily with fibromyalgia, and poor conversion does not appear on a TSH test. One of the most common findings we see in this population.'
    },
    {
      name: 'Vitamin D Deficiency',
      category: 'Nutrient Status',
      description: 'Common, correctable, and a recognized contributor to widespread musculoskeletal pain and fatigue.'
    },
    {
      name: 'B12 & Magnesium Deficiency',
      category: 'Nutrient Status',
      description: 'Both are required for neurological and muscular function, and deficiency produces pain, fatigue, and cognitive symptoms that mirror the fibromyalgia picture.'
    },
    {
      name: 'Iron Deficiency',
      category: 'Nutrient Status',
      description: 'Fatigue, poor exercise tolerance, restless legs, and cognitive difficulty. Ferritin is frequently not checked, or is read against a range too permissive to catch it.'
    },
    {
      name: 'Sleep Apnea',
      category: 'Sleep Disruption',
      description: 'Deep sleep is where muscle repair and pain modulation happen. Untreated apnea is a common and correctable finding here, and it holds the pain and fatigue loop in place.'
    },
    {
      name: 'Early Autoimmune Activity',
      category: 'Immune',
      description: 'Autoimmune conditions in their early stages produce widespread pain and fatigue well before they organize into a nameable diagnosis.'
    },
    {
      name: 'Chronic Or Reactivated Infection',
      category: 'Infectious',
      description: 'A persistent or reactivated infection maintains an inflammatory load that the nervous system continues to process.'
    },
    {
      name: 'Hormone Deficiency',
      category: 'Endocrine',
      description: 'Sex and adrenal hormone disruption affects pain sensitivity, sleep quality, energy, and recovery capacity.'
    }
  ];

  // Our approach
  pillars: ApproachPillar[] = [
    {
      title: 'We Take The Diagnosis Seriously And We Still Test Thoroughly',
      description: 'Those are not in conflict. A fibromyalgia diagnosis is not a reason to stop investigating, and a comprehensive workup is not a suggestion that you are imagining this.',
      icon: 'biotech'
    },
    {
      title: 'Sleep Gets Addressed First',
      description: 'Deep sleep is disrupted in most fibromyalgia patients, and it is where muscle repair and pain modulation happen. Poor sleep worsens pain, pain worsens sleep, and that loop tends to hold the whole picture in place. Untreated sleep apnea is a common and correctable finding here.',
      icon: 'schedule'
    },
    {
      title: 'We Treat The Whole Load',
      description: 'Pain amplification is driven up by inflammation, nutrient deficiency, poor sleep, hormonal disruption, and cellular energy failure. Reducing each of those lowers the total burden the nervous system is processing. There is rarely one lever.',
      icon: 'swap_horiz'
    },
    {
      title: 'We Do Not Tell You It Is In Your Head',
      description: 'We will say plainly that the nervous system is involved, because it is, and because central sensitization is a physiological process rather than a psychological verdict. Those are different statements and patients here have usually only heard the wrong one.',
      icon: 'favorite'
    }
  ];

  // Signs this could help you
  signs: string[] = [
    'Widespread pain lasting three months or longer',
    'Fatigue that rest does not resolve',
    'Waking unrefreshed regardless of hours slept',
    'Cognitive difficulty — the fog, the word-finding, the lost thread',
    'Morning stiffness',
    'Sensitivity to pressure, temperature, light, or sound',
    'Headaches or migraines',
    'Digestive symptoms alongside the pain',
    'Symptoms that started after an illness, injury, surgery, or major stress',
    'Told your labs are normal more than once',
    'Diagnosed with fibromyalgia and offered medication with no investigation',
    'Prescribed an antidepressant for pain with limited benefit',
    'Numbness, tingling, or restless legs',
    'Depression or anxiety that developed after the pain, not before it'
  ];

  // What's included in your care
  included: IncludedItem[] = [
    {
      title: 'Initial Comprehensive Consultation',
      description: 'Extended visit covering your full symptom history, when and how it began, what preceded it, sleep, prior workups, current treatment, and what has and has not helped.',
      icon: 'person'
    },
    {
      title: 'Comprehensive Laboratory Testing',
      description: 'Full thyroid function, autoimmune and inflammatory markers, vitamin D, B12, folate, magnesium, iron studies, cortisol patterns, sex hormones, chronic infection markers, and toxin or heavy metal exposure.',
      icon: 'biotech'
    },
    {
      title: 'Sleep Assessment',
      description: 'Screening for sleep apnea and other sleep disruption, with referral for a study where indicated.',
      icon: 'schedule'
    },
    {
      title: 'Results Consultation with Dr. Adonis',
      description: 'Everything found, everything ruled out, and what we believe is contributing to your pain and fatigue.',
      icon: 'medical_services'
    },
    {
      title: 'Your Treatment Protocol',
      description: 'Correction of every identified deficiency and dysfunction, sleep intervention, mitochondrial and cellular energy support, anti-inflammatory nutrition, hormone correction where indicated, and graded activity guidance appropriate to your current capacity.',
      icon: 'medication'
    },
    {
      title: 'Follow-Up Lab Testing Every Six Months',
      description: 'With the protocol adjusted as markers and symptoms change.',
      icon: 'monitor_weight'
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

  // How treatment works — seven steps
  treatmentSteps: TreatmentStep[] = [
    {
      number: '1',
      title: 'Consultation',
      description: 'Your whole history, without a clock running. Most fibromyalgia patients have never had a physician sit through the full account.',
      icon: 'person'
    },
    {
      number: '2',
      title: 'Testing',
      description: 'Comprehensive, specifically targeting the conditions that mimic or worsen fibromyalgia. Labs can be completed in our office, or locally at any Quest or LabCorp.',
      icon: 'biotech'
    },
    {
      number: '3',
      title: 'Interpretation',
      description: 'Dr. Adonis reviews everything and identifies which contributors are present.',
      icon: 'science'
    },
    {
      number: '4',
      title: 'Results Consultation',
      description: 'Findings explained. If something treatable has been missed, you will hear it here. If nothing conventional was missed, we explain what we are targeting and why.',
      icon: 'medical_information'
    },
    {
      number: '5',
      title: 'Treatment Begins',
      description: 'Usually sleep and the most significant deficiencies first, since those tend to produce the earliest change and improve tolerance for everything after.',
      icon: 'medication'
    },
    {
      number: '6',
      title: 'Gradual Expansion',
      description: 'Anti-inflammatory nutrition, cellular energy support, and carefully graded activity, added at a pace your current capacity allows.',
      icon: 'fitness_center'
    },
    {
      number: '7',
      title: 'Follow-Up Testing Every Six Months',
      description: 'Markers and symptoms reviewed together.',
      icon: 'schedule'
    }
  ];

  // Benefits of comprehensive fibromyalgia care
  benefits: BenefitCategory[] = [
    {
      title: 'Reduced Pain Levels',
      description: 'Often the most significant change when a deficiency or thyroid problem was contributing.',
      icon: 'self_improvement'
    },
    {
      title: 'Better Sleep Quality',
      description: 'Deeper, more restorative, less waking unrefreshed.',
      icon: 'schedule'
    },
    {
      title: 'More Usable Energy',
      description: 'Not unlimited energy. More capacity than you currently have.',
      icon: 'fitness_center'
    },
    {
      title: 'Cognitive Clarity',
      description: 'The fog is a major part of the burden and it frequently improves.',
      icon: 'science'
    },
    {
      title: 'Fewer Flares',
      description: 'Both frequency and severity, as inflammatory and nutrient status stabilize.',
      icon: 'health_and_safety'
    },
    {
      title: 'Improved Tolerance For Activity',
      description: 'Which then supports further improvement, reversing the direction of the loop.',
      icon: 'swap_horiz'
    },
    {
      title: 'Mood Improvement',
      description: 'Usually following the physical improvement rather than preceding it.',
      icon: 'favorite'
    },
    {
      title: 'A Treatable Finding, In Some Cases',
      description: 'Some patients discover an untreated thyroid problem, significant deficiency, or sleep apnea that changes the picture substantially.',
      icon: 'medical_information'
    }
  ];

  // Who this is for
  candidatePoints: string[] = [
    'Have a fibromyalgia diagnosis and have never had comprehensive testing',
    'Have widespread pain and fatigue with normal standard labs',
    'Have been offered medication without investigation',
    'Have sleep problems alongside the pain',
    'Suspect something has been missed',
    'Are prepared to work on sleep, nutrition, and graded activity over months'
  ];

  nonCandidatePoints: string[] = [
    'Have new or focal neurological symptoms. These need neurological evaluation.',
    'Have unexplained weight loss, fever, or night sweats. These require prompt workup for other causes.',
    'Have an active inflammatory arthritis requiring rheumatology management. We can work alongside it.',
    'Are looking for pain medication management. That is not what this is.',
    'Expect rapid resolution. Improvement here is gradual and requires sustained effort.',
    'Are unable to engage with sleep, nutrition, or activity changes right now'
  ];

  // Frequently asked questions
  faqs: FaqItem[] = [
    {
      question: 'Is fibromyalgia a real condition?',
      answer: 'Yes. It is a recognized diagnosis with consistent findings in pain processing, sleep architecture, and stress physiology. The difficulty is that standard testing does not detect it, and too many patients have had that absence of findings treated as evidence they are exaggerating.',
      isOpen: false
    },
    {
      question: 'Can fibromyalgia be cured?',
      answer: 'No, and we will not tell you otherwise. It can improve considerably, particularly when contributing factors are identified and corrected. Some patients improve enough that the diagnosis stops governing their life. That is the realistic goal.',
      isOpen: false
    },
    {
      question: 'My rheumatologist already diagnosed me. What would you add?',
      answer: 'A comprehensive workup for the conditions that mimic and worsen fibromyalgia — thyroid conversion problems, nutrient deficiencies, sleep apnea, early autoimmune activity, hormone deficiency. Rheumatology excludes inflammatory arthritis, which is important and is a narrower question than the one you are living with.',
      isOpen: false
    },
    {
      question: 'Could my thyroid be causing this?',
      answer: 'It is one of the most common findings we see in this population, particularly poor T4-to-T3 conversion, which does not appear on a TSH test. Hypothyroid symptoms overlap heavily with fibromyalgia.',
      isOpen: false
    },
    {
      question: 'Will I have to exercise?',
      answer: 'Graded movement is one of the better-supported interventions, and it has to be introduced carefully. Pushing too hard too early causes flares and sets people back. We build it in at a pace your current capacity allows.',
      isOpen: false
    },
    {
      question: 'How long before I feel better?',
      answer: 'Most patients report meaningful change within 90 days. Improvement tends to be gradual and cumulative rather than a single turning point.',
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
    const url = `${origin}/functional-medicine/fibromyalgia`;
    const isEs = this.currentLang === 'es';

    const title = isEs
      ? 'Tratamiento de Fibromialgia en Miami | Atención de Causa Raíz para el Dolor Crónico y la Fatiga — Dr. Adonis Maiquez, MD'
      : 'Fibromyalgia Treatment Miami | Root-Cause Care for Chronic Pain & Fatigue — Dr. Adonis Maiquez, MD';

    const description = isEs
      ? 'Medicina funcional para la fibromialgia en Miami. Pruebas completas de los factores tiroideos, nutricionales, inflamatorios y del sueño detrás del dolor generalizado y la fatiga. Telemedicina en Florida.'
      : 'Functional medicine for fibromyalgia in Miami. Comprehensive testing for the thyroid, nutrient, inflammatory, and sleep drivers behind widespread pain and fatigue. Florida telehealth.';

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
