import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { SeoService } from '../../../shared/seo/seo.service';

export interface TransitionItem {
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

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
}

export interface FaqItem {
  question: string;
  answer: string;
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

  // The transitions HRT is used across
  transitions: TransitionItem[] = [
    {
      name: 'Perimenopause',
      category: 'The Years Before',
      description: 'The years before periods stop, often starting in the early to mid-forties. Hormones fluctuate rather than simply decline, which is why symptoms can be erratic and easy to dismiss.'
    },
    {
      name: 'Menopause',
      category: 'After Periods Stop',
      description: 'Estrogen and progesterone drop substantially and stay down. Effects reach well past hot flashes into bone density, cardiovascular health, cognition, and sleep architecture.'
    },
    {
      name: 'Andropause',
      category: 'The Male Equivalent',
      description: 'Slower and less discussed. Testosterone declines gradually from roughly the mid-thirties.',
      linkText: 'See our TRT page',
      linkUrl: '/testosterone-replacement-therapy'
    },
    {
      name: 'Clinical Deficiency At Any Age',
      category: 'Not Age-Dependent',
      description: 'Thyroid, adrenal, and sex hormone deficiencies occur in people nowhere near menopause. They are frequently missed because nobody tested for them.'
    }
  ];

  // Our approach
  pillars: ApproachPillar[] = [
    {
      title: 'We Panel The Whole System, Not The One Hormone You Asked About',
      description: 'Hormones operate as a network. Estradiol, progesterone, testosterone, DHEA, cortisol, and thyroid all influence one another, and each one is influenced by insulin, inflammation, and nutrient status. Prescribing to a single number produces a patient who feels partially better and cannot say why.',
      icon: 'biotech'
    },
    {
      title: 'We Ask Why Levels Dropped',
      description: 'Sometimes the answer is time, and replacement is the right treatment. Sometimes it is a thyroid nobody looked at properly, chronic stress physiology suppressing production upstream, a nutrient deficiency, or an inflammatory load. Replacement is a tool inside a plan, not the entire plan.',
      icon: 'science'
    },
    {
      title: 'Dosing Follows Your Labs And Your Symptoms, Together',
      description: 'Numbers alone are not the target. A level inside range while you still feel poorly is not a finished protocol. We adjust against how you feel and what your follow-up testing shows, in that order of urgency.',
      icon: 'monitor_weight'
    },
    {
      title: 'Your Physician Manages It',
      description: 'Dr. Adonis reviews your history, orders your panel, interprets it, writes your protocol, and manages your adjustments. Not an algorithm, not a rotating prescriber.',
      icon: 'person'
    }
  ];

  // Signs HRT could help you
  womenSigns: string[] = [
    'Hot flashes, night sweats, or temperature you cannot regulate',
    'Sleep that breaks in the early morning and will not return',
    'Weight gain around the midsection despite unchanged habits',
    'Vaginal dryness or discomfort with intimacy',
    'Low libido that feels physical rather than emotional',
    'Mood swings, anxiety, or irritability that is new for you',
    'Brain fog, word-finding trouble, or slipping recall',
    'Cycles becoming irregular, heavier, or lighter',
    'Skin thinning, hair loss, or joint aches without injury',
    'Fatigue that predates a stressful period and outlasted it'
  ];

  menSigns: string[] = [
    'Energy and drive that have quietly declined',
    'Longer recovery after training, less strength for the same work',
    'Increasing body fat, particularly abdominal, with muscle harder to hold',
    'Reduced libido or erectile changes',
    'Low mood, flat motivation, or shortened patience',
    'Poor concentration and mental sharpness',
    'Sleep quality dropping without an obvious cause'
  ];

