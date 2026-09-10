import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { SeoService } from '../../../shared/seo/seo.service';

export interface ChainLinkItem {
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
  selector: 'app-thyroid',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    TranslateModule
  ],
  templateUrl: './thyroid.component.html',
  styleUrls: ['./thyroid.component.scss']
})
export class ThyroidComponent implements OnInit, OnDestroy {
  private langSub?: Subscription;
  currentLang = 'en';

  // The four places the chain can break
  chainLinks: ChainLinkItem[] = [
    {
      name: 'The Signal',
      category: 'Pituitary — TSH',
      description: 'TSH is a pituitary hormone. It measures the signal being sent, not the hormone being produced, converted, or received. Testing TSH alone to assess thyroid function is like judging a delivery by checking whether the order was placed.'
    },
    {
      name: 'Production',
      category: 'The Gland — T4',
      description: 'Your thyroid mainly produces T4, which is largely inactive. Autoimmune attack is the most common reason production falls, and antibodies frequently show up years before hormone levels move.'
    },
    {
      name: 'Conversion',
      category: 'Liver, Kidneys & Gut — T4 to T3',
      description: 'T4 has to convert into T3, the form your cells actually use, and that happens outside the thyroid. Under chronic stress, inflammation, nutrient deficiency, or illness, the body converts T4 into reverse T3 instead.'
    },
    {
      name: 'Reception',
      category: 'The Receptor',
      description: 'Reverse T3 occupies the receptor without activating it. A person can have a normal TSH, adequate T4, and still be functionally hypothyroid. That patient will be told nothing is wrong.'
    }
  ];

  // Our approach
  pillars: ApproachPillar[] = [
    {
      title: 'We Run The Full Panel, Not TSH',
      description: 'Your panel may include TSH, free T4, free T3, reverse T3, thyroid peroxidase antibodies, thyroglobulin antibodies, ferritin, iron, vitamin D, B12, selenium, zinc, and inflammatory markers. Labs can be completed in our office, or locally at any Quest or LabCorp.',
      icon: 'biotech'
    },
    {
      title: 'We Check Antibodies On Every Patient',
      description: 'The most common cause of hypothyroidism is autoimmune, and antibodies frequently show up years before thyroid hormone levels move. Finding them early changes the entire treatment plan, because the problem is then an immune system attacking the gland rather than a gland that quit.',
      icon: 'health_and_safety'
    },
    {
      title: 'We Read Optimal, Not Just Normal',
      description: 'Reference ranges describe the population that walked into the lab, which includes a great many people with undiagnosed thyroid disease. A free T3 at the bottom edge of range, next to elevated reverse T3 and low ferritin, tells a story that no single value tells alone.',
      icon: 'monitor_weight'
    },
    {
      title: 'We Treat The Reason It Broke',
      description: 'Low ferritin impairs conversion. So does low selenium and zinc, chronic cortisol elevation, gut inflammation, and insulin resistance. Prescribing thyroid hormone while those remain uncorrected means chasing dose increases that never quite work.',
      icon: 'science'
    }
  ];

  // Signs thyroid testing could help you
  signs: string[] = [
    'Fatigue that sleep does not touch',
    'Weight gain, or weight that will not move regardless of effort',
    'Cold hands and feet, or being cold when nobody else is',
    'Hair thinning, particularly at the outer eyebrows',
    'Dry skin, brittle nails, hair that breaks',
    'Brain fog, poor recall, slow processing',
    'Constipation',
    'Low mood or depression that has not responded to treatment',
    'Heavy or irregular periods, or difficulty conceiving',
    'Muscle aches, joint stiffness, slow recovery from exercise',
    'A puffy face, or swelling around the eyes',
    'Elevated cholesterol without an obvious cause',
    'Family history of thyroid or autoimmune disease'
  ];

  // What's included in your care
  included: IncludedItem[] = [
    {
      title: 'Initial Comprehensive Consultation',
      description: 'Full symptom history, timeline, prior thyroid testing and treatment, family history, and the other systems that affect thyroid function.',
      icon: 'person'
    },
    {
      title: 'Complete Thyroid & Nutrient Panel',
      description: 'TSH, free T4, free T3, reverse T3, thyroid antibodies, ferritin and iron studies, vitamin D, B12, selenium, zinc, and inflammatory and metabolic markers.',
      icon: 'biotech'
    },
    {
      title: 'Results Consultation with Dr. Adonis',
      description: 'Where the chain is breaking, why, and what we are doing about each part of it.',
      icon: 'medical_services'
    },
    {
      title: 'Your Treatment Protocol',
      description: 'Thyroid hormone replacement where indicated, including T3-containing options when conversion is the problem, alongside correction of the nutrient, inflammatory, and adrenal findings driving it.',
      icon: 'medication'
    },
    {
      title: 'Nutrition & Lifestyle Direction',
      description: 'Targeted to what your labs show.',
      icon: 'restaurant'
    },
    {
      title: 'Follow-Up Lab Testing Every Six Months',
      description: 'With dose adjusted against both your numbers and your symptoms.',
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
      description: 'Your symptoms, your history, and every thyroid test you have already had. Bring old labs if you have them. The trend over years is often more informative than one snapshot.',
      icon: 'person'
    },
    {
      number: '2',
      title: 'Testing',
      description: 'Full panel. Labs can be completed in our office, or locally at any Quest or LabCorp.',
      icon: 'biotech'
    },
    {
      number: '3',
      title: 'Interpretation',
      description: 'Dr. Adonis identifies where in the chain the problem sits: production, conversion, autoimmunity, or a nutrient bottleneck.',
      icon: 'science'
    },
    {
      number: '4',
      title: 'Results Consultation',
      description: 'Every value explained. What is causing your symptoms, what we are correcting, and in what order.',
      icon: 'medical_information'
    },
    {
      number: '5',
      title: 'Treatment Begins',
      description: 'Hormone replacement where indicated, plus the nutrient and inflammatory corrections that determine whether it works.',
      icon: 'medication'
    },
    {
      number: '6',
      title: 'Follow-Up Testing Every Six Months',
      description: 'Levels and symptoms reviewed together, with dose adjusted as needed.',
      icon: 'schedule'
    }
  ];

