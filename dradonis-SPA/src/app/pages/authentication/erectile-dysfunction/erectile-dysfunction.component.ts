import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { SeoService } from '../../../shared/seo/seo.service';

export interface CauseItem {
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
  selector: 'app-erectile-dysfunction',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    TranslateModule
  ],
  templateUrl: './erectile-dysfunction.component.html',
  styleUrls: ['./erectile-dysfunction.component.scss']
})
export class ErectileDysfunctionComponent implements OnInit, OnDestroy {
  private langSub?: Subscription;
  currentLang = 'en';

  // The causes, most men have more than one running at once
  causes: CauseItem[] = [
    {
      name: 'Vascular',
      category: 'The Most Common',
      description: 'Erectile tissue depends on small arteries, and those arteries are among the first affected by endothelial dysfunction, atherosclerosis, high blood pressure, and elevated lipids. The penile arteries are narrower than the coronary arteries, which is why they show impairment earlier. In a meaningful number of men, ED precedes a cardiovascular diagnosis by several years.'
    },
    {
      name: 'Hormonal',
      category: 'Endocrine',
      description: 'Low testosterone reduces libido and affects erectile quality. Thyroid dysfunction, elevated prolactin, and estradiol imbalance all contribute.'
    },
    {
      name: 'Metabolic',
      category: 'Insulin & Glucose',
      description: 'Insulin resistance and diabetes damage both blood vessels and nerves. ED is substantially more prevalent in men with diabetes.'
    },
    {
      name: 'Neurologic',
      category: 'Nerve Signaling',
      description: 'Nerve signaling from spinal injury, surgery, neuropathy, or neurological disease.'
    },
    {
      name: 'Medication-Induced',
      category: 'Prescription Contributors',
      description: 'Common with certain antihypertensives, antidepressants, and other prescriptions.'
    },
    {
      name: 'Psychological',
      category: 'Often Secondary',
      description: 'Anxiety, depression, stress, and relationship factors are real contributors — and they frequently develop on top of a physical cause rather than instead of one.'
    }
  ];

  // Our approach
  pillars: ApproachPillar[] = [
    {
      title: 'We Treat ED As A Diagnostic Signal',
      description: 'The most consequential thing we do is not the prescription. It is the workup. When a man in his forties or fifties develops ED, the question is not only how to restore function. It is what the vascular system is telling us, and whether there is something worth catching now.',
      icon: 'favorite'
    },
    {
      title: 'Full Workup, Not A Questionnaire',
      description: 'Your panel may include cardiovascular risk markers, a complete lipid panel, fasting glucose and insulin with HbA1c, full hormones including free testosterone and estradiol, thyroid function, prolactin, and inflammatory markers, alongside a review of your current medications.',
      icon: 'biotech'
    },
    {
      title: 'We Correct Causes And Treat Symptoms At The Same Time',
      description: 'You should not have to wait months for metabolic correction before your sex life improves. Symptomatic treatment can begin immediately while the underlying work proceeds in parallel. Both, not either.',
      icon: 'swap_horiz'
    },
    {
      title: 'Handled Like Any Other Medical Problem',
      description: 'No jokes, no euphemisms, no locker room framing. This is a clinical consultation with a physician about a physiological finding.',
      icon: 'medical_services'
    }
  ];

  // Signs this could help you
  signs: string[] = [
    'Difficulty achieving an erection, consistently rather than occasionally',
    'Difficulty maintaining one through intercourse',
    'Erections less firm than they used to be',
    'Reduced or absent morning erections — a useful clinical signal, because morning erections are largely involuntary',
    'Reduced libido alongside erectile changes, which suggests a hormonal component',
    'ED that started gradually — gradual onset generally indicates a physical cause',
    'ED alongside fatigue, weight gain, or low motivation',
    'A diagnosis of high blood pressure, high cholesterol, prediabetes, or diabetes',
    'ED that began after starting a new medication',
    'Anxiety about performance that has now become its own problem'
  ];

