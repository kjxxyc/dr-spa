import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { WhatsappBtnComponent } from './shared/whatsapp-btn/whatsapp-btn.component';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, WhatsappBtnComponent],
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'Modernize Angular Admin Template';

  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
    this.translate.setDefaultLang('en');
    const initialLang = this.translate.currentLang || 'en';
    this.translate.use(initialLang);
  }
}
