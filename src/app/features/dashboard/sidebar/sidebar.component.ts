import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { PermissionService } from '../../../core/services/permission.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <aside class="app-sidebar">
      <div class="sidebar-header">
        <svg class="logo-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 21h18M3 10l9-7 9 7v11H3V10z"/>
          <path d="M9 21v-6h6v6"/>
        </svg>
        <div class="brand">
          <span class="brand-name">Inmobiliaria Raíces</span>
          <span class="brand-sub">SaaS Multi-tenant</span>
        </div>
      </div>

      <div class="user-badge-box" *ngIf="user">
        <div class="avatar">{{ user.nombre.charAt(0) }}</div>
        <div class="info">
          <div class="user-name">{{ user.nombre }}</div>
          <div class="user-role">{{ getRoleName(user.id_rol) }}</div>
          <div class="company-tag" *ngIf="user.id_empresa">Empresa #{{ user.id_empresa }}</div>
          <div class="company-tag global" *ngIf="!user.id_empresa">Global SaaS</div>
        </div>
      </div>

      <nav class="sidebar-nav">
        <!-- Main Navigation -->
        <div class="nav-section-title">INMOBILIARIA</div>
        
        <a routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-item">
          <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
          <span class="label">Dashboard</span>
        </a>

        <a *ngIf="hasAccess('UI:MENU_CATALOGO')" routerLink="/dashboard/catalogo" routerLinkActive="active" class="nav-item">
          <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
          <span class="label">Catálogo Inmuebles</span>
        </a>

        <a *ngIf="hasAccess('UI:MENU_PROPIEDADES')" routerLink="/dashboard/propiedades" routerLinkActive="active" class="nav-item">
          <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18M5 21V7l7-4 7 4v14"/><path d="M9 10h2v2H9zm4 0h2v2h-2zm-4 4h2v2H9zm4 0h2v2h-2z"/></svg>
          <span class="label">Propiedades</span>
        </a>

        <a *ngIf="hasAccess('UI:MENU_CLIENTES')" routerLink="/dashboard/clientes" routerLinkActive="active" class="nav-item">
          <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          <span class="label">Clientes</span>
        </a>

        <a *ngIf="hasAccess('UI:MENU_PROPIETARIOS')" routerLink="/dashboard/propietarios" routerLinkActive="active" class="nav-item">
          <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.778-7.778zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
          <span class="label">Propietarios</span>
        </a>

        <a *ngIf="hasAccess('UI:MENU_AGENTES')" routerLink="/dashboard/agentes" routerLinkActive="active" class="nav-item">
          <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span class="label">Agentes</span>
        </a>

        <!-- Operaciones Section -->
        <div class="nav-section-title" *ngIf="hasAnyPermission(['UI:MENU_VISITAS', 'UI:MENU_CONTRATOS', 'UI:MENU_PAGOS'])">OPERACIONES</div>
        
        <a *ngIf="hasAccess('UI:MENU_VISITAS')" routerLink="/dashboard/visitas" routerLinkActive="active" class="nav-item">
          <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          <span class="label">Visitas</span>
        </a>

        <a *ngIf="hasAccess('UI:MENU_CONTRATOS')" routerLink="/dashboard/contratos" routerLinkActive="active" class="nav-item">
          <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          <span class="label">Contratos</span>
        </a>

        <a *ngIf="hasAccess('UI:MENU_PAGOS')" routerLink="/dashboard/pagos" routerLinkActive="active" class="nav-item">
          <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
          <span class="label">Pagos</span>
        </a>

        <!-- Administration Section -->
        <div class="nav-section-title" *ngIf="hasAnyPermission(['UI:MENU_EMPRESAS', 'UI:MENU_USUARIOS', 'UI:MENU_ROLES', 'UI:MENU_BITACORA'])">ADMINISTRACIÓN</div>

        <a *ngIf="hasAccess('UI:MENU_EMPRESAS')" routerLink="/dashboard/empresas" routerLinkActive="active" class="nav-item">
          <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 21h4V9l-6-4-6 4v12h4"/><path d="M2 21h10V4L7 1 2 4v17z"/></svg>
          <span class="label">Empresas SaaS</span>
        </a>

        <a *ngIf="hasAccess('UI:MENU_USUARIOS')" routerLink="/dashboard/usuarios" routerLinkActive="active" class="nav-item">
          <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
          <span class="label">Usuarios</span>
        </a>

        <a *ngIf="hasAccess('UI:MENU_ROLES')" routerLink="/dashboard/roles" routerLinkActive="active" class="nav-item">
          <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <span class="label">Roles y Permisos</span>
        </a>

        <a *ngIf="hasAccess('UI:MENU_BITACORA')" routerLink="/dashboard/bitacora" routerLinkActive="active" class="nav-item">
          <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          <span class="label">Bitácora Cifrada</span>
        </a>

        <!-- Exclusive SuperAdmin Technical Info Tab -->
        <a *ngIf="user?.id_rol === 1" routerLink="/dashboard/info-tecnica" routerLinkActive="active" class="nav-item highlight-tech">
          <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          <span class="label">Información Técnica</span>
        </a>

        <!-- User Account -->
        <div class="nav-section-title">MI CUENTA</div>

        <a routerLink="/dashboard/profile" routerLinkActive="active" class="nav-item">
          <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span class="label">Mi Perfil</span>
        </a>

        <button class="nav-item logout-btn" (click)="logout()">
          <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          <span class="label">Cerrar Sesión</span>
        </button>
      </nav>
    </aside>
  `,
  styles: [`
    .app-sidebar {
      width: 260px;
      background: #0f172a;
      color: #94a3b8;
      height: 100vh;
      position: fixed;
      top: 0; left: 0;
      display: flex;
      flex-direction: column;
      border-right: 1px solid #1e293b;
      z-index: 200;
    }
    .sidebar-header {
      padding: 20px 24px;
      display: flex;
      align-items: center;
      gap: 12px;
      border-bottom: 1px solid #1e293b;
    }
    .logo-svg {
      width: 28px;
      height: 28px;
      stroke: #38bdf8;
    }
    .brand-name { font-weight: 700; color: #ffffff; font-size: 15px; display: block; }
    .brand-sub { font-size: 11px; color: #64748b; display: block; }
    .user-badge-box {
      padding: 14px 16px;
      background: #1e293b;
      margin: 16px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .avatar {
      width: 36px; height: 36px;
      background: #2563eb;
      color: white;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 14px;
    }
    .user-name { font-size: 13px; font-weight: 600; color: white; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 130px; }
    .user-role { font-size: 11px; color: #94a3b8; }
    .company-tag { font-size: 10px; color: #38bdf8; margin-top: 2px; }
    .company-tag.global { color: #f59e0b; }
    .sidebar-nav {
      flex: 1;
      overflow-y: auto;
      padding: 0 16px 24px 16px;
    }
    .nav-section-title {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 1px;
      color: #475569;
      margin: 20px 12px 8px 12px;
    }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 14px;
      color: #94a3b8;
      border-radius: 8px;
      font-size: 13.5px;
      font-weight: 500;
      text-decoration: none;
      transition: all 0.15s ease;
      cursor: pointer;
      background: none;
      border: none;
      width: 100%;
      text-align: left;
    }
    .nav-svg {
      width: 18px;
      height: 18px;
      flex-shrink: 0;
    }
    .nav-item:hover {
      background: #1e293b;
      color: #ffffff;
    }
    .nav-item.active {
      background: #2563eb;
      color: #ffffff;
      .nav-svg { stroke: #ffffff; }
    }
    .highlight-tech {
      background: rgba(217, 119, 6, 0.15);
      color: #fbbf24;
      border: 1px solid rgba(245, 158, 11, 0.3);
      &:hover {
        background: rgba(217, 119, 6, 0.3);
        color: #fef08a;
      }
      &.active {
        background: #d97706;
        color: #ffffff;
      }
    }
    .logout-btn {
      color: #f87171;
      margin-top: 8px;
      &:hover {
        background: #450a0a;
        color: #fca5a5;
      }
    }
  `]
})
export class SidebarComponent implements OnInit {
  user: User | null = null;

  constructor(
    private authService: AuthService,
    private permissionService: PermissionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(u => this.user = u);
  }

  hasAccess(permissionCode: string): boolean {
    return this.permissionService.hasPermission(permissionCode);
  }

  hasAnyPermission(codes: string[]): boolean {
    return codes.some(c => this.hasAccess(c));
  }

  getRoleName(idRol: number): string {
    switch (idRol) {
      case 1: return 'Super Administrador';
      case 2: return 'Admin Empresa';
      case 3: return 'Agente Inmobiliario';
      case 4: return 'Cliente / Propietario';
      default: return `Rol #${idRol}`;
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
