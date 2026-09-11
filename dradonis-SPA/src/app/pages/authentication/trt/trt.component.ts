import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { SeoService } from '../../../shared/seo/seo.service';

export interface HypogonadismType {
  name: string;
  category: string;
  description: string;
  linkText?: string;
  linkUrl?: string;
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
  selector: 'app-trt',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    TranslateModule
  ],
  templateUrl: './trt.component.html',
  styleUrls: ['./trt.component.scss']
})
export class TrtComponent implements OnInit, OnDestroy {
  private langSub?: Subscription;
  currentLang = 'en';

  // The two distinctions that matter clinically
  hypogonadismTypes: HypogonadismType[] = [
    {
      name: 'Primary Hypogonadism',
      category: 'The Testicles',
      description: 'The testicles are not producing adequately. The signal from above is arriving, but the response to it is inadequate, so raising the signal alone will not fix the problem.'
    },
    {
      name: 'Secondary Hypogonadism',
      category: 'The Signal',
      description: 'The signal from the pituitary and hypothalamus has weakened, so the testicles are not being told to produce. If fertility matters to you, this distinction is the whole conversation, because restoring the signal is an option here.',
      linkText: 'See our Enclomiphene page',
      linkUrl: '/enclomiphene'
    }
  ];

  // Our approach
  pillars: ApproachPillar[] = [
    {
      title: 'Full Panel, Not A Single Number',
      description: 'Total testosterone is the least informative number in male hormone medicine when read alone. Most testosterone in your blood is bound to SHBG and albumin and is not biologically available. Two men with identical total testosterone can have very different free testosterone, and only one of them feels it.',
      icon: 'biotech'
    },
    {
      title: 'We Look For Why It Dropped Before We Replace It',
      description: 'Low testosterone is frequently downstream of something else. Poor sleep, visceral fat driving aromatization, insulin resistance, chronic stress suppressing the pituitary signal, undiagnosed thyroid dysfunction, or nutrient deficiency. Replacing testosterone without addressing those leaves the cause running. This is the difference between a subscription and a diagnosis.',
      icon: 'science'
    },
    {
      title: 'Estradiol Is Managed, Not Ignored',
      description: 'Testosterone aromatizes into estradiol. Men need estradiol — it is protective for bone, cardiovascular health, and libido. Too much causes real problems. Clinics that never check it are managing half the equation, and clinics that reflexively suppress it create a different set of symptoms. We test it and treat what we find.',
      icon: 'monitor_weight'
    },
    {
      title: 'Monitoring Is Part Of The Treatment, Not An Upsell',
      description: 'Hematocrit, PSA, estradiol, and lipids are checked on schedule for as long as you are on therapy. This is standard of care and it is not optional here.',
      icon: 'schedule'
    }
  ];

  // Signs TRT could help you
  signs: string[] = [
    'Persistent fatigue that sleep does not resolve',
    'Strength plateaus or losses despite consistent training',
    'Longer recovery, more frequent soreness, more nagging injuries',
    'Abdominal fat accumulating while muscle gets harder to hold',
    'Reduced libido, or interest that has to be manufactured',
    'Erectile changes or reduced morning erections',
    'Low mood, flat motivation, shorter fuse',
    'Difficulty concentrating, mental fog, slower recall',
    'Sleep quality declining without an obvious cause',
    'Reduced confidence or competitive drive',
    'Hot flashes or night sweats, which occur in men and are routinely missed'
  ];

