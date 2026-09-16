import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { permissionGuard } from './core/guards/permission.guard';

export const routes: Routes = [
  // Public Routes
  {
    path: '',
    redirectTo: 'catalogo',
    pathMatch: 'full'
  },
  {
    path: 'catalogo',
    loadComponent: () => import('./features/catalogo/catalogo-list/catalogo-list.component').then(m => m.CatalogoListComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./features/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
  },

  // Protected Dashboard Layout Routes
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard-layout/dashboard-layout.component').then(m => m.DashboardLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/dashboard/dashboard-home/dashboard-home.component').then(m => m.DashboardHomeComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent)
      },
      {
        path: 'catalogo',
        loadComponent: () => import('./features/catalogo/catalogo-list/catalogo-list.component').then(m => m.CatalogoListComponent),
        canActivate: [permissionGuard('UI:MENU_CATALOGO')]
      },
      {
        path: 'roles',
        loadComponent: () => import('./features/roles/roles-management.component').then(m => m.RolesManagementComponent),
        canActivate: [permissionGuard('UI:MENU_ROLES')]
      },
      {
        path: 'permisos',
        loadComponent: () => import('./features/permisos/permisos-management.component').then(m => m.PermisosManagementComponent),
        canActivate: [permissionGuard('UI:MENU_ROLES')]
      },
      {
        path: 'bitacora',
        loadComponent: () => import('./features/bitacora/bitacora-viewer.component').then(m => m.BitacoraViewerComponent),
        canActivate: [permissionGuard('UI:MENU_BITACORA')]
      },
      {
        path: 'info-tecnica',
        loadComponent: () => import('./features/info-tecnica/info-tecnica.component').then(m => m.InfoTecnicaComponent),
        canActivate: [permissionGuard('UI:MENU_BITACORA')]
      },
      // Placeholders for pending modules
      {
        path: 'empresas',
        loadComponent: () => import('./features/empresas/empresas-placeholder.component').then(m => m.EmpresasPlaceholderComponent),
        canActivate: [permissionGuard('UI:MENU_EMPRESAS')]
      },
      {
        path: 'usuarios',
        loadComponent: () => import('./features/usuarios/usuarios-placeholder.component').then(m => m.UsuariosPlaceholderComponent),
        canActivate: [permissionGuard('UI:MENU_USUARIOS')]
      },
      {
        path: 'propiedades',
        loadComponent: () => import('./features/propiedades/propiedades-placeholder.component').then(m => m.PropiedadesPlaceholderComponent),
        canActivate: [permissionGuard('UI:MENU_PROPIEDADES')]
      },
      {
        path: 'clientes',
        loadComponent: () => import('./features/clientes/clientes-placeholder.component').then(m => m.ClientesPlaceholderComponent),
        canActivate: [permissionGuard('UI:MENU_CLIENTES')]
      },
      {
        path: 'propietarios',
        loadComponent: () => import('./features/propietarios/propietarios-placeholder.component').then(m => m.PropietariosPlaceholderComponent),
        canActivate: [permissionGuard('UI:MENU_PROPIETARIOS')]
      },
      {
        path: 'agentes',
        loadComponent: () => import('./features/agentes/agentes-placeholder.component').then(m => m.AgentesPlaceholderComponent),
        canActivate: [permissionGuard('UI:MENU_AGENTES')]
      },
      {
        path: 'visitas',
        loadComponent: () => import('./features/visitas/visitas-placeholder.component').then(m => m.VisitasPlaceholderComponent),
        canActivate: [permissionGuard('UI:MENU_VISITAS')]
      },
      {
        path: 'contratos',
        loadComponent: () => import('./features/contratos/contratos-placeholder.component').then(m => m.ContratosPlaceholderComponent),
        canActivate: [permissionGuard('UI:MENU_CONTRATOS')]
      },
      {
        path: 'pagos',
        loadComponent: () => import('./features/pagos/pagos-placeholder.component').then(m => m.PagosPlaceholderComponent),
        canActivate: [permissionGuard('UI:MENU_PAGOS')]
      }
    ]
  },

  // 404 Wildcard
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];
