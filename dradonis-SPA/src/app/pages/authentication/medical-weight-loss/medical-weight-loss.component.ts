import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { SeoService } from '../../../shared/seo/seo.service';

export interface DriverItem {
  name: string;
  category: string;
  description: string;
  linkText?: string;
  linkUrl?: string;
}

export interface MedicationItem {
  name: string;
  category: string;
  brands: string;
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
  selector: 'app-medical-weight-loss',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    TranslateModule
  ],
  templateUrl: './medical-weight-loss.component.html',
  styleUrls: ['./medical-weight-loss.component.scss']
})
export class MedicalWeightLossComponent implements OnInit, OnDestroy {
  private langSub?: Subscription;
  currentLang = 'en';

  // What is actually driving the resistance
  drivers: DriverItem[] = [
    {
      name: 'Insulin Resistance',
      category: 'Metabolic',
      description: 'Elevated insulin promotes fat storage and blocks fat release. Fasting glucose can look entirely normal while insulin runs high for years. Testing insulin, not just glucose, is what makes this visible.'
    },
    {
      name: 'Thyroid Dysfunction',
      category: 'Metabolic Rate',
      description: 'The thyroid sets your metabolic rate. Poor T4-to-T3 conversion produces weight resistance with a normal TSH, which is why so many patients are told their thyroid is fine.',
      linkText: 'See our Thyroid page',
      linkUrl: '/functional-medicine/thyroid'
    },
    {
      name: 'Hormone Decline',
      category: 'Endocrine',
      description: 'Falling estrogen, progesterone, or testosterone shifts fat distribution and reduces lean mass, which lowers the rate at which you burn anything.'
    },
    {
      name: 'Cortisol Dysregulation',
      category: 'Stress Physiology',
      description: 'Chronic stress physiology promotes central fat storage and drives appetite.'
    },
    {
      name: 'Inflammation',
      category: 'Immune Signaling',
      description: 'Systemic inflammation interferes with the signaling that regulates hunger and satiety.'
    },
    {
      name: 'Sleep Disruption',
      category: 'Recovery',
      description: 'Poor sleep raises ghrelin, lowers leptin, and worsens insulin sensitivity. Untreated sleep apnea makes sustained weight loss substantially harder.'
    },
    {
      name: 'Medication Effects',
      category: 'Prescription Contributors',
      description: 'Some antidepressants, steroids, beta blockers, and other prescriptions contribute directly.'
    }
  ];

  // The two GLP-1 medications we prescribe
  medications: MedicationItem[] = [
    {
      name: 'Semaglutide',
      category: 'GLP-1 Receptor Agonist',
      brands: 'Ozempic · Wegovy',
      description: 'Slows gastric emptying, acts on appetite regulation in the brain, and improves insulin response.'
    },
    {
      name: 'Tirzepatide',
      category: 'GLP-1 & GIP Receptor Agonist',
      brands: 'Mounjaro · Zepbound',
      description: 'Acts on two receptors, GLP-1 and GIP. In head-to-head trial data it has generally produced greater average weight reduction than semaglutide, though individual response varies considerably and the side effect profile is similar.'
    }
  ];

  // Our approach
  pillars: ApproachPillar[] = [
    {
      title: 'We Test Before We Prescribe',
      description: 'GLP-1 medications work, and they work for many people who have not succeeded otherwise. They also do not correct an undiagnosed thyroid problem, and they do not address the insulin dysregulation that will still be there afterward.',
      icon: 'biotech'
    },
    {
      title: 'We Measure Body Composition, Not Just Weight',
      description: 'The number on a scale does not distinguish fat from muscle. Losing lean mass while losing weight lowers your metabolic rate and sets up the regain. InBody analysis tracks what is actually changing.',
      icon: 'monitor_weight'
    },
    {
      title: 'We Protect Muscle',
      description: 'This is the most consequential thing we do and the thing rapid-loss programs most often neglect. Adequate protein, resistance training, and appropriate rate of loss are built into the protocol from the start, because lean mass is what holds the result.',
      icon: 'fitness_center'
    },
    {
      title: 'We Plan For What Comes After',
      description: 'Weight regain following GLP-1 discontinuation is well documented. That is a predictable consequence of stopping a medication without having corrected the underlying metabolic dysfunction. Our aim is to treat the driver during treatment so there is something holding the result afterward.',
      icon: 'swap_horiz'
    },
    {
      title: 'A Physician Manages It',
      description: 'Dr. Adonis reviews your history, orders your testing, interprets it, and directs your protocol.',
      icon: 'person'
    }
  ];