  // What's included in your care
  included: IncludedItem[] = [
    {
      title: 'Confidential Initial Consultation',
      description: 'Symptom onset and pattern, medical history, current medications, cardiovascular and metabolic risk, and goals. Direct and clinical.',
      icon: 'lock'
    },
    {
      title: 'Comprehensive Diagnostic Panel',
      description: 'Cardiovascular and lipid markers, fasting glucose, insulin and HbA1c, full hormones with free testosterone, estradiol, LH, prolactin, thyroid, and inflammatory markers.',
      icon: 'biotech'
    },
    {
      title: 'Medication Review',
      description: 'Identifying whether a current prescription is contributing and whether alternatives exist, coordinated with your prescribing physician.',
      icon: 'medication'
    },
    {
      title: 'Results Consultation with Dr. Adonis',
      description: 'What is driving it, what is treatable, and what needs attention beyond the ED itself.',
      icon: 'medical_services'
    },
    {
      title: 'Symptomatic Treatment',
      description: 'Selected for your case and your cardiac history, so that function can improve while the underlying work proceeds.',
      icon: 'medical_information'
    },
    {
      title: 'Cause-Directed Treatment',
      description: 'Hormone correction, metabolic and vascular intervention, nutrition and supplementation targeting endothelial function and nitric oxide.',
      icon: 'science'
    },
    {
      title: 'Follow-Up Lab Testing Every Six Months',
      description: 'With treatment adjusted as your markers change.',
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
      description: 'Onset, pattern, morning erections, medications, and cardiovascular history. The details matter diagnostically.',
      icon: 'person'
    },
    {
      number: '2',
      title: 'Testing',
      description: 'Hormonal, metabolic, and cardiovascular markers. Labs can be completed in our office, or locally at any Quest or LabCorp.',
      icon: 'biotech'
    },
    {
      number: '3',
      title: 'Interpretation',
      description: 'Dr. Adonis identifies the dominant contributors and any findings that require attention independent of the ED.',
      icon: 'science'
    },
    {
      number: '4',
      title: 'Results Visit',
      description: 'The full explanation, plus a plan with two tracks — immediate function and underlying cause.',
      icon: 'medical_information'
    },
    {
      number: '5',
      title: 'Treatment Begins',
      description: 'Symptomatic treatment starts now. Cause-directed treatment starts alongside it.',
      icon: 'medication'
    },
    {
      number: '6',
      title: 'Follow-Up',
      description: 'Response assessed, treatment adjusted, and relevant markers rechecked.',
      icon: 'monitor_weight'
    },
    {
      number: '7',
      title: 'Ongoing Management',
      description: 'For metabolic, vascular, or hormonal contributors, this becomes ongoing care rather than a single fix.',
      icon: 'schedule'
    }
  ];

  // Benefits of treatment
  benefits: BenefitCategory[] = [
    {
      title: 'Restored Function And Confidence',
      description: 'The immediate goal, and for most men, achievable.',
      icon: 'man'
    },
    {
      title: 'Cardiovascular Findings Caught Early',
      description: 'Some men learn about lipid, blood pressure, or glucose problems here that nobody had flagged.',
      icon: 'favorite'
    },
    {
      title: 'Hormonal Correction With Broader Effects',
      description: 'When low testosterone contributes, treating it typically improves energy, body composition, and mood alongside sexual function.',
      icon: 'fitness_center'
    },
    {
      title: 'Metabolic Improvement',
      description: 'Addressing insulin resistance benefits weight, energy, and long-term risk, not only erectile function.',
      icon: 'monitor_weight'
    },
    {
      title: 'Reduced Performance Anxiety',
      description: 'Restored reliability tends to resolve the anxiety that developed around it.',
      icon: 'self_improvement'
    },
    {
      title: 'Relationship Strain Relieved',
      description: 'Frequently mentioned, rarely written about.',
      icon: 'spa'
    },
    {
      title: 'Medication Problems Identified',
      description: 'Sometimes the answer is a different prescription for an unrelated condition.',
      icon: 'medication'
    }
  ];

