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
      // Standalone pages (no shared header)
      {
        path: 'vitamins-prescription',
        loadComponent: () =>
          import('./vitamins-prescription/vitamins-prescription.component').then(
            (m) => m.VitaminsPrescriptionComponent
          ),
      },
      {
        path: 'men-wellness',
        loadComponent: () =>
          import('./men-wellness-contact/men-wellness-contact.component').then(
            (m) => m.MenWellnessContactComponent
          ),
      },
      {
        path: 'men-wellness/evaluation',
        loadComponent: () =>
          import('./tadalafil-evaluation/tadalafil-evaluation.component').then(
            (m) => m.TadalafilEvaluationComponent
          ),
      },
    ],
  },
];
