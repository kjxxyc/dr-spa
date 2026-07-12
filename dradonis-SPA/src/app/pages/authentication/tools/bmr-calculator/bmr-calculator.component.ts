import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { SeoService } from '../../../../shared/seo/seo.service';

type Gender = 'male' | 'female';
type System = 'metric' | 'imperial';
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'extreme';

interface ActivityOption {
  key: ActivityLevel;
  multiplier: number;
}

@Component({
  selector: 'app-bmr-calculator',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatDialogModule,
    MatIconModule,
    MatSelectModule,
    TranslateModule,
  ],
  templateUrl: './bmr-calculator.component.html',
  styleUrls: ['./bmr-calculator.component.scss'],
})
export class BmrCalculatorComponent implements OnInit, OnDestroy {
  private langSub?: Subscription;
  form: FormGroup;

  readonly activities: ActivityOption[] = [
    { key: 'sedentary', multiplier: 1.2 },
    { key: 'light', multiplier: 1.375 },
    { key: 'moderate', multiplier: 1.55 },
    { key: 'active', multiplier: 1.725 },
    { key: 'extreme', multiplier: 1.9 },
  ];

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private translate: TranslateService,
    private seo: SeoService,
  ) {
    this.form = this.fb.group({
      gender: ['male' as Gender],
      age: [30],
      weightSystem: ['metric' as System],
      weight: [70],
      heightSystem: ['metric' as System],
      height: [170],
      activityLevel: ['sedentary' as ActivityLevel],
      formula: ['mifflin'],
      bodyFat: [20],
    });
  }

  ngOnDestroy(): void {
    this.langSub?.unsubscribe();
    this.seo.reset();
  }

  private applySeo(): void {
    const url = this.seo.absoluteUrl('/tools/tmb-calculator');
    const lang = (this.translate.currentLang as 'en' | 'es') || 'en';
    const isEs = lang === 'es';
    const config = isEs
      ? {
          title: 'Calculadora de TMB y Calorías | Dr. Adonis Miami',
          description: 'Calcula tu Tasa Metabólica Basal (TMB) y las calorías que necesitas diariamente según tu nivel de actividad física. Herramienta gratuita del Dr. Adonis.',
          keywords: 'calculadora TMB, calorías diarias, TDEE calculator, metabolismo basal, Dr. Adonis Maiquez, medicina funcional Miami',
        }
      : {
          title: 'BMR & TDEE Daily Calories Calculator | Dr. Adonis Miami',
          description: 'Free BMR and daily calorie calculator by Dr. Adonis Maiquez. Calculate your Basal Metabolic Rate and maintenance calories based on your activity level.',
          keywords: 'BMR calculator, TDEE calculator, daily calories, basal metabolic rate, Dr. Adonis Maiquez, functional medicine Miami',
        };

    this.seo.apply({
      ...config,
      url,
      lang,
      ogType: 'website',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        '@id': `${url}#bmr-app`,
        name: isEs ? 'Calculadora de TMB' : 'BMR Calculator',
        applicationCategory: 'HealthApplication',
        operatingSystem: 'Any',
        url,
        provider: { '@type': 'Physician', '@id': `${this.seo.origin}/#physician`, name: 'Dr. Adonis Maiquez, MD' },
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      },
    });
  }

  ngOnInit(): void {
    this.applySeo();
    this.langSub = this.translate.onLangChange.subscribe(() => this.applySeo());

    this.form.get('weightSystem')!.valueChanges.subscribe((newSystem: System) => {
      const current = Number(this.form.value.weight) || 0;
      const converted = newSystem === 'imperial'
        ? +(current * 2.20462).toFixed(1)
        : +(current * 0.453592).toFixed(1);
      this.form.patchValue({ weight: converted }, { emitEvent: false });
    });

    this.form.get('heightSystem')!.valueChanges.subscribe((newSystem: System) => {
      const current = Number(this.form.value.height) || 0;
      const converted = newSystem === 'imperial'
        ? +(current * 0.393701).toFixed(1)
        : +(current * 2.54).toFixed(1);
      this.form.patchValue({ height: converted }, { emitEvent: false });
    });
  }

  get bmr(): number {
    const { gender, age, weight, height, weightSystem, heightSystem, formula, bodyFat } = this.form.value;
    const w = Number(weight) || 0;
    const h = Number(height) || 0;
    const a = Number(age) || 0;
    const bf = Number(bodyFat) || 0;
    const kg = weightSystem === 'metric' ? w : w * 0.453592;
    const cm = heightSystem === 'metric' ? h : h * 2.54;

    if (kg <= 0 || cm <= 0 || a <= 0) return 0;

    let bmrCalc = 0;

    switch (formula) {
      case 'harrisOriginal':
        if (gender === 'male') {
          bmrCalc = 66.4730 + (13.7516 * kg) + (5.0033 * cm) - (6.7550 * a);
        } else {
          bmrCalc = 655.0955 + (9.5634 * kg) + (1.8496 * cm) - (4.6756 * a);
        }
        break;

      case 'harrisRevised':
        if (gender === 'male') {
          bmrCalc = 88.362 + (13.397 * kg) + (4.799 * cm) - (5.677 * a);
        } else {
          bmrCalc = 447.593 + (9.247 * kg) + (3.098 * cm) - (4.330 * a);
        }
        break;

      case 'katch':
        // LBM = weight (kg) * (1 - (body fat % / 100))
        const lbm = kg * (1 - (bf / 100));
        bmrCalc = 370 + (21.6 * lbm);
        break;

      case 'schofield':
        if (gender === 'male') {
          if (a < 18) bmrCalc = (17.7 * kg) + 657;
          else if (a < 30) bmrCalc = (15.1 * kg) + 692;
          else if (a < 60) bmrCalc = (11.5 * kg) + 873;
          else bmrCalc = (11.7 * kg) + 587;
        } else {
          if (a < 18) bmrCalc = (13.4 * kg) + 692;
          else if (a < 30) bmrCalc = (14.8 * kg) + 487;
          else if (a < 60) bmrCalc = (8.3 * kg) + 846;
          else bmrCalc = (9.0 * kg) + 656;
        }
        break;

      case 'mifflin':
      default:
        bmrCalc = (10 * kg) + (6.25 * cm) - (5 * a);
        bmrCalc += (gender === 'male') ? 5 : -161;
        break;
    }
    
    return Math.round(bmrCalc);
  }

  get tdee(): number {
    const baseBmr = this.bmr;
    if (baseBmr === 0) return 0;

    const activity = this.form.value.activityLevel;
    const option = this.activities.find(a => a.key === activity);
    const multiplier = option ? option.multiplier : 1.2;

    return Math.round(baseBmr * multiplier);
  }

  get weightMin(): number { return this.form.value.weightSystem === 'metric' ? 20  : 44; }
  get weightMax(): number { return this.form.value.weightSystem === 'metric' ? 250 : 550; }
  get heightMin(): number { return this.form.value.heightSystem === 'metric' ? 90  : 35; }
  get heightMax(): number { return this.form.value.heightSystem === 'metric' ? 230 : 91; }
  get ageMin(): number { return 10; }
  get ageMax(): number { return 100; }
  get bodyFatMin(): number { return 1; }
  get bodyFatMax(): number { return 80; }
  get weightUnit(): string { return this.form.value.weightSystem === 'metric' ? 'kg' : 'lb'; }
  get heightUnit(): string { return this.form.value.heightSystem === 'metric' ? 'cm' : 'in'; }

  updateWeight(raw: string | number): void {
    const v = typeof raw === 'string' ? parseFloat(raw) : raw;
    this.form.patchValue({ weight: isFinite(v) ? v : 0 });
  }

  updateBodyFat(raw: string | number): void {
    const v = typeof raw === 'string' ? parseFloat(raw) : raw;
    this.form.patchValue({ bodyFat: isFinite(v) ? v : 0 });
  }

  updateHeight(raw: string | number): void {
    const v = typeof raw === 'string' ? parseFloat(raw) : raw;
    this.form.patchValue({ height: isFinite(v) ? v : 0 });
  }

  updateAge(raw: string | number): void {
    const v = typeof raw === 'string' ? parseInt(raw, 10) : raw;
    this.form.patchValue({ age: isFinite(v) ? v : 0 });
  }

  selectGender(gender: Gender): void {
    this.form.patchValue({ gender });
  }

  isGender(gender: Gender): boolean {
    return this.form.value.gender === gender;
  }

  setActivityLevel(level: ActivityLevel): void {
    this.form.patchValue({ activityLevel: level });
  }

  async openAppointment(): Promise<void> {
    const { AppointmentDialogComponent } = await import('../../../../shared/appointment-dialog/appointment-dialog.component');
    this.dialog.open(AppointmentDialogComponent, {
      width: '600px',
      maxWidth: '95vw',
      autoFocus: false,
    });
  }
}
