import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NewsletterDialogComponent } from './newsletter-dialog.component';

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
export class LandingComponent {
    currentLang: string = 'en';

    // Animated carousel items
    carouselItems = [
        {
            type: 'stat',
            value: '5.8k',
            change: '-3%',
            icon: 'trending_down',
            user: {
                name: 'Jenny Wilson',
                role: 'iOS Developer'
            }
        },
        {
            type: 'info',
            title: 'Paying vs non paying',
            subtitle: 'Last 7 days',
            hashtag: '#1 in DevOps'
        },
        {
            type: 'illustration',
            image: 'assets/images/backgrounds/medical-illustration.svg',
            title: 'Figma tips and tricks with Stephan',
            description: 'Checkout latest events going to happen in USA'
        },
        {
            type: 'chart',
            title: 'Revenue',
            data: [/* chart data */]
        },
        {
            type: 'stat-card',
            title: 'Total Orders',
            value: '16,240',
            period: 'Last 7 days',
            change: '+2%'
        },
        {
            type: 'notification',
            title: 'Congratulations Jonathan',
            message: 'You have done 68% 😡 more sales today. Check your new badge in your profile.'
        }
    ];

    constructor(
        private translate: TranslateService,
        private dialog: MatDialog
    ) {
        // Set default language
        this.translate.setDefaultLang('en');
        this.translate.use('en');
    }

    toggleLanguage() {
        this.currentLang = this.currentLang === 'en' ? 'es' : 'en';
        this.translate.use(this.currentLang);
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
                // TODO: Send to backend API or email service
            }
        });
    }
}
