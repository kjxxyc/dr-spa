import { Routes } from '@angular/router';

import { AppErrorComponent } from './error/error.component';
import { AppSideLoginComponent } from './side-login/side-login.component';
import { AppSideRegisterComponent } from './side-register/side-register.component';
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
        ],
      },
      // Standalone pages (no shared header)
      {
        path: 'error',
        component: AppErrorComponent,
      },
      {
        path: 'login',
        component: AppSideLoginComponent,
      },
      {
        path: 'register',
        component: AppSideRegisterComponent,
      },
      {
        path: 'vitamins-prescription',
        loadComponent: () =>
          import('./vitamins-prescription/vitamins-prescription.component').then(
            (m) => m.VitaminsPrescriptionComponent
          ),
      },
      {
        path: 'tadalafil-evaluation',
        loadComponent: () =>
          import('./tadalafil-evaluation/tadalafil-evaluation.component').then(
            (m) => m.TadalafilEvaluationComponent
          ),
      },
    ],
  },
];
