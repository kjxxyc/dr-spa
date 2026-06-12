import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { NewsletterDialogComponent } from './newsletter-dialog.component';
import { SeoService } from '../../../shared/seo/seo.service';

@Component({
    selector: 'app-landing',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
        TranslateModule
    ],
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit, OnDestroy {
    private langSub?: Subscription;

    // Services for the marquee carousel — muted/earthy palette, medical-friendly.
    // Keys come from cardecal.services.*
    services = [
        { id: 'functional',   icon: 'health_and_safety',   color: '#6B9080' }, // sage green
        { id: 'hormone',      icon: 'science',             color: '#8B7EA8' }, // muted lavender
        { id: 'testosterone', icon: 'fitness_center',      color: '#D4A574' }, // warm tan
        { id: 'menopause',    icon: 'spa',                 color: '#C490A0' }, // dusty rose
        { id: 'peptides',     icon: 'biotech',             color: '#7FA8B0' }, // muted teal
        { id: 'weight',       icon: 'monitor_weight',      color: '#9CAF7E' }, // olive
        { id: 'glp1',         icon: 'medical_information', color: '#7B9BC1' }, // powder blue
        { id: 'ed',           icon: 'favorite',            color: '#C28080' }, // muted coral
        { id: 'video',        icon: 'videocam',            color: '#9B8AB0' }, // mauve
        { id: 'noVisit',      icon: 'phonelink_ring',      color: '#80A8A0' }, // sea green
    ];

    // Second row uses the same list reversed for a brick-stacked offset effect
    get servicesAlt() {
        return [...this.services].reverse();
    }

    // Reviews images for marquee
    reviewImages = [
        'Review Alexia.webp',
        'Review Ana Giralt Oliva.webp',
        'Review Karlos.webp',
        'Review LT.webp',
        'Review Mayli Dorta.webp',
        'Review Miami Arts.webp',
        'Review Noris.webp',
        'Review Silvana.webp'
    ];

    // Google Maps embed URL for testimonials section
    googleMapsUrl: SafeResourceUrl;

    constructor(
        private translate: TranslateService,
        private dialog: MatDialog,
        private sanitizer: DomSanitizer,
        private seo: SeoService,
    ) {
        this.googleMapsUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
            'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3592.1!2d-80.213865!3d25.7863004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88d9b76d1434265b%3A0xfa2d0d393c1e7ec3!2sDr.%20Adonis%20(Adonis%20Maiquez%2C%20MD)!5e0!3m2!1sen!2sus!4v1'
        );
    }

    ngOnInit(): void {
        this.applySeo();
        // Re-apply SEO when the user toggles language so title/description swap.
        this.langSub = this.translate.onLangChange.subscribe(() => this.applySeo());
    }

    ngOnDestroy(): void {
        this.langSub?.unsubscribe();
        this.seo.reset();
    }

    /**
     * Homepage SEO — targets "functional medicine Miami" and brand search
     * "Dr. Adonis Maiquez". Highest priority page (priority 1.0 in sitemap).
     */
    private applySeo(): void {
        const url = this.seo.absoluteUrl('/');
        const lang = (this.translate.currentLang as 'en' | 'es') || 'en';
        const isEs = lang === 'es';
        const config = isEs
            ? {
                title: 'Dr. Adonis Maiquez, MD | Medicina Funcional y Regenerativa Miami',
                description: 'Médico experto en medicina funcional y regenerativa en Miami. Tratamiento de enfermedades crónicas, terapia hormonal, péptidos, pérdida de peso y antienvejecimiento. Atendemos Miami, Coral Gables, Aventura, Doral y todo el sur de Florida.',
                keywords: 'medicina funcional Miami, medicina regenerativa Miami, Dr. Adonis Maiquez, terapia hormonal Miami, péptidos Miami, antienvejecimiento Miami, longevidad Miami, medicina integrativa Miami, médico medicina funcional Florida',
            }
            : {
                title: 'Dr. Adonis Maiquez, MD | Functional & Regenerative Medicine Miami',
                description: "Miami's leading functional medicine expert. Root-cause treatment for chronic disease, hormone optimization, peptides, weight loss & anti-aging. Serving Miami, Coral Gables, Aventura, Doral & all of South Florida.",
                keywords: 'functional medicine Miami, regenerative medicine Miami, Dr. Adonis Maiquez, hormone replacement Miami, peptide therapy Miami, anti-aging Miami, longevity doctor Miami, integrative medicine Florida, chronic disease specialist Miami',
            };

        this.seo.apply({
            ...config,
            url,
            lang,
            ogType: 'website',
            jsonLd: this.buildJsonLd(lang, url),
        });
    }

    private buildJsonLd(lang: 'en' | 'es', url: string): Record<string, unknown>[] {
        const origin = this.seo.origin;
        const isEs = lang === 'es';
        return [
            {
                '@context': 'https://schema.org',
                '@type': 'Physician',
                '@id': `${origin}/#physician`,
                name: 'Dr. Adonis Maiquez, MD',
                url: origin,
                image: `${origin}/assets/images/logos/dr-full-img.webp`,
                logo: `${origin}/assets/images/logos/Logo_720x192.jpg`,
                telephone: '+1-305-204-7816',
                address: {
                    '@type': 'PostalAddress',
                    addressLocality: 'Miami',
                    addressRegion: 'FL',
                    addressCountry: 'US',
                },
                geo: { '@type': 'GeoCoordinates', latitude: 25.7863004, longitude: -80.2112901 },
                medicalSpecialty: ['Functional Medicine', 'Regenerative Medicine', 'Anti-Aging Medicine'],
                description: isEs
                    ? 'Médico especialista en medicina funcional y regenerativa en Miami, FL.'
                    : 'Functional & Regenerative Medicine specialist in Miami, FL.',
                priceRange: '$$',
                openingHoursSpecification: {
                    '@type': 'OpeningHoursSpecification',
                    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                    opens: '09:00',
                    closes: '17:00',
                },
                sameAs: [
                    'https://www.youtube.com/@DrAdonisMaiquezMD',
                    'https://www.instagram.com/dradonisfunctionalmedicine/',
                    'https://www.facebook.com/DrAdonis/',
                    'https://www.tiktok.com/@dradonismaiquez',
                    'https://x.com/dradonismaiquez',
                ],
            },
            {
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                '@id': `${origin}/#website`,
                url: origin,
                name: 'Dr. Adonis - Functional & Regenerative Medicine',
                inLanguage: ['en-US', 'es'],
                publisher: { '@id': `${origin}/#physician` },
                potentialAction: {
                    '@type': 'SearchAction',
                    target: `${origin}/?s={search_term_string}`,
                    'query-input': 'required name=search_term_string',
                },
            },
            // FAQ — only on homepage; gets Google rich-result eligibility here.
            {
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                '@id': `${origin}/#faq`,
                mainEntity: [
                    {
                        '@type': 'Question',
                        name: isEs ? '¿Qué es la Medicina Funcional?' : 'What is Functional Medicine?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: isEs
                                ? 'La medicina funcional es un enfoque personalizado y sistémico que aborda las causas subyacentes de la enfermedad en lugar de solo tratar los síntomas. Se enfoca en la persona en su totalidad.'
                                : 'Functional Medicine is a personalized, systems-oriented approach that addresses the underlying causes of disease rather than just treating symptoms. It focuses on the whole person, not just isolated symptoms.',
                        },
                    },
                    {
                        '@type': 'Question',
                        name: isEs ? '¿Qué es la terapia Vagustim?' : 'What is Vagustim therapy?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: isEs
                                ? 'Vagustim es un dispositivo no invasivo de estimulación del nervio vago que ayuda a activar el sistema nervioso parasimpático, promoviendo relajación, mejor sueño y bienestar general. Usa el código DRADONIS10 para 10% de descuento.'
                                : 'Vagustim is a non-invasive vagus nerve stimulation device that helps activate the parasympathetic nervous system, promoting relaxation, better sleep, and overall wellness. Use code DRADONIS10 for 10% off.',
                        },
                    },
                    {
                        '@type': 'Question',
                        name: isEs ? '¿Ofrecen suplementos?' : 'Do you offer supplements?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: isEs
                                ? 'Sí, el Dr. Adonis ofrece una selección curada de suplementos premium vía Fullscript, incluyendo PectaSol, Mitochondrial NRG y otros productos de alta calidad para longevidad y salud óptima.'
                                : 'Yes, Dr. Adonis offers a curated selection of premium supplements through Fullscript, including PectaSol, Mitochondrial NRG, and other high-quality products for longevity and optimal health.',
                        },
                    },
                ],
            },
            {
                '@context': 'https://schema.org',
                '@type': 'Product',
                '@id': `${origin}/#vagustim`,
                name: 'Vagustim - Vagus Nerve Stimulator',
                description: 'Non-invasive vagus nerve stimulation device for wellness and relaxation',
                brand: { '@type': 'Brand', name: 'Vagustim' },
                offers: {
                    '@type': 'Offer',
                    url: 'https://vagustim.io/',
                    priceCurrency: 'USD',
                    availability: 'https://schema.org/InStock',
                    seller: { '@type': 'Organization', name: 'Vagustim' },
                },
            },
            {
                '@context': 'https://schema.org',
                '@type': 'Book',
                '@id': `${origin}/#book`,
                name: 'Dr. Adonis Book',
                author: { '@type': 'Person', name: 'Dr. Adonis Maiquez' },
                url: 'https://www.amazon.com/gp/product/B0146UK2FM',
            },
        ];
    }

    openNewsletterDialog() {
        const dialogRef = this.dialog.open(NewsletterDialogComponent, {
            width: '500px',
            maxWidth: '90vw',
            autoFocus: true,
            restoreFocus: true
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                console.log('Newsletter subscription data:', result);
            }
        });
    }
}
