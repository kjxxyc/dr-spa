import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { SeoService } from '../../../shared/seo/seo.service';

export interface PatternItem {
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
  selector: 'app-hashimotos',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    TranslateModule
  ],
  templateUrl: './hashimotos.component.html',
  styleUrls: ['./hashimotos.component.scss']
})
export class HashimotosComponent implements OnInit, OnDestroy {
  private langSub?: Subscription;
  currentLang = 'en';

  // Patterns worth understanding about the condition
  patterns: PatternItem[] = [
    {
      name: 'Antibodies Come First',
      category: 'The Diagnostic Gap',
      description: 'Antibodies frequently appear years, sometimes a decade, before thyroid hormone levels drop far enough to trigger a diagnosis. During that window patients feel unwell, get tested, and are told their thyroid is fine, because nobody ordered antibodies.'
    },
    {
      name: 'The Swing Pattern',
      category: 'Often Misread',
      description: 'As the gland is damaged, stored hormone is released in bursts, so patients cycle between hyperthyroid-feeling periods of anxiety and racing heart and hypothyroid-feeling periods of exhaustion. That instability is often misread as anxiety or a mood disorder.'
    },
    {
      name: 'Genetics, Trigger, Permeability',
      category: 'Why It Started',
      description: 'Autoimmune conditions do not appear from nowhere. Research consistently points to a combination of genetic susceptibility, an environmental trigger, and increased intestinal permeability. You cannot change your genetics. The other two are addressable.'
    }
  ];

  // Our approach
  pillars: ApproachPillar[] = [
    {
      title: 'We Test Antibodies, Not Just Hormone',
      description: 'Thyroid peroxidase and thyroglobulin antibodies establish that this is autoimmune. Without them, you are treating a slow thyroid without knowing why it is slowing, and the treatment plan looks entirely different as a result.',
      icon: 'biotech'
    },
    {
      title: 'We Look For What Triggered It',
      description: 'Common contributors include gut permeability and dysbiosis, chronic infection, significant stress, nutrient deficiencies particularly selenium, vitamin D, zinc, and iron, environmental toxin and heavy metal exposure, and in some patients, gluten. We investigate rather than assume, because the trigger differs by person.',
      icon: 'science'
    },
    {
      title: 'We Treat The Gut Alongside The Thyroid',
      description: 'Roughly seventy percent of immune tissue sits in the gut lining. Increased intestinal permeability is repeatedly implicated in autoimmune activation, and Hashimoto’s patients frequently have digestive symptoms nobody connected to their thyroid.',
      icon: 'restaurant'
    },
    {
      title: 'We Replace Hormone Where It Is Needed',
      description: 'None of the above means declining medication. If your gland is not producing enough, you need replacement, and you may need it permanently. What changes is that replacement becomes one part of the plan instead of the whole plan.',
      icon: 'medication'
    },
    {
      title: 'We Watch For Company',
      description: 'Autoimmune conditions cluster. Patients with Hashimoto’s have elevated rates of celiac disease, pernicious anemia, and other autoimmune conditions, and we screen accordingly rather than waiting for the second diagnosis to announce itself.',
      icon: 'health_and_safety'
    }
  ];

  // Signs this could help you
  signs: string[] = [
    'Diagnosed with hypothyroidism but never tested for antibodies',
    'Known Hashimoto’s, on medication, still symptomatic',
    'Thyroid levels that fluctuate, requiring repeated dose changes',
    'Alternating periods of anxiety and exhaustion',
    'Fatigue that medication improved but did not resolve',
    'Weight gain that persists despite treated thyroid levels',
    'Brain fog, poor recall, difficulty concentrating',
    'Neck fullness, pressure, or difficulty swallowing',
    'Joint pain, muscle aches, and stiffness',
    'Digestive symptoms alongside your thyroid symptoms',
    'Hair loss continuing despite treatment',
    'Another autoimmune diagnosis, or a strong family history',
    'Told your antibodies are elevated and simply to monitor'
  ];

