import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./login/login.page').then((m) => m.LoginPage),
    pathMatch: 'full',
  },
  {
    path: 'mapa',
    loadComponent: () => import('./map/map.page').then((m) => m.MapPage),
  },
  {
    path: 'reserva',
    loadComponent: () => import('./reserva/reserva.page').then((m) => m.ReservaPage),
  },
  {
    path: 'confirmacion',
    loadComponent: () =>
      import('./confirmacion/confirmacion.page').then((m) => m.ConfirmacionPage),
  },
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
];
