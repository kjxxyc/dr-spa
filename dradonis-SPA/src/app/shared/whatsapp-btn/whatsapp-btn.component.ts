import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

/** Routes where the WhatsApp button must appear on the left side. */
const LEFT_ROUTES = ['/men-wellness', '/vitamins-prescription', '/men-wellness/evaluation'];

@Component({
  selector: 'app-whatsapp-btn',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './whatsapp-btn.component.html',
  styleUrls: ['./whatsapp-btn.component.scss']
})
export class WhatsappBtnComponent implements OnInit {
  isLeftSide = false;

  constructor(
    private translate: TranslateService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.updateState(this.router.url);

    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.updateState(event.urlAfterRedirects);
    });
  }

  private updateState(url: string): void {
    this.isLeftSide = LEFT_ROUTES.some(route => url.startsWith(route));
  }

  get whatsappHref(): string {
    const url = this.router.url;
    let messageKey = 'whatsappMessages.default';

    if (url.startsWith('/services')) {
      messageKey = 'whatsappMessages.services';
    } else if (url.startsWith('/shop')) {
      messageKey = 'whatsappMessages.shop';
    } else if (url.startsWith('/cardecal')) {
      messageKey = 'whatsappMessages.cardecal';
    } else if (url.startsWith('/videos')) {
      messageKey = 'whatsappMessages.videos';
    } else if (url.startsWith('/vitamins-prescription')) {
      messageKey = 'whatsappMessages.vitamins';
    } else if (url.startsWith('/men-wellness')) {
      messageKey = 'whatsappMessages.menwellness';
    }

    const text = this.translate.instant(messageKey);
    // If the translation isn't loaded yet or returns the key, use a fallback
    const fallbackText = 'Hello, I would like more information';
    const finalMessage = (typeof text === 'string' && !text.includes('whatsappMessages')) ? text : fallbackText;
    
    return `https://api.whatsapp.com/send/?phone=13053355424&text=${encodeURIComponent(finalMessage)}&type=phone_number&app_absent=0`;
  }
}
