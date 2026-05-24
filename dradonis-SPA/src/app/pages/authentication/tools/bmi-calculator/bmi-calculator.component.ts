import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { AppointmentDialogComponent } from '../../../../shared/appointment-dialog/appointment-dialog.component';
import { SeoService } from '../../../../shared/seo/seo.service';

type Gender = 'male' | 'female';
type System = 'metric' | 'imperial';
type RiskLevel = 'low' | 'medium' | 'high' | 'veryHigh' | 'extreme';
type ColorLevel = 'low' | 'medium' | 'high' | 'veryHigh' | 'extreme';
type BmiKey = 'underweight' | 'normal' | 'overweight' | 'obese1' | 'obese2' | 'obese3';

export interface BmiClass {
    key: BmiKey;
    range: string;
    cssClass: string;
    risk: RiskLevel;
    color: ColorLevel;
}

export interface BmiRange {
    key: BmiKey;
    range: string;
    cssClass: string;
    risk: RiskLevel;
}

@Component({
    selector: 'app-bmi-calculator',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatDialogModule,
        MatIconModule,
        TranslateModule,
    ],
    templateUrl: './bmi-calculator.component.html',
    styleUrls: ['./bmi-calculator.component.scss'],
})
export class BmiCalculatorComponent implements OnInit, OnDestroy {
    private langSub?: Subscription;
    form: FormGroup;

    /** Static catalog of the 6 BMI categories used to render the classification bar. */
    readonly ranges: BmiRange[] = [
        { key: 'underweight', range: '<18',   cssClass: 'cat-underweight', risk: 'low' },
        { key: 'normal',      range: '18-25', cssClass: 'cat-normal',      risk: 'low' },
        { key: 'overweight',  range: '25-30', cssClass: 'cat-overweight',  risk: 'medium' },
        { key: 'obese1',      range: '30-35', cssClass: 'cat-obese1',      risk: 'high' },
        { key: 'obese2',      range: '35-40', cssClass: 'cat-obese2',      risk: 'veryHigh' },
        { key: 'obese3',      range: '40+',   cssClass: 'cat-obese3',      risk: 'extreme' },
    ];

    constructor(
        private fb: FormBuilder,
        private dialog: MatDialog,
        private translate: TranslateService,
        private seo: SeoService,
    ) {
        this.form = this.fb.group({
            gender: ['male' as Gender],
            weightSystem: ['metric' as System],
            weight: [70],
            heightSystem: ['metric' as System],
            height: [170],
        });
    }

    ngOnDestroy(): void {
        this.langSub?.unsubscribe();
        this.seo.reset();
    }

    /**
     * BMI Calculator SEO — captures long-tail "BMI calculator Miami" searches
     * and positions the tool as a medical-grade utility from a real physician.
     */
    private applySeo(): void {
        const url = this.seo.absoluteUrl('/landing/tools/bmi-calculator');
        const lang = (this.translate.currentLang as 'en' | 'es') || 'en';
        const isEs = lang === 'es';
        const config = isEs
            ? {
                title: 'Calculadora de IMC Online | Dr. Adonis Miami',
                description: 'Calcula tu Índice de Masa Corporal (IMC) gratis. Resultado con orientación médica del Dr. Adonis Maiquez, especialista en pérdida de peso y medicina funcional en Miami.',
                keywords: 'calculadora IMC, índice masa corporal Miami, IMC online, pérdida de peso Miami, Dr. Adonis Maiquez, doctor pérdida peso Florida',
            }
            : {
                title: 'BMI Calculator | Body Mass Index Tool | Dr. Adonis Miami',
                description: 'Free BMI calculator from Dr. Adonis Maiquez Miami practice. Calculate your Body Mass Index and learn about weight management programs from a functional medicine doctor.',
                keywords: 'BMI calculator, body mass index Miami, free BMI tool, weight loss Miami, Dr. Adonis Maiquez, weight management Florida',
            };

        this.seo.apply({
            ...config,
            url,
            lang,
            ogType: 'website',
            jsonLd: {
                '@context': 'https://schema.org',
                '@type': 'WebApplication',
                '@id': `${url}#bmi-app`,
                name: isEs ? 'Calculadora de IMC' : 'BMI Calculator',
                applicationCategory: 'HealthApplication',
                operatingSystem: 'Any',
                url,
                provider: { '@type': 'Physician', '@id': `${this.seo.origin}/#physician`, name: 'Dr. Adonis Maiquez, MD' },
                offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
            },
        });
    }

    ngOnInit(): void {
        // SEO: apply on mount, refresh when language changes.
        this.applySeo();
        this.langSub = this.translate.onLangChange.subscribe(() => this.applySeo());

        // When the user switches kg ↔ lb via the segmented control, convert the
        // current weight value automatically so the slider/input shows the
        // equivalent in the new unit (e.g. 70 kg → 154.3 lb).
        this.form.get('weightSystem')!.valueChanges.subscribe((newSystem: System) => {
            const current = Number(this.form.value.weight) || 0;
            const converted = newSystem === 'imperial'
                ? +(current * 2.20462).toFixed(1)   // kg → lb
                : +(current * 0.453592).toFixed(1); // lb → kg
            this.form.patchValue({ weight: converted }, { emitEvent: false });
        });

        // Same conversion logic for height (cm ↔ in).
        this.form.get('heightSystem')!.valueChanges.subscribe((newSystem: System) => {
            const current = Number(this.form.value.height) || 0;
            const converted = newSystem === 'imperial'
                ? +(current * 0.393701).toFixed(1)  // cm → in
                : +(current * 2.54).toFixed(1);     // in → cm
            this.form.patchValue({ height: converted }, { emitEvent: false });
        });
    }

