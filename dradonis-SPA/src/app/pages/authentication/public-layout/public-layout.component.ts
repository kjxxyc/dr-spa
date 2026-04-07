import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-public-layout',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        MatButtonModule,
        MatIconModule,
        TranslateModule
    ],
    templateUrl: './public-layout.component.html',
    styleUrls: ['./public-layout.component.scss']
})
export class PublicLayoutComponent {
    currentLang: string = 'en';
    menuOpen: boolean = false;

    constructor(private translate: TranslateService) {
        this.translate.setDefaultLang('en');
        this.currentLang = this.translate.currentLang || 'en';
        this.translate.use(this.currentLang);
    }

    toggleMenu() {
        this.menuOpen = !this.menuOpen;
    }

    toggleLanguage() {
        this.currentLang = this.currentLang === 'en' ? 'es' : 'en';
        this.translate.use(this.currentLang);
    }
}
