import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { SeoService } from '../../../shared/seo/seo.service';

/** A child service page surfaced as a card on this hub page. */
export interface ServiceAreaItem {
  name: string;
  category: string;
  description: string;
  linkText: string;
  linkUrl: string;
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
  selector: 'app-functional-medicine',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    TranslateModule
  ],
  templateUrl: './functional-medicine.component.html',
  styleUrls: ['./functional-medicine.component.scss']
})
export class FunctionalMedicineComponent implements OnInit, OnDestroy {
  private langSub?: Subscription;
  currentLang = 'en';

  /**
   * Child pages of functional medicine. Adding a new service page means
   * adding an entry here and a child route in authentication.routes.ts.
   */
  serviceAreas: ServiceAreaItem[] = [
    {
      name: 'Gut Health',
      category: 'Digestive & Microbiome Care',
      description: 'Comprehensive testing for dysbiosis, SIBO, intestinal permeability, and food sensitivity, with a sequenced protocol that repairs rather than suppresses. For bloating, reflux, irregularity, and the fatigue, skin, and brain fog that travel with them.',
      linkText: 'Learn More',
      linkUrl: '/functional-medicine/gut-health'
    },
    {
      name: 'Brain Health',
      category: 'Cognitive & Metabolic Care',
      description: 'Root-cause evaluation of brain fog, memory, and focus. We test the metabolic, vascular, hormonal, inflammatory, nutritional, and sleep drivers of cognition rather than attributing symptoms to age or stress.',
      linkText: 'Learn More',
      linkUrl: '/functional-medicine/brain-health'
    }
  ];

  // How functional medicine differs
  pillars: ApproachPillar[] = [
    {
      title: 'We Look For Mechanism, Not Just A Label',
      description: 'A diagnosis names what you are experiencing. It does not always explain why it is happening. Functional medicine works backwards from the symptom to the system driving it, because that is the part that can actually be corrected.',
      icon: 'science'
    },
    {
      title: 'We Test Before We Treat',
      description: 'Comprehensive laboratory testing comes first, every time. Treating without testing is guessing, and guessing in medicine is expensive, slow, and occasionally harmful.',
      icon: 'biotech'
    },
    {
      title: 'We Treat Systems That Interact',
      description: 'Gut, hormones, metabolism, inflammation, and cognition are not separate departments. Patients arrive for one complaint and frequently have four findings that share a single origin.',
      icon: 'swap_horiz'
    },
    {
      title: 'We Refer When Referral Is Right',
      description: 'Red-flag symptoms need conventional specialty evaluation and imaging. We say so directly rather than working around it, and we are equally direct about what functional medicine does not do.',
      icon: 'medical_services'
    }
  ];

  // What's included across every program
  included: IncludedItem[] = [
    {
      title: 'Initial Comprehensive Consultation',
      description: 'Full symptom history and timeline, medical and family history, medications, diet, sleep, stress, and every prior workup.',
      icon: 'person'
    },
    {
      title: 'Comprehensive Diagnostic Testing',
      description: 'A panel built for your presentation rather than a fixed package. Labs can be completed in our office, or locally at any Quest or LabCorp.',
      icon: 'biotech'
    },
    {
      title: 'Results Consultation with Dr. Adonis',
      description: 'What your findings actually mean, which system is driving the others, and the order in which we will correct them.',
      icon: 'medical_services'
    },
    {
      title: 'Your Treatment Protocol',
      description: 'Targeted treatment, nutrient correction, hormone optimization where indicated, and nutrition direction built from your results.',
      icon: 'medication'
    },
    {
      title: 'Follow-Up Lab Testing Every Six Months',
      description: 'Confirming that markers moved, with the protocol adjusted accordingly.',
      icon: 'schedule'
    },
    {
      title: 'Direct Access To The Practice',
      description: 'Call or text the clinic at (305) 290-4691 at any time and message directly with our staff.',
      icon: 'phone'
    },
    {
      title: 'Florida Telehealth',
      description: 'Consultations and follow-ups by telehealth throughout Florida, in English and Spanish.',
      icon: 'videocam'
    },
    {
      title: 'Labs And Consultations Included',
      description: 'This is a cash-pay practice. Superbills are not provided.',
      icon: 'verified'
    }
  ];

