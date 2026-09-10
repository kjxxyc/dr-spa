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
  selector: 'app-brain-health',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    TranslateModule
  ],
  templateUrl: './brain-health.component.html',
  styleUrls: ['./brain-health.component.scss']
})
export class BrainHealthComponent implements OnInit, OnDestroy {
  private langSub?: Subscription;
  currentLang = 'en';

  // The drivers we most commonly find
  drivers: DriverItem[] = [
    {
      name: 'Metabolic',
      category: 'Fuel & Glucose Handling',
      description: 'Insulin resistance impairs the brain’s ability to use glucose. The relationship between glycemic dysfunction and cognitive decline is well documented, and it is frequently present years before a diabetes diagnosis.'
    },
    {
      name: 'Vascular',
      category: 'Circulation & Perfusion',
      description: 'The brain depends on dense small-vessel circulation. Blood pressure, lipids, and endothelial function determine how well that circulation delivers.'
    },
    {
      name: 'Hormonal',
      category: 'Endocrine Signaling',
      description: 'Thyroid hormone directly regulates neuronal metabolism. Estrogen, progesterone, and testosterone all have receptors in the brain, and cognitive complaints appearing during perimenopause or andropause are frequently hormonal rather than psychological.'
    },
    {
      name: 'Inflammatory',
      category: 'Immune Activity',
      description: 'Systemic inflammation crosses into the central nervous system. Autoimmune activity, chronic infection, and gut permeability all contribute.'
    },
    {
      name: 'Nutritional',
      category: 'Micronutrient Status',
      description: 'B12, folate, vitamin D, omega-3s, magnesium, and iron are each required for neurological function, and deficiency is common and correctable.'
    },
    {
      name: 'Sleep',
      category: 'Overnight Clearance',
      description: 'Clearance of metabolic waste from the brain occurs predominantly during sleep. Untreated sleep apnea is one of the most consequential and most missed contributors to cognitive decline.'
    }
  ];

  // Our approach
  pillars: ApproachPillar[] = [
    {
      title: 'We Treat Cognitive Symptoms As A Finding, Not A Phase',
      description: 'Brain fog in a 45-year-old is frequently waved off. It should be worked up, because the causes underneath it are largely correctable and because the same drivers left running for two decades are the ones associated with long-term cognitive decline.',
      icon: 'science'
    },
    {
      title: 'We Test Broadly',
      description: 'Your panel may include fasting glucose, insulin and HbA1c, a complete lipid panel, inflammatory markers including hs-CRP and homocysteine, complete thyroid function, sex and adrenal hormones, B12, folate, vitamin D, magnesium, iron and ferritin, autoimmune antibodies, heavy metals, and chronic infection markers.',
      icon: 'biotech'
    },
    {
      title: 'We Take Sleep Seriously',
      description: 'If your history suggests obstructive sleep apnea — snoring, witnessed pauses, unrefreshing sleep, morning headache — we pursue that before anything else. It is common, treatable, and one of the highest-yield findings in cognitive medicine.',
      icon: 'schedule'
    },
    {
      title: 'We Refer When Referral Is Right',
      description: 'Rapidly progressing memory loss, personality change, difficulty with familiar tasks, disorientation to time or place, or new neurological symptoms require neurological evaluation and imaging. We will say so directly rather than starting a supplement protocol.',
      icon: 'medical_services'
    },
    {
      title: 'We Work On The Long Horizon Too',
      description: 'The metabolic, vascular, and inflammatory factors that produce brain fog now are the same ones associated with cognitive decline decades later. Correcting them addresses both.',
      icon: 'health_and_safety'
    }
  ];

  // Signs this could help you
  signs: string[] = [
    'Brain fog, or a sense that thinking takes more effort than it used to',
    'Word-finding difficulty',
    'Forgetting names, appointments, or why you came into a room',
    'Reduced ability to concentrate or sustain focus',
    'Reading the same paragraph repeatedly',
    'Mental fatigue by early afternoon',
    'Slower processing, or feeling a step behind in conversation',
    'Cognitive symptoms that started around perimenopause or menopause',
    'Fog that tracks with meals or with specific foods',
    'Memory or focus changes alongside fatigue, weight gain, or mood changes',
    'Family history of dementia and a desire to act on it now',
    'Snoring, unrefreshing sleep, or waking with a headache',
    'Cognitive symptoms following illness, infection, or a period of high stress'
  ];

