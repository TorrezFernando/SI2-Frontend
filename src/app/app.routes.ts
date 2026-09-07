import { Routes } from '@angular/router';
import { Login } from './features/usuarios/login/login';
import { Layout } from './components/layout/layout';
import { ForgotPassword } from './components/forgot-password/forgot-password';
import { Profile } from './components/profile/profile';
import { Roles } from './features/usuarios/roles/roles';
import { Clientes } from './features/inmuebles/clientes/clientes';
import { Propietarios } from './features/inmuebles/propietarios/propietarios';
import { Agentes } from './features/inmuebles/agentes/agentes';
import { Propiedades } from './features/inmuebles/propiedades/propiedades';
import { Catalogo } from './components/catalogo/catalogo';
import { Usuarios } from './features/usuarios/usuarios/usuarios';

export const routes: Routes = [
  { path: '', redirectTo: 'catalogo', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'forgot-password', component: ForgotPassword },
  { path: 'catalogo', component: Catalogo },
  { 
    path: 'dashboard', 
    component: Layout,
    children: [
      { path: 'profile', component: Profile },
      { path: 'usuarios', component: Usuarios },
      { path: 'roles', component: Roles },
      { path: 'clientes', component: Clientes },
      { path: 'propietarios', component: Propietarios },
      { path: 'agentes', component: Agentes },
      { path: 'propiedades', component: Propiedades }
    ]
  }
];
