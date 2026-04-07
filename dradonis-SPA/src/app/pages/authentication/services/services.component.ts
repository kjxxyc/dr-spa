import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
    selector: 'app-services',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        MatButtonModule,
        MatIconModule,
        TranslateModule
    ],
    templateUrl: './services.component.html',
    styleUrls: ['./services.component.scss']
})
export class ServicesComponent {
    youtubeUrl: SafeResourceUrl;

    constructor(private sanitizer: DomSanitizer) {
        this.youtubeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
            'https://www.youtube.com/embed/aM-fAwEvomw'
        );
    }
}
