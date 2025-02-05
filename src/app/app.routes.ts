import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { loginGuard } from './core/guards/login.guard';
 ;

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    title: 'Login',
    loadComponent: () => import('./features/auth/login/login.component'),
    canActivate: [loginGuard]
  },
  {
    path: 'perfil',
    title: 'Perfil',
    loadComponent: () => import('./features/auth/perfil/perfil.component'),
    canActivate: [loginGuard]
  },
  {
    path: 'dashboard',
    title: 'Dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component'),
    canActivate: [authGuard],
    children: [
     /* {
        path: '',
        loadComponent: () => import('./features/dashboard/pages/overview.component')
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/dashboard/pages/settings.component')
      },
      {
        path: 'admin',
        loadComponent: () => import('./admin.component'),
        canActivate: [authGuard, roleGuard(['admin', 'superadmin'])]
      }*/
    ]
  },
  {
    path: '**',
    loadComponent: () => import('./core/pages/not-found/not-found.component')
  }
];