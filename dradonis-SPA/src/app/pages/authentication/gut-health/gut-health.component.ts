import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { SeoService } from '../../../shared/seo/seo.service';

export interface DysfunctionItem {
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
  selector: 'app-gut-health',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    TranslateModule
  ],
  templateUrl: './gut-health.component.html',
  styleUrls: ['./gut-health.component.scss']
})
export class GutHealthComponent implements OnInit, OnDestroy {
  private langSub?: Subscription;
  currentLang = 'en';

  // The dysfunctions we most often find
  dysfunctions: DysfunctionItem[] = [
    {
      name: 'Dysbiosis',
      category: 'Microbiome Imbalance',
      description: 'The bacterial population has shifted. Beneficial species are reduced, less helpful ones have expanded. This affects digestion, immune signaling, and inflammation.'
    },
    {
      name: 'SIBO',
      category: 'Small Intestinal Overgrowth',
      description: 'Bacteria that belong in the large intestine have colonized the small intestine, where they ferment food before you absorb it. Classic presentation is bloating that worsens through the day and reacts to fiber and healthy foods.'
    },
    {
      name: 'Increased Intestinal Permeability',
      category: 'Barrier Dysfunction',
      description: 'The barrier has loosened, allowing partially digested proteins and bacterial components into circulation, where they provoke immune responses. Implicated across autoimmune and inflammatory conditions.'
    },
    {
      name: 'Low Stomach Acid or Enzyme Insufficiency',
      category: 'Digestive Capacity',
      description: 'Food is not being broken down adequately, which causes reflux more often than people expect and leaves nutrients unabsorbed.'
    },
    {
      name: 'Food Sensitivities',
      category: 'Immune Reactivity',
      description: 'Immune reactivity to specific foods, distinct from allergy, often delayed by hours or days and therefore difficult to identify without testing.'
    }
  ];

  // Our approach
  pillars: ApproachPillar[] = [
    {
      title: 'We Test Rather Than Guess',
      description: 'Elimination diets by trial and error can take months and often end with a patient eating fifteen foods and still feeling unwell. Comprehensive stool analysis, permeability markers, SIBO breath testing where indicated, and food sensitivity panels shorten that enormously.',
      icon: 'biotech'
    },
    {
      title: 'We Follow A Sequence',
      description: 'Order matters in gut work. Remove what should not be there, replace what digestion requires, restore the bacterial population, and repair the lining. Introducing probiotics into an untreated overgrowth frequently makes patients feel worse, which is why sequence is not a detail.',
      icon: 'swap_horiz'
    },
    {
      title: 'We Connect The Gut To Your Other Symptoms',
      description: 'Patients frequently arrive for bloating and mention almost as an afterthought that they are exhausted, foggy, and their skin has been bad for two years. Those are often the same problem. Malabsorption produces nutrient deficiency. Permeability produces systemic inflammation. Dysbiosis affects neurotransmitter production.',
      icon: 'health_and_safety'
    },
    {
      title: 'We Rule Out What Needs Ruling Out',
      description: 'Blood in the stool, unintentional weight loss, difficulty swallowing, persistent vomiting, or a family history of colon cancer means gastroenterology and appropriate imaging or endoscopy. We refer rather than work around it.',
      icon: 'medical_services'
    }
  ];

  // Signs this could help you
  signs: string[] = [
    'Bloating, particularly worsening through the day',
    'Gas, cramping, or abdominal discomfort after eating',
    'Constipation, diarrhea, or alternating between them',
    'Reflux or heartburn, whether or not medication helps',
    'A list of trigger foods that keeps getting longer',
    'Feeling worse after eating vegetables, fiber, or fermented foods',
    'Fatigue after meals',
    'Brain fog that tracks with what you ate',
    'Skin problems — acne, eczema, rosacea',
    'Joint pain without an injury',
    'Nutrient deficiencies despite a reasonable diet',
    'Anxiety or mood changes alongside digestive symptoms',
    'Diagnosed with IBS and given no explanation of cause',
    'Digestive symptoms that began after antibiotics, food poisoning, or a stressful period'
  ];

