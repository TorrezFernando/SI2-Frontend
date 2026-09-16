import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RoleService } from '../../core/services/role.service';
import { PermissionService } from '../../core/services/permission.service';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { Role } from '../../core/models/role.model';
import { Permission } from '../../core/models/permission.model';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-roles-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="roles-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Gestión de Roles</h1>
          <p class="page-subtitle">Visualiza, crea y asigna la matriz de permisos a roles (GET /roles, POST /roles, PUT /roles/:id/permisos)</p>
        </div>
        <button class="btn btn-primary" (click)="openCreateModal()" *ngIf="canCreateRole">
          Crear Nuevo Rol
        </button>
      </div>

      <!-- Roles Table Card -->
      <div class="card">
        <div class="table-container" *ngIf="!loading">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID Rol</th>
                <th>Nombre del Rol</th>
                <th>Ámbito / Empresa</th>
                <th>Permisos Asignados</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let role of roles">
                <td><strong>#{{ role.id_rol }}</strong></td>
                <td>
                  <span class="role-name">{{ role.nombre }}</span>
                </td>
                <td>
                  <span class="badge badge-info" *ngIf="!role.id_empresa">Global SaaS</span>
                  <span class="badge badge-secondary" *ngIf="role.id_empresa">Empresa #{{ role.id_empresa }}</span>
                </td>
                <td>
                  <span class="badge badge-success" style="margin-right: 4px;" *ngFor="let pId of role.permisos">
                    #{{ pId }} {{ getPermissionCode(pId) }}
                  </span>
                  <span class="text-muted" *ngIf="role.permisos.length === 0">Sin permisos</span>
                </td>
                <td>
                  <button class="btn btn-outline btn-sm" (click)="openEditPermisosModal(role)">
                    Editar Permisos
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="spinner-box" *ngIf="loading">
          <div class="spinner spinner-dark"></div>
          <p>Cargando roles...</p>
        </div>
      </div>

      <!-- Modal Crear Rol -->
      <div class="modal-backdrop" *ngIf="showCreateModal" (click)="closeCreateModal()">
        <div class="modal-card" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>Crear Nuevo Rol</h3>
            <button class="close-btn" (click)="closeCreateModal()">&times;</button>
          </div>
          <form [formGroup]="createRoleForm" (ngSubmit)="onCreateRole()">
            <div class="modal-body">
              <div class="form-group">
                <label for="nombre">Nombre del Rol</label>
                <input id="nombre" type="text" formControlName="nombre" placeholder="Ej: Supervisor de Ventas">
                <div class="error-msg" *ngIf="f['nombre'].touched && f['nombre'].errors?.['required']">
                  El nombre es obligatorio.
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="closeCreateModal()">Cancelar</button>
              <button type="submit" class="btn btn-primary" [disabled]="createRoleForm.invalid || creating">
                <span *ngIf="creating" class="spinner"></span>
                <span *ngIf="!creating">Guardar Rol</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal Asignar Permisos a Rol -->
      <div class="modal-backdrop" *ngIf="selectedRole" (click)="closeEditPermisosModal()">
        <div class="modal-card modal-lg" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>Asignar Permisos a: {{ selectedRole.nombre }}</h3>
            <button class="close-btn" (click)="closeEditPermisosModal()">&times;</button>
          </div>
          <div class="modal-body">
            <p class="subtitle">Selecciona los permisos que tendrán los usuarios asignados a este rol:</p>

            <div class="permisos-checklist">
              <label class="permiso-checkbox" *ngFor="let p of allPermisos">
                <input 
                  type="checkbox" 
                  [checked]="isPermisoSelected(p.id_permiso)" 
                  (change)="togglePermiso(p.id_permiso)">
                <div class="permiso-info">
                  <span class="code">{{ p.codigo }}</span>
                  <span class="desc">{{ p.descripcion }} — <small class="perm-type">[{{ p.tipo }}]</small></span>
                </div>
              </label>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="closeEditPermisosModal()">Cancelar</button>
            <button type="button" class="btn btn-primary" [disabled]="savingPermisos" (click)="onSavePermisos()">
              <span *ngIf="savingPermisos" class="spinner"></span>
              <span *ngIf="!savingPermisos">Actualizar Permisos</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .role-name { font-weight: 700; color: #0f172a; }
    .spinner-box { text-align: center; padding: 40px; }
    .modal-backdrop {
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(15, 23, 42, 0.6);
      display: flex; align-items: center; justify-content: center;
      z-index: 1000; padding: 20px;
    }
    .modal-card {
      background: #ffffff; border-radius: 16px; width: 100%; max-width: 460px;
      padding: 24px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.2);
    }
    .modal-card.modal-lg { max-width: 650px; }
    .modal-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; }
    .close-btn { background: none; border: none; font-size: 24px; cursor: pointer; color: #64748b; }
    .modal-body { padding: 20px 0; }
    .subtitle { font-size: 13px; color: #64748b; margin-bottom: 16px; }
    .modal-footer { display: flex; justify-content: flex-end; gap: 12px; border-top: 1px solid #e2e8f0; padding-top: 16px; }
    .permisos-checklist {
      display: flex; flex-direction: column; gap: 10px; max-height: 350px; overflow-y: auto; padding-right: 8px;
    }
    .permiso-checkbox {
      display: flex; align-items: flex-start; gap: 12px; padding: 10px 14px;
      border: 1px solid #e2e8f0; border-radius: 8px; cursor: pointer;
    }
    .permiso-checkbox:hover { background: #f8fafc; }
    .permiso-checkbox input { margin-top: 3px; }
    .code { font-weight: 700; color: #1e3a8a; font-size: 13.5px; display: block; }
    .desc { font-size: 12.5px; color: #64748b; }
    .perm-type { color: #d97706; font-weight: 600; }
  `]
})
export class RolesManagementComponent implements OnInit {
  roles: Role[] = [];
  allPermisos: Permission[] = [];
  loading = true;
  user: User | null = null;
  canCreateRole = false;

  showCreateModal = false;
  createRoleForm: FormGroup;
  creating = false;

  selectedRole: Role | null = null;
  selectedPermisosIds: number[] = [];
  savingPermisos = false;

  constructor(
    private roleService: RoleService,
    private permissionService: PermissionService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private fb: FormBuilder
  ) {
    this.createRoleForm = this.fb.group({
      nombre: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.user = this.authService.currentUserValue;
    this.canCreateRole = !!(this.user && [1, 2].includes(this.user.id_rol));
    this.loadData();
  }

  get f() { return this.createRoleForm.controls; }

  loadData(): void {
    this.loading = true;
    this.roleService.getRoles().subscribe({
      next: (rData) => {
        this.roles = rData;
        this.permissionService.getPermisos().subscribe({
          next: (pData) => {
            this.allPermisos = pData;
            this.loading = false;
          },
          error: () => this.loading = false
        });
      },
      error: () => this.loading = false
    });
  }

  getPermissionCode(idPermiso: number): string {
    const p = this.allPermisos.find(item => item.id_permiso === idPermiso);
    return p ? '(' + p.codigo + ')' : '';
  }

  openCreateModal(): void {
    this.createRoleForm.reset();
    this.showCreateModal = true;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
  }

  onCreateRole(): void {
    if (this.createRoleForm.invalid) return;

    this.creating = true;
    this.roleService.createRole(this.createRoleForm.value).subscribe({
      next: () => {
        this.creating = false;
        this.notificationService.success('Rol creado exitosamente.');
        this.closeCreateModal();
        this.loadData();
      },
      error: (err) => {
        this.creating = false;
        this.notificationService.error(err.error?.detail || 'Error al crear el rol.');
      }
    });
  }

  openEditPermisosModal(role: Role): void {
    this.selectedRole = role;
    this.selectedPermisosIds = [...role.permisos];
  }

  closeEditPermisosModal(): void {
    this.selectedRole = null;
    this.selectedPermisosIds = [];
  }

  isPermisoSelected(idPermiso: number): boolean {
    return this.selectedPermisosIds.includes(idPermiso);
  }

  togglePermiso(idPermiso: number): void {
    if (this.isPermisoSelected(idPermiso)) {
      this.selectedPermisosIds = this.selectedPermisosIds.filter(id => id !== idPermiso);
    } else {
      this.selectedPermisosIds.push(idPermiso);
    }
  }

  onSavePermisos(): void {
    if (!this.selectedRole) return;

    this.savingPermisos = true;
    this.roleService.updateRolePermisos(this.selectedRole.id_rol, this.selectedPermisosIds).subscribe({
      next: (res) => {
        this.savingPermisos = false;
        this.notificationService.success(res.message || 'Permisos actualizados.');
        this.closeEditPermisosModal();
        this.loadData();
      },
      error: (err) => {
        this.savingPermisos = false;
        this.notificationService.error(err.error?.detail || 'Error actualizando permisos.');
      }
    });
  }
}