  // How care works
  treatmentSteps: TreatmentStep[] = [
    {
      number: '1',
      title: 'Consultation',
      description: 'Your symptoms, your history, and what changed before this started. The timeline usually points at the origin.',
      icon: 'person'
    },
    {
      number: '2',
      title: 'Testing',
      description: 'A comprehensive panel selected for your presentation. Labs can be completed in our office, or locally at any Quest or LabCorp.',
      icon: 'biotech'
    },
    {
      number: '3',
      title: 'Interpretation',
      description: 'Dr. Adonis identifies which systems are contributing and which one is driving the others.',
      icon: 'science'
    },
    {
      number: '4',
      title: 'Results Consultation',
      description: 'Findings explained plainly, with a plan built in priority order and an explanation of why we start where we start.',
      icon: 'medical_information'
    },
    {
      number: '5',
      title: 'Treatment Begins',
      description: 'Correction in sequence, starting with the highest-yield finding rather than everything at once.',
      icon: 'medication'
    },
    {
      number: '6',
      title: 'Follow-Up Testing Every Six Months',
      description: 'Markers rechecked and the protocol adjusted as things move.',
      icon: 'schedule'
    }
  ];

  // Who this is for
  candidatePoints: string[] = [
    'Have chronic symptoms without a satisfying explanation',
    'Have been told your labs are normal but do not feel well',
    'Have several symptoms that nobody has connected to each other',
    'Want the cause investigated rather than the symptom suppressed',
    'Are prepared to act on the findings, including dietary and lifestyle change',
    'Want a physician who will be direct about what the evidence does and does not support'
  ];

  nonCandidatePoints: string[] = [
    'Have red-flag symptoms needing urgent or specialist evaluation. We will refer rather than work around it.',
    'Want a prescription or supplement protocol without testing',
    'Are looking for insurance-billed care. This is a cash-pay practice and we do not provide superbills.',
    'Expect a single visit to resolve something that developed over years',
    'Want guaranteed outcomes. Response varies by cause, severity, and duration.'
  ];

  // Frequently asked questions
  faqs: FaqItem[] = [
    {
      question: 'What is functional medicine?',
      answer: 'Functional medicine investigates why a symptom is happening rather than only naming it. It uses comprehensive laboratory testing to identify the metabolic, hormonal, inflammatory, digestive, and nutritional contributors to a presentation, then corrects those contributors in sequence.',
      isOpen: false
    },
    {
      question: 'Is this a replacement for my regular doctor or specialist?',
      answer: 'No. It works alongside conventional care. Red-flag symptoms, structural disease, and conditions requiring specialist management need conventional evaluation, and we refer for those directly.',
      isOpen: false
    },
    {
      question: 'My labs came back normal. Is there any point?',
      answer: 'Frequently, yes. Standard panels are narrow by design. A comprehensive panel looks at markers that a routine workup does not order, and normal results on a limited panel narrow the question rather than answering it.',
      isOpen: false
    },
    {
      question: 'Which service should I start with?',
      answer: 'If your symptoms are primarily digestive, start with gut health. If they are primarily cognitive, start with brain health. If both apply, the initial consultation determines which is driving the other, and the testing is arranged accordingly.',
      isOpen: false
    },
    {
      question: 'How long until I feel better?',
      answer: 'Most patients report meaningful change within 90 days. Nutrient corrections often register sooner; metabolic, hormonal, and microbiome changes take longer.',
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
    const url = `${origin}/functional-medicine`;
    const isEs = this.currentLang === 'es';

    const title = isEs
      ? 'Medicina Funcional en Miami | Atención de Causa Raíz — Dr. Adonis Maiquez, MD'
      : 'Functional Medicine Miami | Root-Cause Medical Care — Dr. Adonis Maiquez, MD';

    const description = isEs
      ? 'Medicina funcional en Miami con el Dr. Adonis Maiquez. Pruebas completas para identificar la causa de sus síntomas, con programas de salud intestinal y salud cerebral. Telemedicina en Florida.'
      : 'Functional medicine in Miami with Dr. Adonis Maiquez. Comprehensive testing to find the cause of your symptoms, with gut health and brain health programs. Florida telehealth.';

    const medicalWebPageSchema: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'MedicalWebPage',
      '@id': `${url}#webpage`,
      url,
      name: title,
      description,
      inLanguage: isEs ? 'es' : 'en',
      about: {
        '@type': 'MedicalSpecialty',
        name: 'Functional Medicine'
      },
      // Declares the child pages beneath this hub.
      hasPart: this.serviceAreas.map((area) => ({
        '@type': 'MedicalWebPage',
        name: area.name,
        description: area.description,
        url: `${origin}${area.linkUrl}`
      })),
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
