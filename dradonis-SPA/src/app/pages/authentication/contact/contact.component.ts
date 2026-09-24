import { Component, OnInit, OnDestroy, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { SeoService } from '../../../shared/seo/seo.service';
import { GHL_EMBED_SCRIPT_ID, GHL_EMBED_SCRIPT_URL, GHL_FORM_URL } from '../../../shared/appointment-dialog/ghl-form.constants';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    TranslateModule
  ],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit, OnDestroy {
  private sanitizer = inject(DomSanitizer);
  private platformId = inject(PLATFORM_ID);
  private translate = inject(TranslateService);
  private seo = inject(SeoService);
  private langSub?: Subscription;

  formUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
    GHL_FORM_URL
  );

  ngOnInit(): void {
    this.applySeo();
    this.langSub = this.translate.onLangChange.subscribe(() => {
      this.applySeo();
    });

    if (isPlatformBrowser(this.platformId)) {
      if (typeof window !== 'undefined') {
        const existingScript = document.getElementById(GHL_EMBED_SCRIPT_ID);
        if (!existingScript) {
          const script = document.createElement('script');
          script.id = GHL_EMBED_SCRIPT_ID;
          script.src = GHL_EMBED_SCRIPT_URL;
          script.async = true;
          document.body.appendChild(script);
        }
      }
    }
  }

  ngOnDestroy(): void {
    this.langSub?.unsubscribe();
    this.seo.reset();
  }

  private applySeo(): void {
    const url = this.seo.absoluteUrl('/contact');
    const lang = (this.translate.currentLang as 'en' | 'es') || 'en';
    const isEs = lang === 'es';
    const config = isEs
      ? {
          title: 'Contacto y Citas | Dr. Adonis Maiquez Miami',
          description: 'Póngase en contacto con el Dr. Adonis Maiquez en Miami, FL. Solicite su cita para medicina funcional, telemedicina y salud integral.',
          keywords: 'contacto Dr. Adonis, cita Dr. Adonis, medicina funcional Miami contacto, citas medicas Miami',
        }
      : {
          title: 'Contact Us & Book Appointment | Dr. Adonis Maiquez Miami',
          description: 'Get in touch with Dr. Adonis Maiquez in Miami, FL. Request an appointment for functional medicine, telemedicine, and regenerative wellness.',
          keywords: 'contact Dr. Adonis, book appointment Dr. Adonis, functional medicine Miami contact, doctor appointment Miami',
        };

    const origin = this.seo.origin;

    this.seo.apply({
      ...config,
      url,
      lang,
      ogType: 'website',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        '@id': `${url}#contact`,
        name: isEs ? 'Contacto | Dr. Adonis' : 'Contact Us | Dr. Adonis',
        url,
        mainEntity: {
          '@type': 'Physician',
          name: 'Dr. Adonis Maiquez, MD',
          telephone: '+1-305-290-4691',
          url: origin,
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Miami',
            addressRegion: 'FL',
            addressCountry: 'US',
          }
        }
      }
    });
  }
}