  // What's included in your care
  included: IncludedItem[] = [
    {
      title: 'Initial Comprehensive Consultation',
      description: 'Symptom history and timeline, prior thyroid treatment, digestive history, stress and illness history, environmental exposures, and family autoimmune history.',
      icon: 'person'
    },
    {
      title: 'Complete Thyroid & Autoimmune Panel',
      description: 'TSH, free T4, free T3, reverse T3, thyroid peroxidase and thyroglobulin antibodies, ferritin and iron studies, vitamin D, B12, selenium, zinc, inflammatory markers, celiac screening, and additional autoimmune markers where indicated.',
      icon: 'biotech'
    },
    {
      title: 'Gut & Trigger Assessment',
      description: 'Testing for intestinal permeability, dysbiosis, food sensitivities, and toxin or heavy metal exposure where your history suggests it.',
      icon: 'restaurant'
    },
    {
      title: 'Results Consultation with Dr. Adonis',
      description: 'What your antibodies mean, what appears to be driving the immune activity, and the sequence in which we address it.',
      icon: 'medical_services'
    },
    {
      title: 'Your Treatment Protocol',
      description: 'Thyroid hormone replacement where indicated, immune and inflammatory support, gut repair, targeted nutrient correction, and an anti-inflammatory nutrition plan built for your findings.',
      icon: 'medication'
    },
    {
      title: 'Follow-Up Lab Testing Every Six Months',
      description: 'Tracking both thyroid function and antibody levels.',
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
      description: 'Your full history, including when you first stopped feeling well rather than when you were diagnosed. Those dates are usually years apart and the gap is informative.',
      icon: 'person'
    },
    {
      number: '2',
      title: 'Testing',
      description: 'Thyroid function, antibodies, nutrients, inflammation, and trigger investigation. Labs can be completed in our office, or locally at any Quest or LabCorp.',
      icon: 'biotech'
    },
    {
      number: '3',
      title: 'Interpretation',
      description: 'Dr. Adonis assesses how much thyroid function remains, how active the immune attack is, and what appears to be driving it.',
      icon: 'science'
    },
    {
      number: '4',
      title: 'Results Consultation',
      description: 'Your antibody levels explained, the likely triggers identified, and a plan that treats both the hormone deficit and the immune activity.',
      icon: 'medical_information'
    },
    {
      number: '5',
      title: 'Treatment Begins',
      description: 'Hormone replacement where indicated, together with gut repair, nutrient correction, and dietary changes targeting inflammation.',
      icon: 'medication'
    },
    {
      number: '6',
      title: 'Follow-Up Testing Every Six Months',
      description: 'Thyroid levels and antibodies both rechecked. Falling antibodies indicate the immune activity is calming.',
      icon: 'schedule'
    }
  ];

  // Benefits of root-cause Hashimoto's care
  benefits: BenefitCategory[] = [
    {
      title: 'Reduced Antibody Levels',
      description: 'Many patients see antibodies fall as triggers are removed and inflammation is controlled. This is the marker conventional care rarely tracks.',
      icon: 'monitor_weight'
    },
    {
      title: 'More Stable Thyroid Levels',
      description: 'Fewer swings, fewer dose changes, fewer weeks of feeling wrong before the next adjustment.',
      icon: 'swap_horiz'
    },
    {
      title: 'Symptom Relief Beyond Medication Alone',
      description: 'Particularly fatigue, brain fog, and joint pain.',
      icon: 'fitness_center'
    },
    {
      title: 'Improved Digestion',
      description: 'Frequently the first thing to change, since gut repair usually starts early.',
      icon: 'restaurant'
    },
    {
      title: 'Better Response To Thyroid Medication',
      description: 'Correcting selenium, iron, zinc, and inflammation improves how well replacement actually works.',
      icon: 'medication'
    },
    {
      title: 'Reduced Inflammation Overall',
      description: 'Joint pain, skin problems, and general achiness commonly improve together.',
      icon: 'self_improvement'
    },
    {
      title: 'Slower Progression',
      description: 'Reducing immune activity aims to protect the thyroid tissue you still have.',
      icon: 'health_and_safety'
    },
    {
      title: 'Additional Autoimmune Risk Addressed',
      description: 'Screening and immune support rather than waiting for a second diagnosis.',
      icon: 'science'
    }
  ];

