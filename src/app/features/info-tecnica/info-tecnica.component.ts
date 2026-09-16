import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-info-tecnica',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tech-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Información Técnica del Sistema</h1>
          <p class="page-subtitle">Indicadores de transparencia técnica entre el Frontend Web y el Backend FastAPI</p>
        </div>
        <span class="badge badge-warning">Vista Exclusiva SuperAdmin</span>
      </div>

      <!-- General Status Card -->
      <div class="card status-overview">
        <div class="status-grid">
          <div class="status-box">
            <span class="label">Backend Server</span>
            <span class="val success">FastAPI + Python (127.0.0.1:8000)</span>
          </div>
          <div class="status-box">
            <span class="label">Base de Datos</span>
            <span class="val success">SQLite (raices.db) + SQLAlchemy ORM</span>
          </div>
          <div class="status-box">
            <span class="label">Frontend Web</span>
            <span class="val success">Angular 17+ (Standalone + Pure SCSS)</span>
          </div>
          <div class="status-box">
            <span class="label">Aislamiento SaaS</span>
            <span class="val success">Header X-Tenant-ID & JWT Claims</span>
          </div>
        </div>
      </div>

      <!-- Modules Mapping Table Card -->
      <div class="card">
        <h3>Matriz de Integración Backend por Módulo</h3>
        <p class="desc">Detalle de endpoints implementados y estado de preparación en la API REST:</p>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Módulo</th>
                <th>Endpoints Backend Reales</th>
                <th>Estado de Integración</th>
                <th>Detalle Técnico</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Autenticación & Sesión</strong></td>
                <td><code>POST /login</code>, <code>POST /register</code>, <code>POST /forgot-password</code></td>
                <td><span class="badge badge-success">100% Conectado</span></td>
                <td>Tokens JWT firmados con algoritmo HS256 (sub, rol, id_empresa).</td>
              </tr>
              <tr>
                <td><strong>Perfil & Seguridad</strong></td>
                <td><code>GET /users/me</code>, <code>PUT /users/me/password</code></td>
                <td><span class="badge badge-success">100% Conectado</span></td>
                <td>Validación de complejidad con Regex en FastAPI + Pydantic.</td>
              </tr>
              <tr>
                <td><strong>Catálogo Inmobiliario</strong></td>
                <td><code>GET /modulo_inmuebles/propiedades/catalogo</code></td>
                <td><span class="badge badge-success">100% Conectado</span></td>
                <td>Filtros EAV por atributos extendidos (Cuartos, Baños, Metros, Zona) + Multi-tenant.</td>
              </tr>
              <tr>
                <td><strong>Roles y Permisos</strong></td>
                <td><code>GET /roles</code>, <code>POST /roles</code>, <code>PUT /roles/&#123;id&#125;/permisos</code>, <code>GET /permisos</code>, <code>POST /permisos</code></td>
                <td><span class="badge badge-success">100% Conectado</span></td>
                <td>Inyección de matriz RBAC/CBAC para guardias de frontend y sidebar dinámico.</td>
              </tr>
              <tr>
                <td><strong>Bitácora Cifrada</strong></td>
                <td><code>GET /admin/bitacora?dev_key=...</code></td>
                <td><span class="badge badge-success">100% Conectado</span></td>
                <td>Desencriptación en tiempo real con cifrado simétrico Fernet. Exclusivo Rol #1.</td>
              </tr>
              <tr>
                <td><strong>Empresas SaaS (Tenants)</strong></td>
                <td><code class="muted">Pendiente de endpoints POST/GET /admin/empresas</code></td>
                <td><span class="badge badge-warning">Módulo Preparado</span></td>
                <td>Tabla <code>empresa</code> existe en BD. Interfaz diseñada a la espera de endpoints CRUD.</td>
              </tr>
              <tr>
                <td><strong>Gestión de Usuarios</strong></td>
                <td><code class="muted">Pendiente de endpoints GET/POST /gestion_usuarios</code></td>
                <td><span class="badge badge-warning">Módulo Preparado</span></td>
                <td>Tabla <code>usuario</code> existe en BD. Interfaz diseñada a la espera de endpoints CRUD.</td>
              </tr>
              <tr>
                <td><strong>Propiedades (CRUD Admin)</strong></td>
                <td><code class="muted">Pendiente de endpoints POST/PUT/DELETE /propiedades</code></td>
                <td><span class="badge badge-warning">Módulo Preparado</span></td>
                <td>Tabla <code>propiedad</code> e <code>imagen</code> en BD. Interfaz diseñada a la espera de endpoints CRUD.</td>
              </tr>
              <tr>
                <td><strong>Personas (Clientes/Propietarios/Agentes)</strong></td>
                <td><code class="muted">Pendiente de endpoints CRUD dedicados</code></td>
                <td><span class="badge badge-warning">Módulo Preparado</span></td>
                <td>Tablas relacionales 1-a-1 en BD. Interfaz diseñada a la espera de endpoints.</td>
              </tr>
              <tr>
                <td><strong>Visitas, Contratos y Pagos</strong></td>
                <td><code class="muted">Pendiente de endpoints transaccionales</code></td>
                <td><span class="badge badge-warning">Módulo Preparado</span></td>
                <td>Tablas <code>visita</code>, <code>contrato</code> y <code>pago</code> estructuradas en BD SQLite. Interfaz lista.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .status-overview { padding: 20px; }
    .status-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
    }
    .status-box {
      background: #f8fafc;
      padding: 14px 18px;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .status-box .label { font-size: 12px; font-weight: 600; color: #64748b; }
    .status-box .val { font-size: 13px; font-weight: 700; }
    .status-box .val.success { color: #166534; }
    .desc { font-size: 13px; color: #64748b; margin-bottom: 16px; }
    code.muted { color: #94a3b8; background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-size: 12px; }
  `]
})
export class InfoTecnicaComponent implements OnInit {
  user: User | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.user = this.authService.currentUserValue;
  }
}
