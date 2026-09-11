import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { SeoService } from '../../../shared/seo/seo.service';

export interface OptionItem {
  name: string;
  category: string;
  description: string;
  tradeOff: string;
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

  // The two routes to raising testosterone
  options: OptionItem[] = [
    {
      name: 'Standard TRT',
      category: 'Replaces The Product',
      description: 'Supplies testosterone from outside. It works well, and your body reads the incoming supply as sufficient, stops sending the signal to produce, and sperm production falls with it.',
      tradeOff: 'A higher ceiling, at the cost of your own production and fertility.'
    },
    {
      name: 'Enclomiphene',
      category: 'Restores The Signal',
      description: 'Blocks estrogen receptors at the hypothalamus, so the brain reads the level as low and increases LH and FSH. Your testicles receive a stronger signal and produce more testosterone themselves.',
      tradeOff: 'Fertility and your own production preserved, at a lower ceiling — and it requires testicles that can respond.'
    }
  ];

  // Our approach
  pillars: ApproachPillar[] = [
    {
      title: 'Enclomiphene Only Works If The Machinery Works',
      description: 'Enclomiphene amplifies a signal. If the testicles cannot respond to that signal — primary hypogonadism — there is nothing to amplify and the medication will not work. Distinguishing primary from secondary hypogonadism requires LH and FSH. A clinic that prescribes off a total testosterone number alone is guessing. We test LH and FSH before we prescribe. Always.',
      icon: 'biotech'
    },
    {
      title: 'We Start With The Least Suppressive Option That Fits Your Goal',
      description: 'If you are 34 with secondary hypogonadism and want children in the next few years, starting on lifelong exogenous testosterone is a significant decision to make casually. Enclomiphene is often the more appropriate first move. If it does not produce an adequate response, TRT remains available.',
      icon: 'swap_horiz'
    },
    {
      title: 'Estradiol Is Monitored',
      description: 'Raising testosterone raises the estradiol it converts into, and enclomiphene’s mechanism also directly involves estrogen receptors. We track estradiol and symptoms rather than assuming it will sort itself out.',
      icon: 'monitor_weight'
    },
    {
      title: 'The Upstream Cause Still Gets Investigated',
      description: 'Secondary hypogonadism has causes: sleep debt, visceral fat, insulin resistance, chronic stress, thyroid dysfunction, elevated prolactin. Enclomiphene can raise your number while the cause continues doing damage. We look for it.',
      icon: 'science'
    }
  ];

  // Signs enclomiphene could be right for you
  signs: string[] = [
    'You have symptoms of low testosterone and want to preserve fertility',
    'You are trying to conceive now, or expect to within a few years',
    'Your labs suggest secondary rather than primary hypogonadism',
    'You are hesitant to commit to lifelong exogenous testosterone',
    'You are on TRT and want to transition off while maintaining levels',
    'You want to avoid testicular atrophy',
    'You would rather your own physiology do the work if it can',
    'You want to try the reversible option before the more permanent one'
  ];

