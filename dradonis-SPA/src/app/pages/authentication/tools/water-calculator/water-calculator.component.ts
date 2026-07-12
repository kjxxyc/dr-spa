import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { SeoService } from '../../../../shared/seo/seo.service';

type Gender = 'male' | 'female';
type System = 'metric' | 'imperial';
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'extreme';

interface ActivityOption {
  key: ActivityLevel;
  multiplier: number;
  icon: string;
}

interface Beverage {
  key: string;
  volumeCl: number; // Volume in centiliters (cl), e.g., 25 for 250ml
  hydrationFactor: number; // 1 = 100% hydrating, 0.5 = 50%, negative = diuretic
  calories: number;
  icon: string; // Emoji (rendered via system font, no extra HTTP cost)
}

@Component({
  selector: 'app-water-calculator',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatDialogModule,
    MatIconModule,
    MatSelectModule,
    RouterLink,
    TranslateModule,
  ],
  templateUrl: './water-calculator.component.html',
  styleUrls: ['./water-calculator.component.scss'],
})
export class WaterCalculatorComponent implements OnInit, OnDestroy {
  private langSub?: Subscription;
  form: FormGroup;

  readonly activities: ActivityOption[] = [
    { key: 'sedentary', multiplier: 1.2,   icon: '\u{1F6CB}\u{FE0F}' }, // 🛋️
    { key: 'light',     multiplier: 1.375, icon: '\u{1F6B6}'         }, // 🚶
    { key: 'moderate',  multiplier: 1.55,  icon: '\u{1F3C3}'         }, // 🏃
    { key: 'active',    multiplier: 1.725, icon: '\u{1F4AA}'         }, // 💪
    { key: 'extreme',   multiplier: 1.9,   icon: '\u{1F525}'         }, // 🔥
  ];