  // What's included in your care
  included: IncludedItem[] = [
    {
      title: 'Initial Comprehensive Consultation',
      description: 'Cognitive symptom history and timeline, sleep, medical and family history, medications, mood, stress, diet, and prior evaluation.',
      icon: 'person'
    },
    {
      title: 'Comprehensive Cognitive & Metabolic Panel',
      description: 'Metabolic and insulin markers, lipids, inflammatory markers, homocysteine, full thyroid function, hormones, B vitamins, vitamin D, minerals, autoimmune markers, heavy metals, and chronic infection markers.',
      icon: 'biotech'
    },
    {
      title: 'Sleep Assessment',
      description: 'Screening for sleep apnea and referral for a study where indicated.',
      icon: 'schedule'
    },
    {
      title: 'Results Consultation with Dr. Adonis',
      description: 'Which systems are contributing to your cognitive symptoms, and the plan for each.',
      icon: 'medical_services'
    },
    {
      title: 'Your Treatment Protocol',
      description: 'Metabolic correction, hormone optimization where indicated, targeted nutrient repletion, anti-inflammatory intervention, cardiovascular risk reduction, and nutrition and exercise direction built for cognitive support.',
      icon: 'medication'
    },
    {
      title: 'Follow-Up Lab Testing Every Six Months',
      description: 'With the protocol adjusted as markers move.',
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

  // How treatment works
  treatmentSteps: TreatmentStep[] = [
    {
      number: '1',
      title: 'Consultation',
      description: 'What changed, when, and whether it is stable or progressing. Progression pattern is the most important thing you can tell us.',
      icon: 'person'
    },
    {
      number: '2',
      title: 'Testing',
      description: 'Broad metabolic, hormonal, inflammatory, and nutritional panel. Labs can be completed in our office, or locally at any Quest or LabCorp.',
      icon: 'biotech'
    },
    {
      number: '3',
      title: 'Interpretation',
      description: 'Dr. Adonis identifies which contributors are present and which is dominant.',
      icon: 'science'
    },
    {
      number: '4',
      title: 'Results Consultation',
      description: 'Findings explained and a plan built in priority order, starting with the highest-yield correction.',
      icon: 'medical_information'
    },
    {
      number: '5',
      title: 'Treatment Begins',
      description: 'Typically metabolic and nutritional correction first, since those move fastest, with hormonal and inflammatory work alongside.',
      icon: 'medication'
    },
    {
      number: '6',
      title: 'Follow-Up Testing Every Six Months',
      description: 'Markers rechecked and the protocol adjusted.',
      icon: 'schedule'
    }
  ];

  // Benefits of cognitive care
  benefits: BenefitCategory[] = [
    {
      title: 'Clearer Thinking',
      description: 'The fog lifting is the change patients describe most.',
      icon: 'science'
    },
    {
      title: 'Better Recall',
      description: 'Names, words, and details becoming available again.',
      icon: 'menu_book'
    },
    {
      title: 'Sustained Focus',
      description: 'Longer stretches of real concentration, less rereading.',
      icon: 'auto_stories'
    },
    {
      title: 'Reduced Mental Fatigue',
      description: 'More cognitive stamina through the day.',
      icon: 'fitness_center'
    },
    {
      title: 'Mood Improvement',
      description: 'Frequently accompanies cognitive change, particularly when thyroid, B12, vitamin D, or hormones were involved.',
      icon: 'favorite'
    },
    {
      title: 'Better Sleep',
      description: 'Both a cause and a beneficiary of this work.',
      icon: 'self_improvement'
    },
    {
      title: 'Improved Metabolic & Vascular Markers',
      description: 'Which benefit the brain and everything else.',
      icon: 'monitor_weight'
    },
    {
      title: 'Long-Term Risk Reduction',
      description: 'Addressing insulin resistance, vascular risk, inflammation, and sleep apnea is among the most evidence-supported approaches to protecting cognition over time.',
      icon: 'health_and_safety'
    }
  ];

  // Who this is for
  candidatePoints: string[] = [
    'Have brain fog or cognitive changes without a clear explanation',
    'Have been told it is stress or age and do not accept that',
    'Have cognitive symptoms alongside fatigue, weight, mood, or hormone changes',
    'Have noticed changes during perimenopause or andropause',
    'Have family history of dementia and want to address modifiable risk now',
    'Are prepared to make dietary, sleep, and exercise changes'
  ];

  nonCandidatePoints: string[] = [
    'Have rapidly progressing memory loss, disorientation, personality change, or difficulty with familiar tasks. This requires neurological evaluation and imaging, and we will refer.',
    'Have new focal neurological symptoms — weakness, numbness, vision or speech changes. Seek immediate medical care.',
    'Have a diagnosed dementia requiring neurological management. We may support metabolic health alongside that care, but we do not replace it.',
    'Have had a recent head injury with ongoing symptoms. That needs appropriate neurological assessment.',
    'Want a nootropic prescription without a workup'
  ];

  // Frequently asked questions
  faqs: FaqItem[] = [
    {
      question: 'Is brain fog a real medical problem?',
      answer: 'It is not a diagnosis, but it is a real symptom with identifiable causes. Thyroid dysfunction, B12 deficiency, insulin resistance, hormone decline, sleep apnea, and systemic inflammation all produce it, and all are measurable.',
      isOpen: false
    },
    {
      question: 'How do I know if this is normal aging or something else?',
      answer: 'Normal aging involves gradual, mild change that does not interfere with independent function. Symptoms that are progressing noticeably, affecting your work or daily tasks, or accompanied by disorientation warrant neurological evaluation. Tell us what you have noticed and we will help determine which situation you are in.',
      isOpen: false
    },
    {
      question: 'Can you prevent Alzheimer’s disease?',
      answer: 'No. What is well supported is that a substantial share of dementia risk is attributable to modifiable factors — vascular health, metabolic health, sleep, hearing, activity, and others. We address the ones we can measure and influence. That is risk reduction, not prevention, and we will not describe it as more than it is.',
      isOpen: false
    },
    {
      question: 'My memory got worse during menopause. Is that connected?',
      answer: 'Very likely. Estrogen has receptors throughout the brain and influences cognition directly. Cognitive symptoms appearing during perimenopause are common, frequently dismissed, and often responsive to hormone evaluation.',
      isOpen: false
    },
    {
      question: 'What if my labs come back fine?',
      answer: 'Then we look at sleep, vascular imaging, and other contributors, and we consider neurological referral. Normal labs narrow the question rather than ending it.',
      isOpen: false
    },
    {
      question: 'How long until I notice a difference?',
      answer: 'Most patients report meaningful change within 90 days. Correcting a significant B12 or thyroid deficiency can register sooner.',
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
    const url = `${origin}/functional-medicine/brain-health`;
    const isEs = this.currentLang === 'es';

    const title = isEs
      ? 'Salud Cerebral y Cognitiva en Miami | Tratamiento de Causa Raíz para la Niebla Mental — Dr. Adonis Maiquez, MD'
      : 'Brain Health & Cognitive Care Miami | Root-Cause Brain Fog Treatment — Dr. Adonis Maiquez, MD';

    const description = isEs
      ? 'Medicina funcional para la niebla mental, la memoria y las preocupaciones cognitivas en Miami. Evaluamos los factores metabólicos, hormonales e inflamatorios de la cognición. Telemedicina en Florida.'
      : 'Functional medicine for brain fog, memory, and cognitive concerns in Miami. We test the metabolic, hormonal, and inflammatory drivers of cognition. Florida telehealth available.';

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
        name: 'Cognitive Impairment and Brain Fog',
        relevantSpecialty: ['Functional Medicine', 'Neurology', 'Anti-Aging Medicine']
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