  // Who this is for
  candidatePoints: string[] = [
    'Have Hashimoto’s and want more than hormone replacement',
    'Have elevated antibodies and were told only to monitor',
    'Are on medication and still have symptoms',
    'Have digestive symptoms alongside thyroid symptoms',
    'Have another autoimmune condition or a strong family history',
    'Are willing to make real dietary changes — this is not optional in autoimmune care'
  ];

  nonCandidatePoints: string[] = [
    'Want medication adjustment only, with no dietary or lifestyle change',
    'Have a thyroid nodule or mass requiring biopsy or surgical evaluation',
    'Have had your thyroid removed. Hormone management is still appropriate, but immune-directed treatment aimed at protecting the gland no longer applies in the same way.',
    'Expect antibodies to normalize on a fixed timeline. They often improve. We cannot promise it.',
    'Are looking for a cure. Hashimoto’s is managed, sometimes very well. It is not cured.'
  ];

  // Frequently asked questions
  faqs: FaqItem[] = [
    {
      question: 'Can Hashimoto’s be reversed?',
      answer: 'Hashimoto’s is a chronic autoimmune condition and we do not describe it as reversible. What can change is how active the immune attack is and how well you feel. Many patients see antibody levels fall and symptoms improve substantially. Thyroid tissue already destroyed does not regenerate, which is why early intervention matters.',
      isOpen: false
    },
    {
      question: 'Why does my doctor not test antibodies?',
      answer: 'Because in conventional practice the result often would not change the treatment. If the plan is hormone replacement either way, the antibody result is informational. In our approach it changes the plan entirely, so we order it.',
      isOpen: false
    },
    {
      question: 'Do I have to go gluten-free?',
      answer: 'Gluten is a common trigger in autoimmune thyroid disease and there is a documented association with celiac disease. Whether it matters for you specifically is something testing and a structured trial can establish. We do not apply a blanket rule without evidence for it.',
      isOpen: false
    },
    {
      question: 'Will I still need thyroid medication?',
      answer: 'Probably, and possibly permanently. Damaged thyroid tissue does not come back. What root-cause treatment aims to change is how much further damage occurs and how well you feel on your dose.',
      isOpen: false
    },
    {
      question: 'My antibodies are high but my thyroid levels are normal. Is that a problem?',
      answer: 'It is an early finding worth acting on. Elevated antibodies with normal hormone levels means the immune attack is underway and the gland is still compensating. This is the most useful moment to intervene.',
      isOpen: false
    },
    {
      question: 'How long until I feel different?',
      answer: 'Most patients report meaningful change within 90 days. Antibody levels typically move more slowly than symptoms.',
      isOpen: false
    },
    {
      question: 'Can this be managed by telehealth?',
      answer: 'Yes, for patients located in Florida. Labs can be completed in our office, or locally at any Quest or LabCorp.',
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
    const url = `${origin}/functional-medicine/hashimotos`;
    const isEs = this.currentLang === 'es';

    const title = isEs
      ? 'Tratamiento de Hashimoto en Miami | Atención Tiroidea Autoinmune de Causa Raíz — Dr. Adonis Maiquez, MD'
      : 'Hashimoto’s Treatment Miami | Root-Cause Autoimmune Thyroid Care — Dr. Adonis Maiquez, MD';

    const description = isEs
      ? 'La tiroiditis de Hashimoto es una condición inmunitaria, no solo tiroidea. Tratamos los anticuerpos y los desencadenantes, no solo la hormona en descenso. Miami y telemedicina en Florida.'
      : 'Hashimoto’s is an immune condition, not just a thyroid one. We treat the antibodies and the triggers, not only the falling hormone. Miami and Florida telehealth.';

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
        name: 'Hashimoto’s Thyroiditis',
        alternateName: 'Chronic Lymphocytic Thyroiditis',
        relevantSpecialty: ['Functional Medicine', 'Endocrinology', 'Immunology']
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
