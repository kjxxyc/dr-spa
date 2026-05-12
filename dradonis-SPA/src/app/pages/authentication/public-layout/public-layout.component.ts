import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AppointmentDialogComponent } from '../../../shared/appointment-dialog/appointment-dialog.component';

@Component({
    selector: 'app-public-layout',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        TranslateModule,
        MatDialogModule
    ],
    templateUrl: './public-layout.component.html',
    styleUrls: ['./public-layout.component.scss']
})
export class PublicLayoutComponent {
    currentLang: string = 'en';
    menuOpen: boolean = false;

    constructor(private translate: TranslateService, private dialog: MatDialog) {
        this.translate.setDefaultLang('en');
        this.currentLang = this.translate.currentLang || 'en';
        this.translate.use(this.currentLang);
    }

    openAppointment(): void {
        this.dialog.open(AppointmentDialogComponent, {
            width: '600px',
            maxWidth: '95vw',
            autoFocus: false
        });
    }

    toggleMenu() {
        this.menuOpen = !this.menuOpen;
    }

    toggleLanguage() {
        this.currentLang = this.currentLang === 'en' ? 'es' : 'en';
        this.translate.use(this.currentLang);
    }
}