  // What's included in your care
  included: IncludedItem[] = [
    {
      title: 'Initial Comprehensive Consultation',
      description: 'Symptom history and timeline, diet, what preceded onset, antibiotic and medication history, travel and infection history, stress, and every prior workup.',
      icon: 'person'
    },
    {
      title: 'Comprehensive Digestive Testing',
      description: 'Microbiome composition, pathogenic bacteria, yeast and parasites, digestive enzyme markers, intestinal inflammation, permeability, food sensitivities, and nutrient status. SIBO breath testing where indicated.',
      icon: 'biotech'
    },
    {
      title: 'Results Consultation with Dr. Adonis',
      description: 'What is actually happening in your gut, what caused it, and the sequence in which we will correct it.',
      icon: 'medical_services'
    },
    {
      title: 'Your Treatment Protocol',
      description: 'Antimicrobial or antifungal treatment where indicated, enzyme and acid support, targeted probiotic and prebiotic therapy at the appropriate stage, gut lining repair nutrients, and a nutrition plan built for your findings.',
      icon: 'medication'
    },
    {
      title: 'Nutrient Correction',
      description: 'Malabsorption creates deficiencies, and correcting them is part of the treatment rather than an afterthought.',
      icon: 'restaurant'
    },
    {
      title: 'Follow-Up Lab Testing Every Six Months',
      description: 'Confirming that the microbiome and inflammatory markers have moved.',
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
      description: 'Your symptoms, your diet, and what changed before this started. Antibiotics, a bout of food poisoning, a period of intense stress — those details frequently identify the origin.',
      icon: 'person'
    },
    {
      number: '2',
      title: 'Testing',
      description: 'Comprehensive stool analysis and the additional testing your presentation calls for. Labs can be completed in our office, or locally at any Quest or LabCorp.',
      icon: 'biotech'
    },
    {
      number: '3',
      title: 'Interpretation',
      description: 'Dr. Adonis identifies which dysfunctions are present and which is driving the others.',
      icon: 'science'
    },
    {
      number: '4',
      title: 'Results Consultation',
      description: 'Findings explained plainly, with a sequenced protocol and an explanation of why we start where we start.',
      icon: 'medical_information'
    },
    {
      number: '5',
      title: 'Treatment Begins',
      description: 'Typically clearing overgrowth and supporting digestion first, then restoring bacterial balance, then repairing the lining.',
      icon: 'medication'
    },
    {
      number: '6',
      title: 'Follow-Up Testing Every Six Months',
      description: 'Confirming the changes held.',
      icon: 'schedule'
    }
  ];

  // Benefits of gut treatment
  benefits: BenefitCategory[] = [
    {
      title: 'Digestive Comfort',
      description: 'Reduced bloating, gas, cramping, and urgency.',
      icon: 'spa'
    },
    {
      title: 'Regularity',
      description: 'Predictable, comfortable bowel function.',
      icon: 'schedule'
    },
    {
      title: 'A Wider Diet',
      description: 'Many patients get foods back as reactivity settles, which is often the change they value most.',
      icon: 'restaurant'
    },
    {
      title: 'Energy',
      description: 'Improved absorption and reduced inflammatory load.',
      icon: 'fitness_center'
    },
    {
      title: 'Mental Clarity',
      description: 'Brain fog frequently improves alongside gut inflammation.',
      icon: 'science'
    },
    {
      title: 'Skin',
      description: 'Acne, eczema, and rosacea often track with gut status.',
      icon: 'self_improvement'
    },
    {
      title: 'Mood',
      description: 'The gut manufactures neurotransmitters and signals directly to the brain.',
      icon: 'favorite'
    },
    {
      title: 'Reduced Systemic Inflammation',
      description: 'Which matters for joint pain, autoimmune activity, and long-term risk.',
      icon: 'health_and_safety'
    },
    {
      title: 'Nutrient Status Restored',
      description: 'Deficiencies caused by malabsorption resolve once absorption improves.',
      icon: 'medical_information'
    }
  ];