  // What's included in your care
  included: IncludedItem[] = [
    {
      title: 'Initial Consultation',
      description: 'Full history, symptom timeline, prior hormone treatment, family history, and goals. Extended visit, not a fifteen-minute slot.',
      icon: 'person'
    },
    {
      title: 'Comprehensive Hormone Panel',
      description: 'Estradiol, progesterone, total and free testosterone, DHEA-S, SHBG, LH, FSH, complete thyroid with antibodies, cortisol, and metabolic and inflammatory markers.',
      icon: 'biotech'
    },
    {
      title: 'Results Consultation with Dr. Adonis',
      description: 'Every value explained in the context of your symptoms, plus the protocol built from it.',
      icon: 'medical_services'
    },
    {
      title: 'Your Prescribed Therapy',
      description: 'Delivery route selected for your situation, including creams, pellets, injections, oral preparations, and patches.',
      icon: 'medication'
    },
    {
      title: 'Supporting Protocol',
      description: 'Targeted supplementation, nutrition direction, and correction of any thyroid, nutrient, or inflammatory findings that affect hormone response.',
      icon: 'restaurant'
    },
    {
      title: 'Follow-Up Lab Testing Every Six Months',
      description: 'Levels rechecked on schedule, with dose adjustment based on results and symptoms.',
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
      description: 'Your history and symptoms, in detail.',
      icon: 'person'
    },
    {
      number: '2',
      title: 'Comprehensive Panel',
      description: 'Labs can be completed in our office, or locally at any Quest or LabCorp. Timing matters for cycling women, and we will schedule your draw accordingly.',
      icon: 'biotech'
    },
    {
      number: '3',
      title: 'Interpretation',
      description: 'Dr. Adonis reviews the full picture, including what may have caused the decline.',
      icon: 'science'
    },
    {
      number: '4',
      title: 'Results Visit And Protocol',
      description: 'You learn what is low, what is driving it, which hormones we are replacing, at what dose, by what route, and what else is being corrected alongside.',
      icon: 'medical_information'
    },
    {
      number: '5',
      title: 'Therapy Begins',
      description: 'With clear instruction on administration and what to expect in the first weeks.',
      icon: 'medication'
    },
    {
      number: '6',
      title: 'Follow-Up Panel',
      description: 'Levels rechecked and dose titrated. Almost nobody lands on the final dose first try, and that is expected.',
      icon: 'monitor_weight'
    },
    {
      number: '7',
      title: 'Ongoing Monitoring',
      description: 'Periodic testing and review for as long as you are on therapy.',
      icon: 'schedule'
    }
  ];

  // Benefits of bioidentical hormone therapy
  benefits: BenefitCategory[] = [
    {
      title: 'Symptom Relief',
      description: 'Hot flashes, night sweats, and temperature dysregulation typically respond early.',
      icon: 'spa'
    },
    {
      title: 'Sleep',
      description: 'Deeper and less interrupted, particularly when progesterone is part of the protocol.',
      icon: 'schedule'
    },
    {
      title: 'Body Composition',
      description: 'Better lean mass retention and less resistance to fat loss when hormones are back in range.',
      icon: 'monitor_weight'
    },
    {
      title: 'Mood And Cognition',
      description: 'Many patients describe steadier mood and clearer thinking as levels stabilize.',
      icon: 'science'
    },
    {
      title: 'Libido And Sexual Function',
      description: 'Improvement in drive, comfort, and responsiveness.',
      icon: 'favorite'
    },
    {
      title: 'Bone Density',
      description: 'Estrogen is protective against post-menopausal bone loss.',
      icon: 'health_and_safety'
    },
    {
      title: 'Fewer Side Effects Than Synthetic Formulations',
      description: 'Bioidentical structure means the body processes these hormones through its native pathways.',
      icon: 'self_improvement'
    },
    {
      title: 'Individualized Dosing',
      description: 'Compounded preparations allow doses matched to your labs rather than to the nearest commercial tablet strength.',
      icon: 'medication'
    }
  ];

  // Who this is for
  candidatePoints: string[] = [
    'Are experiencing perimenopause, menopause, or andropause symptoms',
    'Have tested low or borderline and have been told to wait',
    'Want to address symptoms rather than tolerate them',
    'Have had a poor experience with a one-size protocol elsewhere',
    'Are willing to complete testing and return for follow-up monitoring'
  ];

  nonCandidatePoints: string[] = [
    'Have a history of hormone-sensitive cancer. We do not prescribe hormone replacement in these cases, and treat with a natural functional medicine approach instead, in coordination with your oncologist.',
    'Have unexplained vaginal bleeding that has not been worked up',
    'Have active liver disease, a history of blood clots, stroke, or certain cardiovascular conditions',
    'Are pregnant or breastfeeding',
    'Are unwilling to complete baseline labs. We do not prescribe hormones without them.'
  ];

