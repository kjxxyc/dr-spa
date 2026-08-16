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