  // Signs this could help you
  signs: string[] = [
    'Weight that will not move despite genuine, consistent effort',
    'Losing weight and regaining it repeatedly',
    'Weight gain that began without a change in diet or activity',
    'Weight settling around the midsection specifically',
    'Persistent hunger, or feeling unsatisfied after eating',
    'Strong carbohydrate and sugar cravings',
    'Fatigue after meals',
    'Weight gain starting around perimenopause, menopause, or in your forties',
    'Prediabetes, elevated fasting glucose, or a family history of diabetes',
    'Elevated blood pressure or cholesterol alongside the weight',
    'Fatigue, cold intolerance, and weight gain together, which suggests thyroid',
    'Prior weight loss medication that stopped working or was never explained',
    'Snoring, unrefreshing sleep, or waking with a headache'
  ];

  // What's included in your care
  included: IncludedItem[] = [
    {
      title: 'Initial Comprehensive Consultation',
      description: 'Weight history, prior attempts and what happened, current diet and activity, medications, sleep, stress, and medical and family history.',
      icon: 'person'
    },
    {
      title: 'Comprehensive Metabolic Panel',
      description: 'Fasting glucose, fasting insulin, HbA1c, lipids, full thyroid function, sex and adrenal hormones, inflammatory markers, vitamin D and nutrients, and liver and kidney function.',
      icon: 'biotech'
    },
    {
      title: 'Body Composition Analysis',
      description: 'InBody assessment establishing your baseline lean mass and body fat, so we can track what is actually changing.',
      icon: 'monitor_weight'
    },
    {
      title: 'Results Consultation with Dr. Adonis',
      description: 'What is driving the resistance, and the plan for each contributor.',
      icon: 'medical_services'
    },
    {
      title: 'Prescription Therapy Where Clinically Appropriate',
      description: 'We prescribe semaglutide and tirzepatide, the two GLP-1 receptor medications with the strongest weight management data behind them. Which one you receive, if either, is decided by your testing, your history, and your contraindications. Neither is prescribed as a default.',
      icon: 'medication'
    },
    {
      title: 'Correction Of The Underlying Drivers',
      description: 'Thyroid treatment, hormone optimization, insulin sensitization, inflammatory reduction, and sleep intervention as your findings indicate.',
      icon: 'science'
    },
    {
      title: 'Nutrition & Training Direction',
      description: 'Protein targets and resistance training guidance built to protect lean mass throughout.',
      icon: 'restaurant'
    },
    {
      title: 'Follow-Up Lab Testing Every Six Months',
      description: 'With body composition tracked alongside.',
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

  // How treatment works — eight steps
  treatmentSteps: TreatmentStep[] = [
    {
      number: '1',
      title: 'Consultation',
      description: 'Your weight history and every previous attempt. What worked temporarily and what happened after is diagnostically useful.',
      icon: 'person'
    },
    {
      number: '2',
      title: 'Testing',
      description: 'Metabolic, thyroid, and hormonal panel plus body composition. Labs can be completed in our office, or locally at any Quest or LabCorp.',
      icon: 'biotech'
    },
    {
      number: '3',
      title: 'Interpretation',
      description: 'Dr. Adonis identifies which mechanisms are driving the resistance.',
      icon: 'science'
    },
    {
      number: '4',
      title: 'Results Consultation',
      description: 'Findings explained, with a plan addressing both the immediate goal and the underlying dysfunction.',
      icon: 'medical_information'
    },
    {
      number: '5',
      title: 'Treatment Begins',
      description: 'Prescription therapy where appropriate, alongside correction of thyroid, hormonal, and metabolic contributors and a nutrition and training plan.',
      icon: 'medication'
    },
    {
      number: '6',
      title: 'Monitoring',
      description: 'Body composition tracked so we know you are losing fat rather than muscle, with dosing and protocol adjusted as needed.',
      icon: 'monitor_weight'
    },
    {
      number: '7',
      title: 'Follow-Up Testing Every Six Months',
      description: 'Metabolic markers rechecked to confirm the underlying picture is improving, not just the scale.',
      icon: 'schedule'
    },
    {
      number: '8',
      title: 'Maintenance Planning',
      description: 'Discussed from the beginning, not raised at the end.',
      icon: 'swap_horiz'
    }
  ];

  // Benefits of physician-managed weight loss
  benefits: BenefitCategory[] = [
    {
      title: 'Sustainable Fat Loss',
      description: 'With lean mass protected, which is what makes it hold.',
      icon: 'monitor_weight'
    },
    {
      title: 'Improved Metabolic Markers',
      description: 'Fasting insulin, HbA1c, and lipids frequently improve alongside the weight, and often ahead of it.',
      icon: 'biotech'
    },
    {
      title: 'Thyroid & Hormone Correction',
      description: 'With effects reaching well beyond weight — energy, mood, sleep, cognition.',
      icon: 'health_and_safety'
    },
    {
      title: 'Reduced Cardiovascular & Diabetes Risk',
      description: 'The clinical point of the exercise.',
      icon: 'favorite'
    },
    {
      title: 'Better Energy',
      description: 'As insulin stabilizes and post-meal crashes ease.',
      icon: 'fitness_center'
    },
    {
      title: 'Appetite Regulation Restored',
      description: 'Both from medication and from correcting the physiology driving hunger.',
      icon: 'restaurant'
    },
    {
      title: 'Improved Sleep & Joint Comfort',
      description: 'Reliable secondary effects of fat loss.',
      icon: 'self_improvement'
    },
    {
      title: 'A Plan For Afterward',
      description: 'Because the drivers were treated rather than only overridden.',
      icon: 'schedule'
    }
  ];

  // Who this is for
  candidatePoints: string[] = [
    'Have struggled with weight despite genuine effort',
    'Have regained after previous successful loss',
    'Have prediabetes, insulin resistance, or metabolic syndrome',
    'Suspect a thyroid or hormonal component',
    'Want testing before medication rather than instead of it',
    'Are willing to train and eat in a way that protects muscle'
  ];

  nonCandidatePoints: string[] = [
    'Have a history of an eating disorder. We would not want this program to interact badly with that, and specialized care is more appropriate.',
    'Have a personal or family history of medullary thyroid carcinoma or MEN2. This contraindicates GLP-1 therapy.',
    'Are pregnant, breastfeeding, or planning pregnancy in the near term',
    'Have a history of pancreatitis or active gallbladder disease. Requires individual evaluation.',
    'Want a prescription without testing or follow-up',
    'Want rapid loss regardless of what is being lost. Muscle loss is how people end up heavier two years later.'
  ];

  // Frequently asked questions
  faqs: FaqItem[] = [
    {
      question: 'Do I have to take medication?',
      answer: 'No. Medication is prescribed where it is clinically appropriate, and some patients do well once a thyroid problem, insulin resistance, or hormone deficiency is corrected. Testing determines what you actually need.',
      isOpen: false
    },
    {
      question: 'Will I regain the weight if I stop the medication?',
      answer: 'Regain after discontinuation is common and well documented, particularly when nothing underneath was addressed. That is precisely why we treat the metabolic drivers during treatment rather than relying on the medication alone.',
      isOpen: false
    },
    {
      question: 'Which medication will I be prescribed?',
      answer: 'Semaglutide or tirzepatide, if either is appropriate for you. That decision is based on your metabolic testing, your medical history, your contraindications, and how you respond. Some patients do not need medication at all once a thyroid or insulin problem is corrected.',
      isOpen: false
    },
    {
      question: 'What about compounded versions?',
      answer: 'The regulatory position on compounded semaglutide and tirzepatide changed substantially after the FDA declared both shortages resolved, and large-scale compounding of these medications is no longer permitted the way it was during the shortage period. We will tell you exactly what you are being prescribed before you start.',
      isOpen: false
    },
    {
      question: 'What are the side effects?',
      answer: 'Semaglutide and tirzepatide commonly cause nausea, constipation, and reduced appetite, particularly during dose increases. Less common but more serious risks include pancreatitis and gallbladder disease. Loss of lean muscle mass is a real concern with rapid loss, which is why we track body composition rather than weight alone.',
      isOpen: false
    },
    {
      question: 'How fast will I lose weight?',
      answer: 'Gradual, sustained loss preserves more lean mass than rapid loss, and lean mass is what determines whether the result holds. We aim for a rate that protects it.',
      isOpen: false
    },
    {
      question: 'Why do you test insulin and not just glucose?',
      answer: 'Because insulin rises years before glucose does. A normal fasting glucose with high fasting insulin is a very common finding and it explains a great deal of weight resistance that otherwise looks inexplicable.',
      isOpen: false
    },
    {
      question: 'Can this be managed by telehealth?',
      answer: 'Yes, for patients located in Florida. Labs can be completed in our office, or locally at any Quest or LabCorp, and InBody body composition analysis is done in the clinic.',
      isOpen: false
    },
    {
      question: 'Do you take insurance?',
      answer: 'No. This is a cash-pay practice and we do not provide superbills. Your labs and consultations are included in your program.',
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
    const url = `${origin}/medical-weight-loss`;
    const isEs = this.currentLang === 'es';

    const title = isEs
      ? 'Pérdida de Peso Médica en Miami | Atención Metabólica Dirigida por un Médico — Dr. Adonis Maiquez, MD'
      : 'Medical Weight Loss Miami | Physician-Managed Metabolic Care — Dr. Adonis Maiquez, MD';

    const description = isEs
      ? 'Pérdida de peso médica dirigida por un médico en Miami. Evaluamos las razones metabólicas, tiroideas y hormonales por las que el peso no baja, y las tratamos. Telemedicina en Florida.'
      : 'Physician-led medical weight loss in Miami. We test the metabolic, thyroid, and hormonal reasons weight will not move, then treat them. Florida telehealth available.';

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
        name: 'Medical Weight Loss',
        medicineSystem: 'WesternConventional',
        relevantSpecialty: ['Functional Medicine', 'Endocrinology', 'Nutrition']
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