  // What's included in your care
  included: IncludedItem[] = [
    {
      title: 'Initial Consultation',
      description: 'Symptom history, fertility plans and timeline, prior hormone treatment, medical history, and goals. Fertility intent shapes the entire protocol and is asked about directly.',
      icon: 'person'
    },
    {
      title: 'Comprehensive Hormone Panel',
      description: 'Your panel must include LH and FSH to establish candidacy, and may include total and free testosterone, SHBG, estradiol, prolactin, thyroid function, CBC, PSA, and metabolic markers.',
      icon: 'biotech'
    },
    {
      title: 'Results Consultation with Dr. Adonis',
      description: 'Whether you are a candidate, why, and what the alternative is if you are not.',
      icon: 'medical_services'
    },
    {
      title: 'Prescribed Enclomiphene',
      description: 'Dosing individualized to your labs and your response.',
      icon: 'medication'
    },
    {
      title: 'Supporting Corrections',
      description: 'Any thyroid, metabolic, sleep, or nutrient findings contributing to suppressed production.',
      icon: 'science'
    },
    {
      title: 'Follow-Up Lab Testing Every Six Months',
      description: 'Checking testosterone, LH, FSH, and estradiol to confirm response and adjust dosing.',
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

  // How treatment works — seven steps
  treatmentSteps: TreatmentStep[] = [
    {
      number: '1',
      title: 'Consultation',
      description: 'Including a direct conversation about whether children are in your plans.',
      icon: 'person'
    },
    {
      number: '2',
      title: 'Baseline Panel',
      description: 'Morning draw. LH and FSH are the values that determine whether this medication can work for you.',
      icon: 'biotech'
    },
    {
      number: '3',
      title: 'Interpretation',
      description: 'Dr. Adonis establishes primary versus secondary hypogonadism and looks for upstream causes.',
      icon: 'science'
    },
    {
      number: '4',
      title: 'Results Visit',
      description: 'If you are a candidate, you get the protocol. If you are not, you get the honest reason and the alternative rather than a prescription that will disappoint you.',
      icon: 'medical_information'
    },
    {
      number: '5',
      title: 'Therapy Begins',
      description: 'Oral dosing, on a schedule individualized to your labs and your response.',
      icon: 'medication'
    },
    {
      number: '6',
      title: 'Follow-Up Panel',
      description: 'Testosterone, LH, FSH, and estradiol rechecked to confirm you responded. Dose adjusted, or the plan changed if the response is inadequate. Ongoing lab testing runs every six months.',
      icon: 'monitor_weight'
    },
    {
      number: '7',
      title: 'Ongoing Monitoring',
      description: 'Periodic labs and review for the duration of therapy.',
      icon: 'schedule'
    }
  ];

  // Benefits of enclomiphene
  benefits: BenefitCategory[] = [
    {
      title: 'Fertility Preserved',
      description: 'The central advantage. LH and FSH rise rather than fall, so sperm production is maintained rather than suppressed.',
      icon: 'favorite'
    },
    {
      title: 'Your Own Production Restored',
      description: 'Testosterone produced by your testicles, released in your natural rhythm, rather than delivered on an injection schedule.',
      icon: 'man'
    },
    {
      title: 'No Testicular Atrophy',
      description: 'Continued stimulation means the testicles keep working.',
      icon: 'health_and_safety'
    },
    {
      title: 'Oral Administration',
      description: 'No injections, no application sites, no pellet procedures.',
      icon: 'medication'
    },
    {
      title: 'Reversible',
      description: 'Stopping enclomiphene generally returns you to baseline without the recovery period exogenous testosterone can require.',
      icon: 'swap_horiz'
    },
    {
      title: 'Typical Symptom Improvement',
      description: 'Energy, libido, mood, concentration, and body composition, in line with what any successful testosterone correction produces.',
      icon: 'fitness_center'
    },
    {
      title: 'A First Step, Not A Commitment',
      description: 'If it works, good. If it does not, TRT is still available and nothing has been foreclosed.',
      icon: 'self_improvement'
    }
  ];

  // Who this is for
  candidatePoints: string[] = [
    'Have secondary hypogonadism confirmed by LH and FSH',
    'Want to preserve fertility, now or in the future',
    'Prefer an oral medication to injections',
    'Want a reversible option before committing to TRT',
    'Are on TRT and want to attempt a transition off',
    'Are prepared to complete follow-up labs'
  ];

  nonCandidatePoints: string[] = [
    'Have primary hypogonadism. The testicles cannot respond, so the medication has nothing to act on.',
    'Have a pituitary tumor or structural cause requiring different treatment',
    'Have a history of blood clots or certain visual disorders',
    'Have untreated significantly elevated prolactin, which needs its own workup first',
    'Are unwilling to complete baseline LH and FSH testing',
    'Need the ceiling that exogenous testosterone provides. Enclomiphene raises your own production, which has a limit.'
  ];

  // Frequently asked questions
  faqs: FaqItem[] = [
    {
      question: 'Is enclomiphene FDA approved?',
      answer: 'Enclomiphene is prescribed off-label for male hypogonadism and is dispensed as a compounded medication. Off-label prescribing is legal and routine in medicine, and it means the FDA has not approved this specific use. We prescribe it based on clinical evidence and individual evaluation, and we will tell you exactly what you are taking and why.',
      isOpen: false
    },
    {
      question: 'How is this different from TRT?',
      answer: 'TRT supplies testosterone from outside, which suppresses your own production and your fertility. Enclomiphene stimulates your body to produce more of its own, so the axis stays active. The trade-off is a lower ceiling and a requirement that your testicles be able to respond.',
      isOpen: false
    },
    {
      question: 'Will it definitely raise my testosterone?',
      answer: 'If your hypogonadism is secondary, most men respond. If it is primary, it will not work. That is why we test LH and FSH before prescribing rather than after.',
      isOpen: false
    },
    {
      question: 'Can I use it while trying to conceive?',
      answer: 'That is the main reason men choose it. Enclomiphene maintains and can improve the signals driving sperm production. If you are actively trying, tell us so we can coordinate appropriately.',
      isOpen: false
    },
    {
      question: 'What are the side effects?',
      answer: 'Reported effects include headache, visual disturbance, mood changes, nausea, and hot flashes. Visual symptoms warrant contacting us promptly. Most men tolerate it well, and we monitor estradiol alongside testosterone.',
      isOpen: false
    },
    {
      question: 'How long until it works?',
      answer: 'Testosterone typically rises within the first several weeks. Symptom improvement usually trails the lab change.',
      isOpen: false
    },
    {
      question: 'Can I switch from TRT to enclomiphene?',
      answer: 'Often, yes, though it requires a managed transition and there is a period during which you may not feel your best while your axis restarts. This should never be attempted without physician supervision.',
      isOpen: false
    },
    {
      question: 'Do I still need labs if I feel fine?',
      answer: 'Yes. Testosterone, estradiol, and hematocrit are monitored throughout. Feeling well is not the same as being in range.',
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
    const url = `${origin}/enclomiphene`;
    const isEs = this.currentLang === 'es';

    const title = isEs
      ? 'Terapia con Enclomifeno en Miami | Aumente la Testosterona Sin Suprimir la Fertilidad'
      : 'Enclomiphene Therapy Miami | Raise Testosterone Without Suppressing Fertility';

    const description = isEs
      ? 'Enclomifeno recetado por un médico en Miami. Aumenta su propia producción de testosterona preservando la fertilidad. Panel hormonal completo y seguimiento con el Dr. Adonis Maiquez, MD.'
      : 'Physician-prescribed enclomiphene in Miami. Raises your own testosterone production while preserving fertility. Full hormone panel and monitoring with Dr. Adonis Maiquez, MD.';

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
