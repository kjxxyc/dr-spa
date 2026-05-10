import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-whatsapp-btn',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './whatsapp-btn.component.html',
  styleUrls: ['./whatsapp-btn.component.scss']
})
export class WhatsappBtnComponent {}
