import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { AppointmentDialogComponent } from '../../../shared/appointment-dialog/appointment-dialog.component';

@Component({
  selector: 'app-cardecal',
  standalone: true,
  imports: [CommonModule, TranslateModule, MatButtonModule, MatIconModule, RouterModule, MatDialogModule],
  templateUrl: './cardecal.component.html',
  styleUrls: ['./cardecal.component.scss'],
  animations: [
    trigger('dropdownState', [
      state('hidden', style({ height: '0', opacity: 0, padding: '0 1.5rem', overflow: 'hidden' })),
      state('visible', style({ height: '*', opacity: 1, padding: '1rem 1.5rem 1.5rem', overflow: 'hidden' })),
      transition('hidden <=> visible', animate('300ms ease-in-out'))
    ])
  ]
})
export class CardecalComponent {
  services = [
    { id: 'hormone', icon: 'science' },
    { id: 'testosterone', icon: 'fitness_center' },
    { id: 'peptides', icon: 'biotech' },
    { id: 'menopause', icon: 'spa' },
    { id: 'weight', icon: 'monitor_weight' },
    { id: 'glp1', icon: 'medical_information' },
    { id: 'ed', icon: 'favorite' },
    { id: 'functional', icon: 'health_and_safety' },
    { id: 'video', icon: 'videocam' },
    { id: 'noVisit', icon: 'phonelink_ring' }
  ];

  activeServiceId: string | null = null;
  lang: 'en' | 'es' = 'en';
  translationsReady = false;

  constructor(private translate: TranslateService, private dialog: MatDialog) {
    this.translate.setDefaultLang('en');
    this.lang = (this.translate.currentLang as 'en' | 'es') || 'en';
    this.translate.use(this.lang);

    forkJoin([
      this.translate.getTranslation('en'),
      this.translate.getTranslation('es')
    ]).subscribe(() => { this.translationsReady = true; });
  }

  getText(key: string, lang: 'en' | 'es'): string {
    const dict = (this.translate.translations[lang] || {}) as any;
    return key.split('.').reduce((o, k) => (o ? o[k] : ''), dict) || '';
  }

  openAppointment(): void {
    this.dialog.open(AppointmentDialogComponent, {
      width: '600px',
      maxWidth: '95vw',
      autoFocus: false
    });
  }

  get otherFlagIcon(): string {
    return this.lang === 'en'
      ? '/assets/images/flag/icon-flag-es.svg'
      : '/assets/images/flag/icon-flag-en.svg';
  }

  get langToggleText(): string {
    return this.lang === 'en' ? 'Español' : 'English';
  }

  toggleLanguage(): void {
    this.lang = this.lang === 'en' ? 'es' : 'en';
    this.translate.use(this.lang);
  }

  toggleService(id: string) {
    if (this.activeServiceId === id) {
      this.activeServiceId = null;
    } else {
      this.activeServiceId = id;
    }
  }

  onHover(id: string) {
    // Only trigger hover on desktop
    if (window.innerWidth > 768) {
      this.activeServiceId = id;
    }
  }

  onLeave() {
    if (window.innerWidth > 768) {
      this.activeServiceId = null;
    }
  }
}
