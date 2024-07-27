import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/list/list.component').then((m) => m.ListComponent),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./pages/new/new.component').then((m) => m.NewComponent),
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./pages/new/new.component').then((m) => m.NewComponent),
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  }
];
