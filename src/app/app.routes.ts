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
        path: 'configuracion/organizacion/empresa',
        loadComponent: () => import('./features/pages/configuracion/organizacion/empresa/lista-empresas/lista-empresas.component'),
        data: { breadcrumb: 'Configuración / Estructura Organizativa' },
      },
      {
        path: 'configuracion/organizacion/sucursal',
        loadComponent: () => import('./features/pages/configuracion/organizacion/sucursal/lista-sucursal/lista-sucursal.component'),
        data: { breadcrumb: 'Configuración / Estructura Organizativa' },
      },
      {
        path: 'configuracion/organizacion/subidentidad',
        loadComponent: () => import('./features/pages/configuracion/organizacion/subidentidad/lista-subidentidad/lista-subidentidad.component'),
        data: { breadcrumb: 'Configuración / Estructura Organizativa' },
      },
      {
        path: 'configuracion/organizacion/cargos',
        loadComponent: () => import('./features/pages/configuracion/organizacion/cargo/lista-cargo/lista-cargo.component'),
        data: { breadcrumb: 'Configuración / Estructura Organizativa' },
      },
      {
        path: 'configuracion/procesos/macro-procesos',
        loadComponent: () => import('./features/pages/configuracion/procesos/macro-procesos/lista-macro-procesos/lista-macro-procesos.component'),
        data: { breadcrumb: 'Configuración / Procesos' },
      },
      {
        path: 'configuracion/procesos/procesos',
        loadComponent: () => import('./features/pages/configuracion/procesos/procesos/lista-procesos/lista-procesos.component'),
        data: { breadcrumb: 'Configuración / Procesos' },
      },
      {
        path: 'configuracion/procesos/tipo-actividad', 
        loadComponent: () => import('./features/pages/configuracion/procesos/tipo-actividad/lista-tipo-actividad/lista-tipo-actividad.component'),
        data: { breadcrumb: 'Configuración / Procesos' },
      },
      {
        path: 'configuracion/procesos/modalidad-actividad', 
        loadComponent: () => import('./features/pages/configuracion/procesos/modalidad-actividad/lista-modalidad-actividad/lista-modalidad-actividad.component'),
        data: { breadcrumb: 'Configuración / Procesos' },
      },
      {
        path: 'configuracion/procesos/agrupacion-control',
        loadComponent: () => import('./features/pages/configuracion/procesos/agrupacion-control/lista-agrupacion-control/lista-agrupacion-control.component'),
        data: { breadcrumb: 'Configuración / Procesos' },
      },
      {
        path: 'configuracion/procesos/agrupacion-riesgo',
        loadComponent: () => import('./features/pages/configuracion/procesos/agrupacion-riesgo/lista-agrupacion-riesgo/lista-agrupacion-riesgo.component'),
        data: { breadcrumb: 'Configuración / Procesos' },
      },
      {
        path: 'configuracion/normas/tipo-norma',
        loadComponent: () => import('./features/pages/configuracion/normas/tipo-norma/lista-tipo-norma/lista-tipo-norma.component'),
        data: { breadcrumb: 'Configuración / Normas' },
      },
      {
        path: 'configuracion/normas/tipo-numeral',
        loadComponent: () => import('./features/pages/configuracion/normas/tipo-numeral/lista-tipo-numeral/lista-tipo-numeral.component'),
        data: { breadcrumb: 'Configuración / Normas' },
      },
      {
        path: 'configuracion/ley/grupo-delito',
        loadComponent: () => import('./features/pages/configuracion/ley/grupo-delito/lista-grupo-delito/lista-grupo-delito.component'),
        data: { breadcrumb: 'Configuración / Ley' },
      },
      {
        path: 'configuracion/ley/categoria',
        loadComponent: () => import('./features/pages/configuracion/ley/categoria/lista-categoria/lista-categoria.component'),
        data: { breadcrumb: 'Configuración / Ley' },
      },
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