  // Who this is for
  candidatePoints: string[] = [
    'Have chronic digestive symptoms without a satisfying explanation',
    'Were diagnosed with IBS and given no cause',
    'Have an expanding list of foods you cannot eat',
    'Have digestive symptoms alongside fatigue, skin, or joint problems',
    'Have an autoimmune condition — gut work is central to autoimmune care',
    'Have had a normal endoscopy or colonoscopy and still have symptoms',
    'Are prepared to follow dietary changes for a defined period'
  ];

  nonCandidatePoints: string[] = [
    'Have blood in your stool, unexplained weight loss, difficulty swallowing, or persistent vomiting. These require gastroenterology evaluation first, and we will refer.',
    'Have inflammatory bowel disease in an active flare. That needs gastroenterology management, though we can work alongside it once stable.',
    'Have a family history of colon cancer and are overdue for screening. Get screened first.',
    'Want a supplement protocol without testing',
    'Are unwilling to change your diet at all'
  ];

  // Frequently asked questions
  faqs: FaqItem[] = [
    {
      question: 'My colonoscopy was normal. Why do I still have symptoms?',
      answer: 'A colonoscopy looks for structural disease — inflammation, ulceration, growths. It is excellent at that and it does not assess your microbiome, enzyme output, barrier integrity, or food reactivity. A normal result rules out serious pathology. It does not explain your symptoms.',
      isOpen: false
    },
    {
      question: 'Is IBS a real diagnosis?',
      answer: 'IBS describes a pattern of symptoms after other causes are excluded. It names what you are experiencing rather than why. In our experience a meaningful proportion of IBS patients have identifiable dysbiosis, SIBO, or food sensitivity underneath the label.',
      isOpen: false
    },
    {
      question: 'Should I just take a probiotic?',
      answer: 'Not before testing. Probiotics help in some situations and worsen others, particularly with untreated small intestinal overgrowth. Sequence and strain selection matter more than most people are told.',
      isOpen: false
    },
    {
      question: 'How long do I need to avoid foods?',
      answer: 'Elimination is usually a defined phase, not a permanent state. The aim is to reduce reactivity, repair the lining, and reintroduce systematically. Many patients get most of their diet back.',
      isOpen: false
    },
    {
      question: 'Is leaky gut a real thing?',
      answer: 'Increased intestinal permeability is a measurable, well-documented physiological phenomenon studied across a range of inflammatory and autoimmune conditions. The popular term is loose. The mechanism is real and testable.',
      isOpen: false
    },
    {
      question: 'How long until I feel better?',
      answer: 'Most patients report meaningful change within 90 days. Some symptoms move within weeks; microbiome and lining restoration take longer.',
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
    const url = `${origin}/gut-health`;
    const isEs = this.currentLang === 'es';

    const title = isEs
      ? 'Salud Intestinal en Miami | Atención Digestiva de Causa Raíz — Dr. Adonis Maiquez, MD'
      : 'Gut Health Treatment Miami | Root-Cause Digestive Care — Dr. Adonis Maiquez, MD';

    const description = isEs
      ? 'Medicina funcional para la salud intestinal en Miami. Pruebas completas de disbiosis, permeabilidad y sensibilidad alimentaria, con un protocolo que repara en lugar de suprimir. Telemedicina en Florida.'
      : 'Functional medicine gut care in Miami. Comprehensive testing for dysbiosis, permeability, and food sensitivity, with a protocol that repairs rather than suppresses. Florida telehealth.';

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
        name: 'Digestive and Gut Health Disorders',
        relevantSpecialty: ['Functional Medicine', 'Gastroenterology', 'Nutrition']
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
