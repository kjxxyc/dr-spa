import { Routes } from '@angular/router';

import { PublicLayoutComponent } from './public-layout/public-layout.component';

export const AuthenticationRoutes: Routes = [
  {
    path: '',
    children: [
      // Public pages with shared header layout
      {
        path: '',
        component: PublicLayoutComponent,
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
            path: 'services',
            loadComponent: () =>
              import('./services/services.component').then(
                (m) => m.ServicesComponent
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
        ],
      },
      // Legacy redirects: these URLs used to live under /landing/* but the
      // canonical versions are at the root. Kept as redirects so old bookmarks
      // and any internal link still in transition land on the SEO-canonical URL.
      {
        path: 'vitamins-prescription',
        redirectTo: '/vitamins-prescription',
        pathMatch: 'full',
      },
      {
        path: 'men-wellness',
        redirectTo: '/men-wellness',
        pathMatch: 'full',
      },
      {
        path: 'men-wellness/evaluation',
        redirectTo: '/men-wellness/evaluation',
        pathMatch: 'full',
      },
    ],
  },
];
