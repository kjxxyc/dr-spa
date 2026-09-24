import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ChatWidgetAuraService } from './core/services/chat-widget-aura.service';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet],
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'Modernize Angular Admin Template';

  constructor(
    private translate: TranslateService,
    private chatAura: ChatWidgetAuraService,
  ) {}

  ngOnInit(): void {
    this.translate.setDefaultLang('en');
    const initialLang = this.translate.currentLang || 'en';
    this.translate.use(initialLang);
    // Pulsing aura on the agency's chat launcher (browser only; no-op on SSR).
    this.chatAura.init();
  }
}
