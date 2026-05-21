import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

// URL fija de respaldo — garantiza que el botón siempre lleve a WhatsApp,
// incluso si el TranslateService no está inicializado o devuelve la clave literal.
const FALLBACK_WHATSAPP_URL =
  'https://api.whatsapp.com/send/?phone=13053355424&text=Hello%2C+I+would+like+more+information&type=phone_number&app_absent=0';

/** Routes where the WhatsApp button must NOT appear. */
const HIDDEN_ROUTES = ['/men-wellness', '/vitamins-prescription', '/landing/men-wellness', '/landing/vitamins-prescription'];

@Component({
  selector: 'app-whatsapp-btn',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './whatsapp-btn.component.html',
  styleUrls: ['./whatsapp-btn.component.scss']
})
export class WhatsappBtnComponent implements OnInit {
  showButton = true;

  constructor(
    private translate: TranslateService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Check current route on init
    this.showButton = !HIDDEN_ROUTES.some(route => this.router.url.startsWith(route));

    // Re-check on every navigation
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.showButton = !HIDDEN_ROUTES.some(route => event.urlAfterRedirects.startsWith(route));
    });
  }

  /**
   * Primera línea de defensa: intenta usar la URL traducida; si no es una URL válida
   * (porque el TranslateService no cargó el JSON o devolvió la clave literal),
   * cae al fallback constante.
   */
  get whatsappHref(): string {
    const value = this.translate.instant('cardecal.whatsappLink');
    return typeof value === 'string' && value.startsWith('http') ? value : FALLBACK_WHATSAPP_URL;
  }

  /**
   * Segunda línea de defensa (red de seguridad final): si por cualquier razón el [href]
   * no resolvió a una URL http(s), cancelamos la navegación del <a> y forzamos la apertura
   * de la URL constante con window.open. Garantía: el click SIEMPRE lleva a WhatsApp.
   */
  onWhatsappClick(event: MouseEvent): void {
    const href = this.whatsappHref;
    if (!href || !href.startsWith('http')) {
      event.preventDefault();
      window.open(FALLBACK_WHATSAPP_URL, '_blank', 'noopener,noreferrer');
    }
  }
}