  // What's included in your care
  included: IncludedItem[] = [
    {
      title: 'Initial Consultation',
      description: 'Symptom history, training and sleep, prior treatment, fertility plans, medical and family history, and goals.',
      icon: 'person'
    },
    {
      title: 'Comprehensive Male Hormone Panel',
      description: 'Total and free testosterone, SHBG, estradiol, LH, FSH, prolactin, thyroid, CBC with hematocrit, PSA, metabolic and lipid panels, and inflammatory markers.',
      icon: 'biotech'
    },
    {
      title: 'Results Consultation with Dr. Adonis',
      description: 'Your numbers explained, the likely cause identified, the protocol built.',
      icon: 'medical_services'
    },
    {
      title: 'Your Prescribed Protocol',
      description: 'Route and dosing selected for your case, including injections, creams, and pellets, with ancillary medications where clinically indicated.',
      icon: 'medication'
    },
    {
      title: 'Supporting Corrections',
      description: 'Thyroid, nutrient, metabolic, or sleep findings treated alongside, because they determine how well the therapy works.',
      icon: 'science'
    },
    {
      title: 'Follow-Up Lab Testing Every Six Months',
      description: 'Covering testosterone, estradiol, hematocrit, PSA, and metabolic markers.',
      icon: 'schedule'
    },
    {
      title: 'Dose Titration',
      description: 'Adjusted against results and symptoms until the protocol is right.',
      icon: 'swap_horiz'
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
      description: 'Full history, including whether you want children now or later. That answer changes the protocol.',
      icon: 'person'
    },
    {
      number: '2',
      title: 'Baseline Panel',
      description: 'Drawn in the morning, when testosterone peaks. Afternoon draws produce misleading numbers and are one of the most common reasons men are wrongly told they are fine.',
      icon: 'biotech'
    },
    {
      number: '3',
      title: 'Interpretation',
      description: 'Dr. Adonis reads the full panel, identifies primary versus secondary, and looks for contributing causes.',
      icon: 'science'
    },
    {
      number: '4',
      title: 'Results Visit',
      description: 'Where your levels are, why, what we are prescribing, what we are correcting alongside, and what to expect week by week.',
      icon: 'medical_information'
    },
    {
      number: '5',
      title: 'Therapy Begins',
      description: 'With administration instruction and a clear picture of the first eight weeks.',
      icon: 'medication'
    },
    {
      number: '6',
      title: 'Follow-Up Panel',
      description: 'Levels, estradiol, and hematocrit rechecked and your dose adjusted. Ongoing lab testing runs every six months.',
      icon: 'monitor_weight'
    },
    {
      number: '7',
      title: 'Ongoing Monitoring',
      description: 'Periodic labs and review for the duration of therapy.',
      icon: 'schedule'
    }
  ];

  // Benefits of testosterone therapy
  benefits: BenefitCategory[] = [
    {
      title: 'Energy And Drive',
      description: 'Usually the first thing men report changing.',
      icon: 'fitness_center'
    },
    {
      title: 'Lean Muscle And Strength',
      description: 'Testosterone increases muscle protein synthesis. Training still does the work — therapy makes the work pay.',
      icon: 'man'
    },
    {
      title: 'Body Composition',
      description: 'Improved fat distribution and insulin sensitivity, particularly abdominal.',
      icon: 'monitor_weight'
    },
    {
      title: 'Libido And Sexual Function',
      description: 'Improvement in drive and, for many men, erectile quality.',
      icon: 'favorite'
    },
    {
      title: 'Mood And Motivation',
      description: 'Many men describe steadier mood and a return of drive that had gone flat.',
      icon: 'self_improvement'
    },
    {
      title: 'Cognition',
      description: 'Improved focus and mental clarity are commonly reported.',
      icon: 'science'
    },
    {
      title: 'Bone Density',
      description: 'Testosterone is protective against bone loss in men.',
      icon: 'health_and_safety'
    },
    {
      title: 'Sleep',
      description: 'Often improves, though untreated sleep apnea requires evaluation, since testosterone can worsen it.',
      icon: 'schedule'
    }
  ];

  // Who this is for
  candidatePoints: string[] = [
    'Have symptoms of low testosterone confirmed by testing',
    'Have been told you are in range but do not feel in range',
    'Want a physician managing your case, not a subscription',
    'Are prepared to complete follow-up labs on schedule',
    'Are training and eating in a way that supports the protocol'
  ];