    // ============================================================
    // Derived state — recomputed automatically by change detection
    // on every form input change (same pattern as vitamins-prescription).
    // ============================================================

    /** BMI = weight(kg) / height(m)². Always normalizes to metric first. */
    get bmi(): number {
        const { weight, height, weightSystem, heightSystem } = this.form.value;
        const w = Number(weight) || 0;
        const h = Number(height) || 0;
        const kg = weightSystem === 'metric' ? w : w * 0.453592;
        const cm = heightSystem === 'metric' ? h : h * 2.54;
        const m = cm / 100;
        return m > 0 ? +(kg / (m * m)).toFixed(1) : 0;
    }

    /** Classifies the current BMI into one of 6 WHO categories. */
    get classification(): BmiClass {
        const v = this.bmi;
        if (v < 18.5) return { key: 'underweight', range: '<18',   cssClass: 'cat-underweight', risk: 'low',      color: 'low' };
        if (v < 25)   return { key: 'normal',      range: '18-25', cssClass: 'cat-normal',      risk: 'low',      color: 'low' };
        if (v < 30)   return { key: 'overweight',  range: '25-30', cssClass: 'cat-overweight',  risk: 'medium',   color: 'medium' };
        if (v < 35)   return { key: 'obese1',      range: '30-35', cssClass: 'cat-obese1',      risk: 'high',     color: 'high' };
        if (v < 40)   return { key: 'obese2',      range: '35-40', cssClass: 'cat-obese2',      risk: 'veryHigh', color: 'veryHigh' };
        return                { key: 'obese3',     range: '40+',   cssClass: 'cat-obese3',      risk: 'extreme',  color: 'extreme' };
    }

    /** CSS class applied to the big BMI number for color coding. */
    get bmiColorClass(): string {
        return `color-${this.classification.color}`;
    }

    /**
     * The appointment CTA is hidden inside the healthy sweet-spot (IMC 20..23).
     * Shown otherwise (underweight, mild-overweight, obesity ranges) where the
     * user would actually benefit from booking a consultation with Dr. Adonis.
     */
    get showAppointmentCta(): boolean {
        const v = this.bmi;
        return v > 0 && (v < 20 || v > 23);
    }

    // ============================================================
    // Slider ranges (dynamic based on current unit system)
    // ============================================================

    // Ranges chosen to cover edge cases (pediatric / muscular athletes / severe
    // obesity) while keeping the slider granularity usable for typical adults.
    // Metric ↔ imperial limits are symmetric: converting one yields the other.
    get weightMin(): number { return this.form.value.weightSystem === 'metric' ? 20  : 44; }
    get weightMax(): number { return this.form.value.weightSystem === 'metric' ? 250 : 550; }
    get heightMin(): number { return this.form.value.heightSystem === 'metric' ? 90  : 35; }
    get heightMax(): number { return this.form.value.heightSystem === 'metric' ? 230 : 91; }
    get weightUnit(): string { return this.form.value.weightSystem === 'metric' ? 'kg' : 'lb'; }
    get heightUnit(): string { return this.form.value.heightSystem === 'metric' ? 'cm' : 'in'; }

    // NOTE: Unit conversion now happens automatically via the valueChanges
    // listeners on `weightSystem` / `heightSystem` set up in ngOnInit, because
    // the mat-button-toggle-group is bound directly to those FormControls.

    // ============================================================
    // Explicit value updates from inputs.
    // Using [value] + (input) handlers instead of formControlName on each input
    // because two inputs sharing one FormControl can have subtle propagation
    // issues — this is bulletproof and keeps slider + number-spinner always synced.
    // ============================================================

    updateWeight(raw: string | number): void {
        const v = typeof raw === 'string' ? parseFloat(raw) : raw;
        this.form.patchValue({ weight: isFinite(v) ? v : 0 });
    }

    updateHeight(raw: string | number): void {
        const v = typeof raw === 'string' ? parseFloat(raw) : raw;
        this.form.patchValue({ height: isFinite(v) ? v : 0 });
    }

    // ============================================================
    // UI helpers
    // ============================================================

    selectGender(gender: Gender): void {
        this.form.patchValue({ gender });
    }

    isGender(gender: Gender): boolean {
        return this.form.value.gender === gender;
    }

    /** Opens the same appointment modal used by the global header CTA. */
    openAppointment(): void {
        this.dialog.open(AppointmentDialogComponent, {
            width: '600px',
            maxWidth: '95vw',
            autoFocus: false,
        });
    }
}
