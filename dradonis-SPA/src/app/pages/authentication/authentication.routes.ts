import { Routes, UrlMatchResult, UrlSegment } from '@angular/router';

/**
 * Matches both /videos and /videos/:slug with a single route config so the
 * VideosComponent instance is REUSED when navigating between videos (keeps
 * the search text, avoids re-rendering the whole page, and lets the featured
 * player swap in place). Two separate route entries would destroy/recreate
 * the component on every card click.
 */
export function videosMatcher(segments: UrlSegment[]): UrlMatchResult | null {
  if (
    segments.length >= 1 &&
    segments.length <= 2 &&
    segments[0].path === 'videos'
  ) {
    const posParams: { [key: string]: UrlSegment } = {};
    if (segments.length === 2) {
      posParams['slug'] = segments[1];
    }
    return { consumed: segments, posParams };
  }
  return null;
}

export const AuthenticationRoutes: Routes = [
  {
    path: '',
    children: [
      // Public pages with shared header layout
      {
        path: '',
        loadComponent: () =>
          import('./public-layout/public-layout.component').then(
            (m) => m.PublicLayoutComponent
          ),
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./landing/landing.component').then(
                (m) => m.LandingComponent
              ),
          },
          {
            path: 'landing',
            loadComponent: () =>
              import('./landing/landing.component').then(
                (m) => m.LandingComponent
              ),
          },
          {
            path: 'shop',
            loadComponent: () =>
              import('./shop/shop.component').then(
                (m) => m.ShopComponent
              ),
          },
          {
            path: 'shop/:slug',
            loadComponent: () =>
              import('./shop/product-detail/product-detail.component').then(
                (m) => m.ProductDetailComponent
              ),
          },
          {
            path: 'meet-doctor',
            loadComponent: () =>
              import('./meet-doctor/meet-doctor.component').then(
                (m) => m.MeetDoctorComponent
              ),
          },

          {
            path: 'sitemap',
            loadComponent: () =>
              import('./sitemap/sitemap.component').then(
                (m) => m.SitemapComponent
              ),
          },
          {
            path: 'services',
            loadComponent: () =>
              import('./services/services.component').then(
                (m) => m.ServicesComponent
              ),
          },
          {
            path: 'peptide-therapy',
            loadComponent: () =>
              import('./peptide-therapy/peptide-therapy.component').then(
                (m) => m.PeptideTherapyComponent
              ),
          },
          {
            path: 'services/peptide-therapy',
            redirectTo: 'peptide-therapy',
          },
          {
            path: 'peptides',
            redirectTo: 'peptide-therapy',
          },
          {
            path: 'services/peptides',
            redirectTo: 'peptide-therapy',
          },
          {
            path: 'peptidos',
            redirectTo: 'peptide-therapy',
          },
          // ── Medical weight loss (top-level, not a functional medicine child) ──
          {
            path: 'medical-weight-loss',
            loadComponent: () =>
              import('./medical-weight-loss/medical-weight-loss.component').then(
                (m) => m.MedicalWeightLossComponent
              ),
          },
          {
            path: 'services/medical-weight-loss',
            redirectTo: 'medical-weight-loss',
          },
          {
            path: 'weight-loss',
            redirectTo: 'medical-weight-loss',
          },
          {
            path: 'perdida-de-peso',
            redirectTo: 'medical-weight-loss',
          },

          // ── Functional medicine hub and its child service pages ──
          {
            path: 'functional-medicine',
            loadComponent: () =>
              import('./functional-medicine/functional-medicine.component').then(
                (m) => m.FunctionalMedicineComponent
              ),
          },
          {
            path: 'functional-medicine/gut-health',
            loadComponent: () =>
              import('./gut-health/gut-health.component').then(
                (m) => m.GutHealthComponent
              ),
          },
          {
            path: 'functional-medicine/brain-health',
            loadComponent: () =>
              import('./brain-health/brain-health.component').then(
                (m) => m.BrainHealthComponent
              ),
          },
          {
            path: 'functional-medicine/autoimmune',
            loadComponent: () =>
              import('./autoimmune/autoimmune.component').then(
                (m) => m.AutoimmuneComponent
              ),
          },
          {
            path: 'functional-medicine/hashimotos',
            loadComponent: () =>
              import('./hashimotos/hashimotos.component').then(
                (m) => m.HashimotosComponent
              ),
          },
          {
            path: 'functional-medicine/thyroid',
            loadComponent: () =>
              import('./thyroid/thyroid.component').then(
                (m) => m.ThyroidComponent
              ),
          },
          {
            path: 'functional-medicine/fibromyalgia',
            loadComponent: () =>
              import('./fibromyalgia/fibromyalgia.component').then(
                (m) => m.FibromyalgiaComponent
              ),
          },
          // Aliases for the hub
          {
            path: 'services/functional-medicine',
            redirectTo: 'functional-medicine',
          },
          {
            path: 'medicina-funcional',
            redirectTo: 'functional-medicine',
          },
          // The child pages previously lived at the top level; keep those
          // URLs working by redirecting them under the hub.
          {
            path: 'gut-health',
            redirectTo: 'functional-medicine/gut-health',
          },
          {
            path: 'services/gut-health',
            redirectTo: 'functional-medicine/gut-health',
          },
          {
            path: 'salud-intestinal',
            redirectTo: 'functional-medicine/gut-health',
          },
          {
            path: 'brain-health',
            redirectTo: 'functional-medicine/brain-health',
          },
          {
            path: 'services/brain-health',
            redirectTo: 'functional-medicine/brain-health',
          },
          {
            path: 'salud-cerebral',
            redirectTo: 'functional-medicine/brain-health',
          },
          {
            path: 'autoimmune',
            redirectTo: 'functional-medicine/autoimmune',
          },
          {
            path: 'services/autoimmune',
            redirectTo: 'functional-medicine/autoimmune',
          },
          {
            path: 'autoinmune',
            redirectTo: 'functional-medicine/autoimmune',
          },
          {
            path: 'hashimotos',
            redirectTo: 'functional-medicine/hashimotos',
          },
          {
            path: 'services/hashimotos',
            redirectTo: 'functional-medicine/hashimotos',
          },
          {
            path: 'hashimoto',
            redirectTo: 'functional-medicine/hashimotos',
          },
          {
            path: 'thyroid',
            redirectTo: 'functional-medicine/thyroid',
          },
          {
            path: 'services/thyroid',
            redirectTo: 'functional-medicine/thyroid',
          },
          {
            path: 'tiroides',
            redirectTo: 'functional-medicine/thyroid',
          },
          {
            path: 'fibromyalgia',
            redirectTo: 'functional-medicine/fibromyalgia',
          },
          {
            path: 'services/fibromyalgia',
            redirectTo: 'functional-medicine/fibromyalgia',
          },
          {
            path: 'fibromialgia',
            redirectTo: 'functional-medicine/fibromyalgia',
          },
          {
            path: 'articles',
            loadComponent: () =>
              import('./articles/articles-list/articles-list.component').then(
                (m) => m.ArticlesListComponent
              ),
          },
          {
            path: 'articles/:slug',
            loadComponent: () =>
              import('./articles/article-detail/article-detail.component').then(
                (m) => m.ArticleDetailComponent
              ),
          },
          {
            // /videos and /videos/:slug — see videosMatcher above.
            matcher: videosMatcher,
            loadComponent: () =>
              import('./videos/videos.component').then(
                (m) => m.VideosComponent
              ),
          },
          {
            path: 'telemedicine',
            loadComponent: () =>
              import('./telemedicine/telemedicine.component').then(
                (m) => m.TelemedicineComponent
              ),
          },
          {
            path: 'teleconsulta',
            redirectTo: 'telemedicine',
          },
          {
            path: 'book',
            loadComponent: () =>
              import('./book/book.component').then(
                (m) => m.BookComponent
              ),
          },
          {
            path: 'libro',
            redirectTo: 'book',
          },
          {
            path: 'contact',
            loadComponent: () =>
              import('./contact/contact.component').then(
                (m) => m.ContactComponent
              ),
          },
          {
            path: 'contact-us',
            redirectTo: 'contact',
          },
          {
            path: 'contacto',
            redirectTo: 'contact',
          },
          {
            path: 'tools/bmi-calculator',
            loadComponent: () =>
              import('./tools/bmi-calculator/bmi-calculator.component').then(
                (m) => m.BmiCalculatorComponent
              ),
          },
          {
            path: 'tools/tmb-calculator',
            loadComponent: () =>
              import('./tools/bmr-calculator/bmr-calculator.component').then(
                (m) => m.BmrCalculatorComponent
              ),
          },
          {
            path: 'tools/water-calculator',
            loadComponent: () =>
              import('./tools/water-calculator/water-calculator.component').then(
                (m) => m.WaterCalculatorComponent
              ),
          },
          // Legal / compliance pages (LegitScript: privacy & transparency).
          // One shared component; the slug in `data` picks the content.
          ...['privacy-policy', 'notice-of-privacy-practices', 'terms-of-service', 'telehealth-consent', 'refund-policy'].map((slug) => ({
            path: slug,
            data: { slug },
            loadComponent: () =>
              import('./legal/legal-page.component').then(
                (m) => m.LegalPageComponent
              ),
          })),
          {
            // Smart 404 — MUST stay last. Lives inside the public layout so
            // the error page keeps header, footer, and the WhatsApp button.
            path: '**',
            loadComponent: () =>
              import('./not-found/not-found.component').then(
                (m) => m.NotFoundComponent
              ),
          },
        ],
      },
    ],
  },
];
