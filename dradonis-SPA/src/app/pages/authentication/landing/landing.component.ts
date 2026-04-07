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
    constructor(
        private translate: TranslateService,
        private dialog: MatDialog
    ) { }

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
