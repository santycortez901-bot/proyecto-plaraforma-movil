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
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
];
