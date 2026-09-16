import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="profile-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Mi Perfil</h1>
          <p class="page-subtitle">Información del usuario autenticado y actualización de contraseña</p>
        </div>
      </div>

      <div class="profile-grid" *ngIf="user">
        <!-- Personal Information Card -->
        <div class="card info-card">
          <h3>Datos Personales</h3>
          <div class="info-list">
            <div class="info-item">
              <span class="label">Cédula de Identidad (CI):</span>
              <span class="value">{{ user.ci }}</span>
            </div>
            <div class="info-item">
              <span class="label">Nombre Completo:</span>
              <span class="value">{{ user.nombre }}</span>
            </div>
            <div class="info-item">
              <span class="label">Correo Electrónico:</span>
              <span class="value">{{ user.correo }}</span>
            </div>
            <div class="info-item">
              <span class="label">Teléfono:</span>
              <span class="value">{{ user.telefono || 'No registrado' }}</span>
            </div>
            <div class="info-item">
              <span class="label">ID Empresa (Tenant):</span>
              <span class="value">{{ user.id_empresa ? '#' + user.id_empresa : 'Ninguna (SuperAdmin)' }}</span>
            </div>
            <div class="info-item">
              <span class="label">ID Rol Asignado:</span>
              <span class="value">#{{ user.id_rol }}</span>
            </div>
          </div>
        </div>

        <!-- Password Update Form Card -->
        <div class="card password-card">
          <h3>Cambiar Contraseña</h3>
          <p class="desc">La nueva contraseña se validará en el backend FastAPI con reglas estrictas de seguridad.</p>

          <form [formGroup]="passwordForm" (ngSubmit)="onUpdatePassword()">
            <div class="form-group">
              <label for="nueva_password">Nueva Contraseña</label>
              <input 
                id="nueva_password" 
                type="password" 
                formControlName="nueva_password" 
                placeholder="••••••••">
              <div class="error-msg" *ngIf="f['nueva_password'].touched && f['nueva_password'].errors?.['required']">
                La nueva contraseña es requerida.
              </div>
              <div class="error-msg" *ngIf="f['nueva_password'].touched && f['nueva_password'].errors?.['pattern']">
                Debe tener mínimo 8 caracteres, 1 mayúscula, 1 número y 1 carácter especial (&#64;$!%*?&).
              </div>
            </div>

            <div class="form-group">
              <label for="confirm_password">Confirmar Nueva Contraseña</label>
              <input 
                id="confirm_password" 
                type="password" 
                formControlName="confirm_password" 
                placeholder="••••••••">
              <div class="error-msg" *ngIf="passwordForm.errors?.['mismatch'] && f['confirm_password'].touched">
                Las contraseñas no coinciden.
              </div>
            </div>

            <button type="submit" class="btn btn-primary" [disabled]="passwordForm.invalid || loading">
              <span *ngIf="loading" class="spinner"></span>
              <span *ngIf="!loading">Actualizar Contraseña</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    @media (max-width: 900px) { .profile-grid { grid-template-columns: 1fr; } }
    .info-card h3 { margin-bottom: 20px; color: #0f172a; font-size: 16px; }
    .info-list { display: flex; flex-direction: column; gap: 14px; }
    .info-item { display: flex; justify-content: space-between; padding-bottom: 10px; border-bottom: 1px solid #f1f5f9; }
    .info-item .label { font-weight: 600; color: #64748b; font-size: 13px; }
    .info-item .value { color: #0f172a; font-weight: 600; font-size: 13.5px; }
    .password-card h3 { margin-bottom: 6px; color: #0f172a; font-size: 16px; }
    .password-card .desc { font-size: 13px; color: #64748b; margin-bottom: 20px; }
  `]
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  passwordForm: FormGroup;
  loading = false;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private notificationService: NotificationService
  ) {
    this.passwordForm = this.fb.group({
      nueva_password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
      ]],
      confirm_password: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(u => this.user = u);
  }

  get f() { return this.passwordForm.controls; }

  passwordMatchValidator(g: FormGroup) {
    return g.get('nueva_password')?.value === g.get('confirm_password')?.value
      ? null : { mismatch: true };
  }

  onUpdatePassword(): void {
    if (this.passwordForm.invalid) return;

    this.loading = true;
    this.authService.changePassword({ nueva_password: this.f['nueva_password'].value }).subscribe({
      next: (res) => {
        this.loading = false;
        this.notificationService.success(res.message || 'Contraseña actualizada exitosamente.');
        this.passwordForm.reset();
      },
      error: (err) => {
        this.loading = false;
        const msg = err.error?.detail || 'Error al actualizar la contraseña.';
        this.notificationService.error(msg);
      }
    });
  }
}