  // What patients say
  testimonials: Testimonial[] = [
    {
      quote: 'I was not dealing with menopause well at all, having hot flashes, memory problems, libido issues, absolutely zero energy, and lots of rage inside. Hormone replacement is advertised everywhere, so I thought it would be easy to get HRT, but I found it to be a guessing game with my GYN, my primary physician, as well as 2 different pharmacists and none of them really helped me. So I started looking for a specialist and a nurse referred me to Dr. Adonis. I met with him in a zoom meeting and instantly noticed how he was actually listening to what I was saying and had feedback for every concern I had. He ordered some labs and wrote up a plan for me to include HRT that is super easy to take, several vitamins/supplements, and of course, recommendations for diet and exercise. I am dead serious when I say I feel like I’m 30 years old again. My hot flashes are gone, sex drive is up, my memory is back to normal, and best of all, I have a crazy amount of energy. My mood has also stabilized. I wish I had met Dr. Adonis sooner.',
      author: '— M. Carlsen',
      role: 'Verified Clinic Patient'
    },
    {
      quote: 'Finding experienced local doctors who genuinely take symptoms seriously was challenging. I had to interview several before being referred to Dr. Adonis. I’m very glad to have found someone who listens and assists with HRT.',
      author: '— Alexia A.',
      role: 'Verified Clinic Patient'
    },
    {
      quote: 'Excellent experience in this clinic. The staff is very professional and friendly, and the medical team provides first-class care.',
      author: '— Ana G.',
      role: 'Verified Clinic Patient'
    }
  ];

  // Frequently asked questions
  faqs: FaqItem[] = [
    {
      question: 'Are bioidentical hormones safer than synthetic hormones?',
      answer: 'Bioidentical hormones are structurally identical to the ones your body produces, so they bind the same receptors and follow the same metabolic pathways. That structural match is associated with a different side effect profile than older synthetic formulations. No hormone therapy is risk-free, and your individual risk depends on your history. We review it with you before prescribing.',
      isOpen: false
    },
    {
      question: 'Do I have to be menopausal to start?',
      answer: 'No. Perimenopausal symptoms often begin years before periods stop, and hormone deficiencies occur at any age. What determines candidacy is testing plus symptoms, not birthdays.',
      isOpen: false
    },
    {
      question: 'How long will I be on therapy?',
      answer: 'That is an individual decision made with your physician and revisited at each review. Some patients use HRT through a transition. Others continue longer for ongoing symptom and bone protection. There is no fixed endpoint we impose.',
      isOpen: false
    },
    {
      question: 'Will I gain weight on hormones?',
      answer: 'Weight gain is more commonly associated with the hormone decline than with correcting it. Many patients find weight becomes more responsive once levels normalize, particularly when thyroid and insulin are addressed alongside.',
      isOpen: false
    },
    {
      question: 'What delivery methods do you offer?',
      answer: 'We offer creams, pellets, injections, oral preparations, and patches. The route is selected based on your labs, your symptoms, how stable your levels need to be, and what you will realistically stay consistent with.',
      isOpen: false
    },
    {
      question: 'How soon will I feel different?',
      answer: 'Sleep and vasomotor symptoms often respond first. Mood, body composition, and libido typically take longer. Your results visit will include a timeline specific to your protocol.',
      isOpen: false
    },
    {
      question: 'Do you treat men?',
      answer: 'Yes. Male hormone care is covered in more depth on our TRT page and our enclomiphene page.',
      isOpen: false
    },
    {
      question: 'Is this covered by insurance?',
      answer: 'No. This is a cash-pay practice and we do not provide superbills. Your labs and consultations are included in your program.',
      isOpen: false
    },
    {
      question: 'Are compounded hormones FDA approved?',
      answer: 'Compounded preparations are made by a licensed compounding pharmacy for an individual patient and are not FDA-approved products in the way commercially manufactured drugs are. We will explain which of your prescriptions are compounded and which are commercially manufactured before you start.',
      isOpen: false
    },
    {
      question: 'Can this be managed by telehealth?',
      answer: 'Yes, for patients located in Florida. Bloodwork is completed in our office or at a local Quest or LabCorp.',
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
    const url = `${origin}/hormone-replacement-therapy`;
    const isEs = this.currentLang === 'es';

    const title = isEs
      ? 'Terapia de Reemplazo Hormonal Bioidéntica en Miami | Dr. Adonis Maiquez, MD'
      : 'Bioidentical Hormone Replacement Therapy Miami | Dr. Adonis Maiquez, MD';

    const description = isEs
      ? 'Terapia hormonal bioidéntica dirigida por un médico en Miami para la menopausia, la perimenopausia y la andropausia. Paneles hormonales completos, protocolos basados en sus análisis, en persona o por telemedicina.'
      : 'Physician-led bioidentical HRT in Miami for menopause, perimenopause, and andropause. Comprehensive hormone panels, protocols built from your labs, in-person or telehealth.';

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