  // Who this is for
  candidatePoints: string[] = [
    'Have persistent erectile difficulty rather than occasional',
    'Want to know the cause, not just get a prescription',
    'Have cardiovascular or metabolic risk factors alongside ED',
    'Have used ED medication without adequate results',
    'Have low libido along with erectile changes',
    'Want treatment managed by a physician who reviews your full picture'
  ];

  nonCandidatePoints: string[] = [
    'Want a prescription with no evaluation. Not what we do.',
    'Have ED clearly following pelvic surgery, spinal injury, or prostate treatment. Urology is usually the right specialty, and we will say so.',
    'Take nitrates for heart conditions. This is an absolute contraindication for PDE5 inhibitors and requires a different approach.',
    'Have ED that is clearly situational and psychological in origin. Therapy is likely to help more than we will, and we will refer.',
    'Have unstable cardiovascular disease. Sexual activity carries cardiac demand and needs cardiology clearance first.'
  ];

  // Frequently asked questions
  faqs: FaqItem[] = [
    {
      question: 'Is ED a sign of heart disease?',
      answer: 'It can be an early one. The arteries supplying erectile tissue are narrower than the coronary arteries, so endothelial dysfunction often shows there first. That is why our workup includes cardiovascular and metabolic markers rather than hormones alone.',
      isOpen: false
    },
    {
      question: 'Can’t I just get a prescription online?',
      answer: 'You can. What you will not get is an explanation. If your ED is driven by low testosterone, insulin resistance, or early vascular disease, a PDE5 inhibitor manages the evening and leaves the cause running.',
      isOpen: false
    },
    {
      question: 'Will testosterone therapy fix my ED?',
      answer: 'It helps when low testosterone is a contributor, particularly for libido. But testosterone alone does not resolve ED with a primarily vascular cause. Testing tells us which you are dealing with.',
      isOpen: false
    },
    {
      question: 'What treatments do you offer?',
      answer: 'Treatment is selected based on what your workup shows is driving the problem, your cardiovascular status, and your current medications. Most patients receive something that works immediately alongside treatment aimed at the underlying cause.',
      isOpen: false
    },
    {
      question: 'Is this confidential?',
      answer: 'Yes. This is a private cash-pay practice, and your care is not reported to an insurer.',
      isOpen: false
    },
    {
      question: 'How quickly will I see results?',
      answer: 'Symptomatic treatments often work from the first use. Hormonal and metabolic corrections take weeks to months and are what change the underlying situation.',
      isOpen: false
    },
    {
      question: 'Does ED medication have side effects?',
      answer: 'PDE5 inhibitors commonly cause headache, flushing, nasal congestion, and indigestion. They are absolutely contraindicated with nitrates. We review your medications and cardiac history before prescribing anything.',
      isOpen: false
    },
    {
      question: 'I’m in my thirties. Is this normal?',
      answer: 'ED in younger men is more common than most assume and more likely to have an identifiable, correctable cause — metabolic, hormonal, medication-related, or psychological. It is worth investigating rather than waiting out.',
      isOpen: false
    },
    {
      question: 'Can I be seen by telehealth?',
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
    const url = `${origin}/erectile-dysfunction`;
    const isEs = this.currentLang === 'es';

    const title = isEs
      ? 'Tratamiento de la Disfunción Eréctil en Miami | Atención de Causa Raíz con el Dr. Adonis Maiquez, MD'
      : 'Erectile Dysfunction Treatment Miami | Root-Cause ED Care with Dr. Adonis Maiquez, MD';

    const description = isEs
      ? 'Tratamiento de la disfunción eréctil dirigido por un médico en Miami. Investigamos las causas vasculares, hormonales y metabólicas de la DE en lugar de recetar a su alrededor.'
      : 'Physician-led ED treatment in Miami. We investigate the vascular, hormonal, and metabolic causes behind ED rather than prescribing around them.';

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
        name: 'Erectile Dysfunction',
        relevantSpecialty: ['Functional Medicine', 'Urology', 'Endocrinology']
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
