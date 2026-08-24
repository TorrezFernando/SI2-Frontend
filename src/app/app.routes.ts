import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Layout } from './components/layout/layout';
import { ForgotPassword } from './components/forgot-password/forgot-password';
import { Profile } from './components/profile/profile';
import { Roles } from './components/roles/roles';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'forgot-password', component: ForgotPassword },
  { 
    path: 'dashboard', 
    component: Layout,
    children: [
      { path: 'profile', component: Profile },
      { path: 'roles', component: Roles }
    ]
  }
];
