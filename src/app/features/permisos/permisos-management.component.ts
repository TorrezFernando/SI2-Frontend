import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PermissionService } from '../../core/services/permission.service';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { Permission } from '../../core/models/permission.model';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-permisos-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="permisos-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Permisos del Sistema</h1>
          <p class="page-subtitle">Matriz global de permisos protegibles (GET /permisos, POST /permisos)</p>
        </div>
        <button class="btn btn-primary" (click)="openCreateModal()" *ngIf="user?.id_rol === 1">
          Registrar Nuevo Permiso
        </button>
      </div>

      <div class="card">
        <div class="table-container" *ngIf="!loading">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID Permiso</th>
                <th>Código de Permiso</th>
                <th>Descripción</th>
                <th>Tipo de Permiso</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let permiso of permisos">
                <td><strong>#{{ permiso.id_permiso }}</strong></td>
                <td><code class="code-badge">{{ permiso.codigo }}</code></td>
                <td>{{ permiso.descripcion || 'Sin descripción' }}</td>
                <td>
                  <span class="badge" [ngClass]="getTypeBadgeClass(permiso.tipo)">
                    {{ permiso.tipo }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="spinner-box" *ngIf="loading">
          <div class="spinner spinner-dark"></div>
          <p>Cargando permisos...</p>
        </div>
      </div>

      <!-- Modal Crear Permiso -->
      <div class="modal-backdrop" *ngIf="showCreateModal" (click)="closeCreateModal()">
        <div class="modal-card" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>Registrar Nuevo Permiso Global</h3>
            <button class="close-btn" (click)="closeCreateModal()">&times;</button>
          </div>
          <form [formGroup]="createPermisoForm" (ngSubmit)="onCreatePermiso()">
            <div class="modal-body">
              <div class="form-group">
                <label for="codigo">Código del Permiso</label>
                <input id="codigo" type="text" formControlName="codigo" placeholder="Ej: UI:MENU_REPORTES">
                <div class="error-msg" *ngIf="f['codigo'].touched && f['codigo'].errors?.['required']">
                  El código es obligatorio.
                </div>
              </div>

              <div class="form-group">
                <label for="descripcion">Descripción</label>
                <input id="descripcion" type="text" formControlName="descripcion" placeholder="Ej: Acceso al menú de reportes globales">
              </div>

              <div class="form-group">
                <label for="tipo">Tipo de Permiso</label>
                <select id="tipo" formControlName="tipo">
                  <option value="UI_Menu">UI_Menu (Menú Lateral)</option>
                  <option value="UI_Boton">UI_Boton (Acción / Botón)</option>
                  <option value="Endpoint">Endpoint (Protección Backend)</option>
                </select>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="closeCreateModal()">Cancelar</button>
              <button type="submit" class="btn btn-primary" [disabled]="createPermisoForm.invalid || creating">
                <span *ngIf="creating" class="spinner"></span>
                <span *ngIf="!creating">Guardar Permiso</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .code-badge { background: #eff6ff; color: #1d4ed8; padding: 3px 8px; border-radius: 4px; font-weight: 700; font-family: monospace; }
    .spinner-box { text-align: center; padding: 40px; }
    .modal-backdrop {
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(15, 23, 42, 0.6);
      display: flex; align-items: center; justify-content: center;
      z-index: 1000; padding: 20px;
    }
    .modal-card {
      background: #ffffff; border-radius: 16px; width: 100%; max-width: 480px;
      padding: 24px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.2);
    }
    .modal-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; }
    .close-btn { background: none; border: none; font-size: 24px; cursor: pointer; color: #64748b; }
    .modal-body { padding: 20px 0; }
    .modal-footer { display: flex; justify-content: flex-end; gap: 12px; border-top: 1px solid #e2e8f0; padding-top: 16px; }
  `]
})
export class PermisosManagementComponent implements OnInit {
  permisos: Permission[] = [];
  loading = true;
  user: User | null = null;

  showCreateModal = false;
  createPermisoForm: FormGroup;
  creating = false;

  constructor(
    private permissionService: PermissionService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private fb: FormBuilder
  ) {
    this.createPermisoForm = this.fb.group({
      codigo: ['', [Validators.required]],
      descripcion: [''],
      tipo: ['UI_Menu', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.user = this.authService.currentUserValue;
    this.loadPermisos();
  }

  get f() { return this.createPermisoForm.controls; }

  loadPermisos(): void {
    this.loading = true;
    this.permissionService.getPermisos().subscribe({
      next: (data) => {
        this.permisos = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  getTypeBadgeClass(tipo: string): string {
    switch (tipo) {
      case 'UI_Menu': return 'badge-info';
      case 'UI_Boton': return 'badge-warning';
      case 'Endpoint': return 'badge-success';
      default: return 'badge-secondary';
    }
  }

  openCreateModal(): void {
    this.createPermisoForm.reset({ tipo: 'UI_Menu' });
    this.showCreateModal = true;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
  }

  onCreatePermiso(): void {
    if (this.createPermisoForm.invalid) return;

    this.creating = true;
    this.permissionService.createPermiso(this.createPermisoForm.value).subscribe({
      next: () => {
        this.creating = false;
        this.notificationService.success('Permiso creado exitosamente.');
        this.closeCreateModal();
        this.loadPermisos();
      },
      error: (err) => {
        this.creating = false;
        this.notificationService.error(err.error?.detail || 'Error al crear el permiso.');
      }
    });
  }
}
