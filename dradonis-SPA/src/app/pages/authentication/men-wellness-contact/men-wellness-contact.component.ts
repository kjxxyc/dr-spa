import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
    FormBuilder,
    FormGroup,
    Validators,
    ReactiveFormsModule,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';

// ---------- translations (contact-page subset) ----------
const TRANSLATIONS: Record<string, Record<string, string>> = {
    en: {
        subtitle: 'Answer the following questions to determine your profile\'s compatibility with our available options. This process is quick, secure, and for internal use only.',
        contactFullName: 'Full Name',
        contactEmailAddress: 'Email',
        securityMessage: 'The data shared in this form is handled under strict security and encryption standards. The information is exclusively used for processing your request and will not be shared with third parties under any circumstances.',
        contactNextBtn: 'Next',
        langToggle: 'Español',
        errorRequired: 'This field is required.',
        errorEmailFormat: 'Please enter a valid email (e.g. name@mail.com).',
        snackInvalid: 'Please fill in all required fields.',
    },
    es: {
        subtitle: 'Responde las siguientes preguntas para determinar la compatibilidad de tu perfil con nuestras opciones disponibles. Este proceso es rápido, seguro y de uso interno exclusivo.',
        contactFullName: 'Nombre Completo',
        contactEmailAddress: 'Correo Electrónico',
        securityMessage: 'Los datos compartidos en este formulario se manejan bajo estrictos estándares de seguridad y cifrado. La información es de uso exclusivo para el procesamiento de tu solicitud y no será compartida con terceros bajo ningún concepto.',
        contactNextBtn: 'Siguiente',
        langToggle: 'English',
        errorRequired: 'Este campo es obligatorio.',
        errorEmailFormat: 'Ingrese un correo válido (ej. nombre@correo.com).',
        snackInvalid: 'Por favor complete todos los campos obligatorios.',
    },
};

@Component({
    selector: 'app-men-wellness-contact',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatSnackBarModule,
    ],
    templateUrl: './men-wellness-contact.component.html',
    styleUrls: ['./men-wellness-contact.component.scss'],
})
export class MenWellnessContactComponent implements OnInit, OnDestroy {
    lang: 'en' | 'es' = 'en';
    contactInfoForm!: FormGroup;

    constructor(
        private fb: FormBuilder,
        private snackBar: MatSnackBar,
        private router: Router,
    ) {}

    ngOnInit(): void {
        this.contactInfoForm = this.fb.group({
            contactFullName: ['', Validators.required],
            contactEmailAddress: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/)]],
        });

        // Meta Pixel: load SDK and fire PageView on this page.
        this.loadPixel();
    }

    ngOnDestroy(): void {
        // When navigating away, remove ALL pixel traces so Page 2 starts clean.
        this.removePixelTraces();
    }

    /** Translation helper */
    t(key: string): string {
        return TRANSLATIONS[this.lang]?.[key] ?? key;
    }

    get bannerImage(): string {
        return this.lang === 'en'
            ? '/assets/images/tadalafil-cialis-en.webp'
            : '/assets/images/tadalafil-cialis-es.webp';
    }

    get otherFlagIcon(): string {
        return this.lang === 'en'
            ? '/assets/images/flag/icon-flag-es.svg'
            : '/assets/images/flag/icon-flag-en.svg';
    }

    toggleLanguage(): void {
        this.lang = this.lang === 'en' ? 'es' : 'en';
    }

    /** Handle "Next" button click */
    onContactNext(): void {
        this.contactInfoForm.markAllAsTouched();
        if (this.contactInfoForm.invalid) {
            this.snackBar.open(this.t('snackInvalid'), 'OK', { duration: 4000 });
            return;
        }

        // Meta Pixel: fire Lead event on "Next" click
        const w = window as any;
        if (typeof w.fbq === 'function') {
            w.fbq('track', 'Lead');
        }

        // Navigate to the evaluation form, passing contact info via router state
        const name = this.contactInfoForm.get('contactFullName')?.value;
        const email = this.contactInfoForm.get('contactEmailAddress')?.value;
        this.router.navigate(['/men-wellness/evaluation'], {
            state: { contactName: name, contactEmail: email, lang: this.lang },
        });
    }

    // ─── Meta Pixel ──────────────────────────────────────────────────

    /** Load the Facebook SDK and fire PageView. */
    private loadPixel(): void {
        const w = window as any;
        if (w.fbq) return; // already loaded globally
        const n: any = (w.fbq = function () {
            n.callMethod
                ? n.callMethod.apply(n, arguments)
                : n.queue.push(arguments);
        });
        if (!w._fbq) w._fbq = n;
        n.push = n;
        n.loaded = true;
        n.version = '2.0';
        n.queue = [];
        const t = document.createElement('script');
        t.async = true;
        t.src = 'https://connect.facebook.net/en_US/fbevents.js';
        const s = document.getElementsByTagName('script')[0];
        s.parentNode?.insertBefore(t, s);
        w.fbq('init', '34862161576760674');
        w.fbq('track', 'PageView');
    }

    /** Remove ALL traces of the Meta Pixel from the page. */
    private removePixelTraces(): void {
        const w = window as any;

        // Replace with no-op first so lingering callbacks don't re-create
        const noop = function () {};
        w.fbq = noop;
        w._fbq = noop;

        // Remove Facebook SDK scripts
        document.querySelectorAll('script[src*="connect.facebook.net"]').forEach(el => el.remove());
        document.querySelectorAll('script[src*="facebook.com"]').forEach(el => el.remove());

        // Remove tracking pixel images
        document.querySelectorAll('img[src*="facebook.com/tr"]').forEach(el => el.remove());

        // Remove Facebook iframes
        document.querySelectorAll('iframe[src*="facebook.com"]').forEach(el => el.remove());
        document.querySelectorAll('iframe[src*="facebook.net"]').forEach(el => el.remove());

        // Clean up ALL known Facebook SDK globals
        const fbGlobals = ['fbq', '_fbq', '__fbeventsModules', 'fbEvents',
            '_fbq_gtm', 'FB', '__fb_ev', 'fbds'];
        fbGlobals.forEach(key => {
            try { delete w[key]; } catch (_) { w[key] = undefined; }
        });
    }
}
