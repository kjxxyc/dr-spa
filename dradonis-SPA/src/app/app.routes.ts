import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'cardecal',
    loadComponent: () =>
      import('./pages/authentication/cardecal/cardecal.component').then(
        (m) => m.CardecalComponent
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
      import('./pages/authentication/men-wellness-contact/men-wellness-contact.component').then(
        (m) => m.MenWellnessContactComponent
      ),
  },
  {
    path: 'men-wellness/evaluation',
    loadComponent: () =>
      import('./pages/authentication/tadalafil-evaluation/tadalafil-evaluation.component').then(
        (m) => m.TadalafilEvaluationComponent
      ),
  },
  {
    path: '',
    loadChildren: () =>
      import('./pages/authentication/authentication.routes').then(
        (m) => m.AuthenticationRoutes
      ),
  },
  {
    path: 'landing',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
