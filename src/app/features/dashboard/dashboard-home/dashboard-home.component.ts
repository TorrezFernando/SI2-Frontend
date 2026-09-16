import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { PermissionService } from '../../../core/services/permission.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard-home">
      <!-- Welcome Hero Banner -->
      <div class="welcome-card" *ngIf="user">
        <div class="welcome-text">
          <h1>Bienvenido, {{ user.nombre }}</h1>
          <p class="role-desc">
            Te has autenticado como <strong class="badge badge-info">{{ getRoleName(user.id_rol) }}</strong>
            <span *ngIf="user.id_empresa"> en la empresa <strong>#{{ user.id_empresa }}</strong></span>.
          </p>
          <p class="tenant-isolation-note" *ngIf="user.id_empresa">
            Aislamiento Multi-tenant Activo: Tus permisos y operaciones están estrictamente delimitados a tu empresa asignada.
          </p>
          <p class="tenant-isolation-note global" *ngIf="!user.id_empresa">
            Modo Global SaaS: Tienes alcance para administrar múltiples inquilinos y auditoría de la plataforma.
          </p>
        </div>
      </div>

      <!-- Quick Action Cards Grid -->
      <div class="quick-cards-grid">
        <!-- Catálogo -->
        <div class="dashboard-card" *ngIf="hasAccess('UI:MENU_CATALOGO')">
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
          </div>
          <h3>Catálogo Inmobiliario</h3>
          <p>Explora y filtra las propiedades disponibles de tu empresa o de la red SaaS.</p>
          <a routerLink="/dashboard/catalogo" class="btn btn-outline btn-sm">Ver Catálogo →</a>
        </div>

        <!-- Perfil -->
        <div class="dashboard-card">
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <h3>Mi Perfil & Seguridad</h3>
          <p>Consulta tus datos personales, permisos dinámicos y actualiza tu contraseña.</p>
          <a routerLink="/dashboard/profile" class="btn btn-outline btn-sm">Gestionar Perfil →</a>
        </div>

        <!-- Roles & Permisos -->
        <div class="dashboard-card" *ngIf="hasAccess('UI:MENU_ROLES')">
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <h3>Gestión de Roles</h3>
          <p>Administra los roles del sistema y asigna matriz de permisos RBAC/CBAC.</p>
          <a routerLink="/dashboard/roles" class="btn btn-outline btn-sm">Ir a Roles →</a>
        </div>

        <!-- Permisos -->
        <div class="dashboard-card" *ngIf="hasAccess('UI:MENU_ROLES')">
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.778-7.778zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
          </div>
          <h3>Permisos registrables</h3>
          <p>Consulta los identificadores dinámicos de UI_Menu, UI_Boton y Endpoint.</p>
          <a routerLink="/dashboard/permisos" class="btn btn-outline btn-sm">Ver Permisos →</a>
        </div>

        <!-- Bitácora (SuperAdmin) -->
        <div class="dashboard-card bitacora-card" *ngIf="hasAccess('UI:MENU_BITACORA')">
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
          <h3>Bitácora Cifrada (Auditoría)</h3>
          <p>Descifra los registros de auditoría HTTP e IP mediante llave de desarrollo.</p>
          <a routerLink="/dashboard/bitacora" class="btn btn-primary btn-sm">Consultar Logs →</a>
        </div>

        <!-- Exclusive SuperAdmin Info Técnica -->
        <div class="dashboard-card tech-card" *ngIf="user?.id_rol === 1">
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          </div>
          <h3>Información Técnica</h3>
          <p>Consulta el informe de integración técnica entre el Frontend y el Backend FastAPI.</p>
          <a routerLink="/dashboard/info-tecnica" class="btn btn-warning btn-sm">Ver Informe →</a>
        </div>
      </div>

      <!-- Granted Permissions Badges -->
      <div class="card permissions-overview" *ngIf="user && user.permisos">
        <h3>Permisos Dinámicos Concedidos</h3>
        <p class="sub">Estos permisos fueron inyectados directamente por el backend FastAPI (GET /users/me):</p>

        <div class="badges-wrapper" *ngIf="user.permisos.length > 0">
          <span class="badge badge-secondary" *ngFor="let p of user.permisos">{{ p }}</span>
        </div>
        <div class="alert alert-success" *ngIf="user.id_rol === 1">
          <strong>Super Administrador:</strong> Posees permisos globales irrestrictos sobre todas las rutas y operaciones.
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-home { display: flex; flex-direction: column; gap: 24px; }
    .welcome-card {
      background: linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%);
      color: #ffffff; padding: 32px; border-radius: 16px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }
    .welcome-card h1 { color: #ffffff; font-size: 26px; margin-bottom: 8px; }
    .role-desc { font-size: 15px; color: #cbd5e1; }
    .tenant-isolation-note {
      margin-top: 16px; background: rgba(255, 255, 255, 0.1); padding: 10px 16px; border-radius: 8px; font-size: 13px; color: #e2e8f0;
    }
    .quick-cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
    .dashboard-card {
      background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; display: flex; flex-direction: column; box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .card-icon { width: 36px; height: 36px; margin-bottom: 12px; stroke: #2563eb; }
    .dashboard-card h3 { font-size: 16px; color: #0f172a; margin-bottom: 8px; }
    .dashboard-card p { font-size: 13px; color: #64748b; margin-bottom: 20px; flex: 1; }
    .dashboard-card .btn { align-self: flex-start; }
    .dashboard-card.bitacora-card { border-color: #93c5fd; background: #f0f9ff; .card-icon { stroke: #0284c7; } }
    .dashboard-card.tech-card { border-color: #fde68a; background: #fffbeb; .card-icon { stroke: #d97706; } }
    .permissions-overview h3 { font-size: 16px; color: #0f172a; margin-bottom: 4px; }
    .permissions-overview .sub { font-size: 13px; color: #64748b; margin-bottom: 16px; }
    .badges-wrapper { display: flex; flex-wrap: wrap; gap: 8px; }
    .btn-warning { background: #d97706; color: white; &:hover { background: #b45309; } }
  `]
})
export class DashboardHomeComponent implements OnInit {
  user: User | null = null;

  constructor(
    private authService: AuthService,
    private permissionService: PermissionService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(u => this.user = u);
  }

  hasAccess(permissionCode: string): boolean {
    return this.permissionService.hasPermission(permissionCode);
  }

  getRoleName(idRol: number): string {
    switch (idRol) {
      case 1: return 'Super Administrador';
      case 2: return 'Administrador de Empresa';
      case 3: return 'Agente Inmobiliario';
      case 4: return 'Cliente / Propietario';
      default: return `Rol #${idRol}`;
    }
  }
}
