import { Routes } from '@angular/router';

import { AppErrorComponent } from './error/error.component';
import { AppSideLoginComponent } from './side-login/side-login.component';
import { AppSideRegisterComponent } from './side-register/side-register.component';
import { LandingComponent } from './landing/landing.component';

export const AuthenticationRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: LandingComponent,
      },
      {
        path: 'landing',
        component: LandingComponent,
      },
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

