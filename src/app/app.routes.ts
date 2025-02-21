import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { loginGuard } from './core/guards/login.guard';
import { roleGuard } from './core/guards/role.guard';
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
    data: { breadcrumb: { skip: true } },
    children: [
      /*{
        path: '',
        loadComponent: () => import('./features/dashboard/pages/overview.component')
      },*/
      {path: '', pathMatch: 'full', redirectTo: 'inicio'},
      {
        path: 'inicio',
        loadComponent: () => import('./features/pages/inicio/inicio/inicio.component'),
        data: {breadcrumb: 'Dashboard / Inicio'}
      },
      {
        path: 'configuracion/empresa',
        loadComponent: () => import('./features/pages/configuracion/organizacion/empresa/lista-empresas/lista-empresas.component'),
        data: { breadcrumb: 'Configuración / Estructura Organizativa' },
      },
      {
        path: 'configuracion/sucursal',
        loadComponent: () => import('./features/pages/configuracion/organizacion/sucursal/lista-sucursal/lista-sucursal.component'),
        data: { breadcrumb: 'Configuración / Estructura Organizativa' },
      },
      {
        path: 'configuracion/macro-procesos',
        loadComponent: () => import('./features/pages/configuracion/procesos/macro-procesos/lista-macro-procesos/lista-macro-procesos.component'),
        data: { breadcrumb: 'Configuración / Procesos' },
      },
      {
        path: 'configuracion/procesos',
        loadComponent: () => import('./features/pages/configuracion/procesos/procesos/lista-procesos/lista-procesos.component'),
        data: { breadcrumb: 'Configuración / Procesos' },
      }
      /*{
        path: 'admin',
        loadComponent: () => import('./admin.component'),
        canActivate: [authGuard, roleGuard(['admin'])]
      }*/
    ]
  },
  {
    path: '**',
    loadComponent: () => import('./core/pages/not-found/not-found.component')
  }
];