  // Benefits of proper thyroid treatment
  benefits: BenefitCategory[] = [
    {
      title: 'Energy That Holds Through The Day',
      description: 'The change patients notice first and comment on most.',
      icon: 'fitness_center'
    },
    {
      title: 'Mental Clarity',
      description: 'Fog lifting, recall improving, processing speed returning.',
      icon: 'science'
    },
    {
      title: 'Weight That Responds Again',
      description: 'Thyroid sets metabolic rate. When it is corrected, effort starts producing results.',
      icon: 'monitor_weight'
    },
    {
      title: 'Temperature Regulation',
      description: 'Being cold all the time is a symptom, not a personality trait.',
      icon: 'health_and_safety'
    },
    {
      title: 'Hair, Skin & Nails',
      description: 'Slower to change, but they do change.',
      icon: 'spa'
    },
    {
      title: 'Mood Stability',
      description: 'Thyroid dysfunction produces depression and anxiety that antidepressants alone often fail to resolve.',
      icon: 'favorite'
    },
    {
      title: 'Digestive Regularity',
      description: 'Slow thyroid slows the gut.',
      icon: 'restaurant'
    },
    {
      title: 'Cardiovascular Markers',
      description: 'Hypothyroidism raises cholesterol. Correcting it frequently improves the lipid panel without a statin.',
      icon: 'self_improvement'
    }
  ];

  // Who this is for
  candidatePoints: string[] = [
    'Have thyroid symptoms and have only ever had TSH tested',
    'Have been told your thyroid is normal but do not feel it',
    'Are on thyroid medication and still symptomatic',
    'Have thyroid antibodies with no treatment plan beyond monitoring',
    'Have a family history and want to catch it early',
    'Are willing to address nutrition and the other drivers alongside medication'
  ];

  nonCandidatePoints: string[] = [
    'Have a thyroid nodule or mass requiring biopsy or surgical evaluation. That needs endocrinology and surgical care, and we will refer.',
    'Have thyroid cancer under active treatment',
    'Have severe hyperthyroidism or thyroid storm symptoms. This is urgent and requires emergency care.',
    'Want a prescription without testing. We do not treat the thyroid blind.',
    'Are unwilling to change anything about diet or nutrient status'
  ];

  // Frequently asked questions
  faqs: FaqItem[] = [
    {
      question: 'My TSH is normal. Can I still have a thyroid problem?',
      answer: 'Yes, and this is one of the most common situations we see. TSH measures the pituitary signal, not what your cells receive. Poor T4-to-T3 conversion, elevated reverse T3, and early autoimmune activity all occur with a TSH inside range.',
      isOpen: false
    },
    {
      question: 'What is reverse T3 and why does it matter?',
      answer: 'Reverse T3 is an inactive form your body produces from T4 under stress, illness, inflammation, or nutrient deficiency. It binds thyroid receptors without activating them. Elevated reverse T3 means hormone is present but not working, which is why some patients feel hypothyroid on paper-perfect labs.',
      isOpen: false
    },
    {
      question: 'I’m already on levothyroxine and still feel terrible. Why?',
      answer: 'Levothyroxine is T4. If your problem is conversion rather than production, adding more T4 does not fix it and can increase reverse T3. This is where a full panel changes treatment, and it is a common reason patients arrive here.',
      isOpen: false
    },
    {
      question: 'Do you use natural desiccated thyroid or T3?',
      answer: 'Treatment is selected based on what your labs show. When conversion is the bottleneck, a T3-containing option is often more appropriate than T4 alone.',
      isOpen: false
    },
    {
      question: 'How often will my levels be checked?',
      answer: 'We do follow-up lab testing every six months, and you can call or text the clinic at any time between visits if something changes.',
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
    },
    {
      question: 'Will I be on thyroid medication forever?',
      answer: 'It depends on the cause. Autoimmune destruction of the gland generally requires ongoing replacement. Dysfunction driven by nutrient deficiency, stress physiology, or gut inflammation sometimes improves substantially once those are corrected.',
      isOpen: false
    },
    {
      question: 'Does Dr. Adonis speak Spanish?',
      answer: 'Yes. Consultations are available in English and Spanish.',
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
    const url = `${origin}/functional-medicine/thyroid`;
    const isEs = this.currentLang === 'es';

    const title = isEs
      ? 'Tratamiento de Tiroides en Miami | Panel Tiroideo Completo y Atención de Causa Raíz — Dr. Adonis Maiquez, MD'
      : 'Thyroid Treatment Miami | Full Thyroid Panel & Root-Cause Care — Dr. Adonis Maiquez, MD';

    const description = isEs
      ? 'La mayoría de la atención tiroidea se detiene en la TSH. Evaluamos la función tiroidea completa y tratamos las razones por las que dejó de funcionar. Atención en Miami y telemedicina en Florida.'
      : 'Most thyroid care stops at TSH. We run full thyroid function and treat the reasons it stopped working. Physician-led thyroid care in Miami and by telehealth in Florida.';

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
        name: 'Thyroid Dysfunction',
        alternateName: ['Hypothyroidism', 'Hyperthyroidism'],
        relevantSpecialty: ['Functional Medicine', 'Endocrinology']
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