  nonCandidatePoints: string[] = [
    'Are trying to conceive now or soon. TRT suppresses sperm production. Enclomiphene or hCG-based approaches exist for exactly this reason.',
    'Have prostate cancer or an untreated elevated PSA',
    'Have untreated obstructive sleep apnea',
    'Have polycythemia or an elevated hematocrit',
    'Have uncontrolled heart failure or a recent cardiovascular event',
    'Are unwilling to return for monitoring labs. We do not manage TRT without them.'
  ];

  // Frequently asked questions
  faqs: FaqItem[] = [
    {
      question: 'My doctor said my testosterone was normal. Why do I still feel this way?',
      answer: 'Reference ranges are wide, they are age-adjusted downward, and total testosterone does not tell you how much is biologically available. A man at the low end of range with high SHBG can have free testosterone well below functional levels. Timing matters too — a level drawn in the afternoon can read substantially lower than the same man’s morning value.',
      isOpen: false
    },
    {
      question: 'Will TRT affect my fertility?',
      answer: 'Yes. Exogenous testosterone suppresses the pituitary signal that drives sperm production, and that suppression can persist after stopping. If you want children now or later, tell us at your first visit. Enclomiphene and hCG-based protocols raise testosterone while preserving the signal.',
      isOpen: false
    },
    {
      question: 'Is TRT for life?',
      answer: 'Often, but not always. If low testosterone is secondary to something correctable — sleep apnea, significant visceral fat, thyroid dysfunction, chronic stress — treating the cause sometimes restores production. That is why we investigate before we prescribe.',
      isOpen: false
    },
    {
      question: 'What are the risks?',
      answer: 'The main ones are elevated hematocrit, estradiol imbalance, acne, fluid retention, testicular shrinkage, fertility suppression, and worsening of untreated sleep apnea. Every one of them is monitorable, which is why scheduled labs are non-negotiable here.',
      isOpen: false
    },
    {
      question: 'Injections, cream, or pellets?',
      answer: 'We offer injections, creams, and pellets. Each has trade-offs in level stability, convenience, and cost. The route is selected based on your labs, your schedule, and what you will realistically stay consistent with, and it can be changed if the first choice does not suit you.',
      isOpen: false
    },
    {
      question: 'How fast will I feel it?',
      answer: 'Energy and mood commonly shift in the first few weeks. Libido varies widely. Body composition takes months and depends on what you do in the gym and kitchen.',
      isOpen: false
    },
    {
      question: 'Do you use hCG or aromatase inhibitors?',
      answer: 'Ancillary medications are used where clinically indicated, based on your estradiol, your fertility plans, and how you respond to therapy. They are not applied as a default to every patient.',
      isOpen: false
    },
    {
      question: 'Can I do this by telehealth?',
      answer: 'Yes, for patients located in Florida. Labs can be completed in our office, or locally at any Quest or LabCorp.',
      isOpen: false
    },
    {
      question: 'Is this covered by insurance?',
      answer: 'No. This is a cash-pay practice and we do not provide superbills. Your labs and consultations are included in your program, which is what allows for full panels and unhurried visits.',
      isOpen: false
    },
    {
      question: 'What if I want to stop?',
      answer: 'We taper and monitor rather than having you stop abruptly. Recovery of natural production varies with how long you were on therapy and your baseline before it.',
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
    const url = `${origin}/testosterone-replacement-therapy`;
    const isEs = this.currentLang === 'es';

    const title = isEs
      ? 'TRT en Miami | Terapia de Testosterona Supervisada por un Médico — Dr. Adonis Maiquez, MD'
      : 'TRT in Miami | Physician-Managed Testosterone Therapy — Dr. Adonis Maiquez, MD';

    const description = isEs
      ? 'Terapia de reemplazo de testosterona dirigida por un médico en Miami. Panel hormonal completo, protocolo basado en sus análisis y seguimiento continuo por un médico con formación en neurocirugía.'
      : 'Physician-led testosterone replacement therapy in Miami. Full hormone panel, protocol built from your labs, ongoing monitoring by a neurosurgeon-trained MD.';

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
        name: 'Testosterone Replacement Therapy',
        alternateName: 'TRT',
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