  // Beverage definitions based on standard amounts
  readonly beverages: Beverage[] = [
    { key: 'water',       volumeCl: 25,   hydrationFactor: 1.0,  calories: 0,   icon: '\u{1F4A7}' }, // 💧
    { key: 'soda',        volumeCl: 33,   hydrationFactor: 0.9,  calories: 140, icon: '\u{1F964}' }, // 🥤
    { key: 'sodaZero',    volumeCl: 33,   hydrationFactor: 0.9,  calories: 0,   icon: '\u{1F9CA}' }, // 🧊
    { key: 'juice',       volumeCl: 25,   hydrationFactor: 0.9,  calories: 110, icon: '\u{1F9C3}' }, // 🧃
    { key: 'coffeeSugar', volumeCl: 12.5, hydrationFactor: 0.8,  calories: 50,  icon: '\u{2615}'   }, // ☕
    { key: 'coffee',      volumeCl: 12.5, hydrationFactor: 0.8,  calories: 0,   icon: '\u{1F375}' }, // 🍵
    { key: 'wine',        volumeCl: 12.5, hydrationFactor: -0.5, calories: 120, icon: '\u{1F377}' }, // 🍷
    { key: 'beer',        volumeCl: 25,   hydrationFactor: -0.2, calories: 105, icon: '\u{1F37A}' }, // 🍺
    { key: 'sportsDrink', volumeCl: 50,   hydrationFactor: 1.0,  calories: 140, icon: '\u{1F3CB}\u{FE0F}' }, // 🏋️
    { key: 'energyDrink', volumeCl: 25,   hydrationFactor: 0.5,  calories: 110, icon: '\u{26A1}'   }, // ⚡
  ];

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private translate: TranslateService,
    private seo: SeoService,
  ) {
    this.form = this.fb.group({
      gender: ['male' as Gender],
      isPregnant: [false], // Only relevant if female
      age: [30],
      weightSystem: ['metric' as System],
      weight: [70],
      heightSystem: ['metric' as System],
      height: [170],
      activityLevel: ['sedentary' as ActivityLevel],
      bodyFat: [0], // Optional field to match BMR UI
      // Beverages counts
      water: [0],
      soda: [0],
      sodaZero: [0],
      juice: [0],
      coffeeSugar: [0],
      coffee: [0],
      wine: [0],
      beer: [0],
      sportsDrink: [0],
      energyDrink: [0],
    });
  }

  ngOnDestroy(): void {
    this.langSub?.unsubscribe();
    this.seo.reset();
  }

  private applySeo(): void {
    const url = this.seo.absoluteUrl('/tools/water-calculator');
    const lang = (this.translate.currentLang as 'en' | 'es') || 'en';
    const isEs = lang === 'es';
    const config = isEs
      ? {
          title: 'Calculadora de Hidratación | Dr. Adonis Miami',
          description: 'Calcula tu ingesta ideal de agua diaria, evalúa tu nivel de hidratación y descubre cuántas calorías líquidas consumes.',
          keywords: 'calculadora agua, hidratación, calorías líquidas, Dr. Adonis Maiquez, medicina funcional Miami',
        }
      : {
          title: 'Hydration & Water Calculator | Dr. Adonis Miami',
          description: 'Calculate your ideal daily water intake, evaluate your hydration levels and liquid calories.',
          keywords: 'water calculator, hydration calculator, liquid calories, daily water intake, Dr. Adonis Maiquez, functional medicine Miami',
        };

    this.seo.apply({
      ...config,
      url,
      lang,
      ogType: 'website',
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

  // Properties for min/max
  get weightMin(): number { return this.form.value.weightSystem === 'metric' ? 20  : 44; }
  get weightMax(): number { return this.form.value.weightSystem === 'metric' ? 250 : 550; }
  get heightMin(): number { return this.form.value.heightSystem === 'metric' ? 90  : 35; }
  get heightMax(): number { return this.form.value.heightSystem === 'metric' ? 230 : 91; }
  get ageMin(): number { return 10; }
  get ageMax(): number { return 100; }
  get bodyFatMin(): number { return 0; }
  get bodyFatMax(): number { return 80; }
  get weightUnit(): string { return this.form.value.weightSystem === 'metric' ? 'kg' : 'lb'; }
  get heightUnit(): string { return this.form.value.heightSystem === 'metric' ? 'cm' : 'in'; }

  // Calculation Logic

  /** Ideal Water Intake (Liters) */
  get idealWaterLiters(): number {
    const { weight, weightSystem, age, activityLevel, gender, isPregnant, bodyFat } = this.form.value;
    const kg = weightSystem === 'metric' ? Number(weight) : Number(weight) * 0.453592;
    const a = Number(age) || 30;
    
    if (kg <= 0) return 0;

    let baseMl = 0;
    if (a < 30) baseMl = kg * 40;
    else if (a <= 55) baseMl = kg * 35;
    else baseMl = kg * 30;

    let extraMl = 0;
    switch (activityLevel) {
      case 'light': extraMl = 350; break;
      case 'moderate': extraMl = 700; break;
      case 'active': extraMl = 1000; break;
      case 'extreme': extraMl = 1500; break;
    }

    if (gender === 'female' && isPregnant) {
      extraMl += 500;
    }
    
    return Number(((baseMl + extraMl) / 1000).toFixed(1));
  }

  /** Total Actual Hydration Intake from liquids (Liters) */
  get totalActualIntakeLiters(): number {
    let totalCl = 0;
    this.beverages.forEach(bev => {
      const count = Number(this.form.value[bev.key]) || 0;
      totalCl += (count * bev.volumeCl * bev.hydrationFactor);
    });
    return Number(Math.max(0, totalCl / 100).toFixed(1));
  }

  /** Liquid Calories Consumed */
  get liquidCalories(): number {
    let calories = 0;
    this.beverages.forEach(bev => {
      const count = Number(this.form.value[bev.key]) || 0;
      calories += (count * bev.calories);
    });
    return Math.round(calories);
  }

  /** Percentage of ideal intake actually consumed (0-100, clamped). */
  get hydrationPercent(): number {
    const ideal = this.idealWaterLiters;
    if (ideal <= 0) return 0;
    const pct = (this.totalActualIntakeLiters / ideal) * 100;
    return Math.min(100, Math.max(0, Math.round(pct)));
  }

  /** True when the user has reached (or exceeded) their ideal intake. */
  get isHydrated(): boolean {
    return this.totalActualIntakeLiters >= this.idealWaterLiters && this.idealWaterLiters > 0;
  }

  /** Water normally lost every day (Liters) */
  get waterLostLiters(): number {
    // Usually close to ideal intake if healthy
    return Number((this.idealWaterLiters * 0.9).toFixed(1));
  }

  /** Water normally obtained from food (Liters) */
  get waterFromFoodLiters(): number {
    // Roughly 20% of ideal intake comes from food
    return Number((this.idealWaterLiters * 0.2).toFixed(1));
  }

  // Update methods
  updateNumber(field: string, raw: string | number): void {
    const v = typeof raw === 'string' ? parseFloat(raw) : raw;
    this.form.patchValue({ [field]: isFinite(v) ? v : 0 });
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

  /** Index (0-4) of the currently selected activity level in the activities array. */
  get activityIndex(): number {
    const i = this.activities.findIndex(a => a.key === this.form.value.activityLevel);
    return i >= 0 ? i : 0;
  }

  /** Set activity level from a slider value (0-4). */
  setActivityByIndex(raw: string | number): void {
    const idx = Math.max(0, Math.min(this.activities.length - 1, Math.round(Number(raw))));
    this.form.patchValue({ activityLevel: this.activities[idx].key });
  }
  
  incrementBev(key: string): void {
    const current = Number(this.form.value[key]) || 0;
    this.form.patchValue({ [key]: current + 1 });
  }

  decrementBev(key: string): void {
    const current = Number(this.form.value[key]) || 0;
    if (current > 0) {
      this.form.patchValue({ [key]: current - 1 });
    }
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
