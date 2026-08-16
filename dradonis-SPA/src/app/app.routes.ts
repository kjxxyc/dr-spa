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
    path: 'makeanappointment',
    loadComponent: () =>
      import('./pages/authentication/make-appointment/make-appointment.component').then(
        (m) => m.MakeAppointmentComponent
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
