import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/landing',
    pathMatch: 'full',
  },
  {
    path: 'landing',
    loadChildren: () =>
      import('./pages/authentication/authentication.routes').then(
        (m) => m.AuthenticationRoutes
      ),
  },
  {
    path: 'vitamins-prescription',
    loadComponent: () =>
      import('./pages/authentication/vitamins-prescription/vitamins-prescription.component').then(
        (m) => m.VitaminsPrescriptionComponent
      ),
  },
  {
    path: 'men-wellness',
    loadComponent: () =>
      import('./pages/authentication/tadalafil-evaluation/tadalafil-evaluation.component').then(
        (m) => m.TadalafilEvaluationComponent
      ),
  },
  {
    path: '**',
    redirectTo: 'landing',
  },
];
