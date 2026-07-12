import { Routes } from '@angular/router';

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
            path: 'videos',
            loadComponent: () =>
              import('./videos/videos.component').then(
                (m) => m.VideosComponent
              ),
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
        ],
      },
    ],
  },
];
