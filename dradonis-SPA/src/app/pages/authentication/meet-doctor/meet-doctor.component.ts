import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-meet-doctor',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        MatButtonModule,
        MatIconModule,
        TranslateModule
    ],
    templateUrl: './meet-doctor.component.html',
    styleUrls: ['./meet-doctor.component.scss']
})
export class MeetDoctorComponent { }
