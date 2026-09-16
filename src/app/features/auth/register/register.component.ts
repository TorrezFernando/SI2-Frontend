import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h2>Crear Cuenta</h2>
          <p>Registrarse en la plataforma inmobiliaria</p>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="form-grid">
            <div class="form-group">
              <label for="ci">Cédula de Identidad (CI)</label>
              <input id="ci" type="text" formControlName="ci" placeholder="Ej: 1234567">
              <div class="error-msg" *ngIf="f['ci'].touched && f['ci'].errors?.['required']">CI es obligatorio.</div>
            </div>

            <div class="form-group">
              <label for="nombre">Nombre Completo</label>
              <input id="nombre" type="text" formControlName="nombre" placeholder="Ej: Juan Pérez">
              <div class="error-msg" *ngIf="f['nombre'].touched && f['nombre'].errors?.['required']">Nombre es obligatorio.</div>
            </div>
          </div>

          <div class="form-group">
            <label for="correo">Correo Electrónico</label>
            <input id="correo" type="email" formControlName="correo" placeholder="correo@ejemplo.com">
            <div class="error-msg" *ngIf="f['correo'].touched && f['correo'].errors?.['required']">Correo es obligatorio.</div>
            <div class="error-msg" *ngIf="f['correo'].touched && f['correo'].errors?.['email']">Ingrese un correo válido.</div>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label for="telefono">Teléfono / Celular</label>
              <input id="telefono" type="text" formControlName="telefono" placeholder="Ej: 77712345">
            </div>

            <div class="form-group">
              <label for="id_rol">Tipo de Usuario</label>
              <select id="id_rol" formControlName="id_rol">
                <option [ngValue]="4">Cliente (Comprador/Inquilino)</option>
                <option [ngValue]="3">Propietario</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label for="password">Contraseña</label>
            <input id="password" type="password" formControlName="password" placeholder="••••••••">
            
            <!-- Real-time Password Strength Checklist -->
            <div class="password-checklist">
              <div class="check-item" [ngClass]="{'valid': hasMinLength}">
                <span class="icon">{{ hasMinLength ? '✅' : '❌' }}</span> Mínimo 8 caracteres
              </div>
              <div class="check-item" [ngClass]="{'valid': hasUppercase}">
                <span class="icon">{{ hasUppercase ? '✅' : '❌' }}</span> Al menos 1 letra mayúscula (A-Z)
              </div>
              <div class="check-item" [ngClass]="{'valid': hasNumber}">
                <span class="icon">{{ hasNumber ? '✅' : '❌' }}</span> Al menos 1 número (0-9)
              </div>
              <div class="check-item" [ngClass]="{'valid': hasSymbol}">
                <span class="icon">{{ hasSymbol ? '✅' : '❌' }}</span> Al menos 1 símbolo (&#64;$!%*?&)
              </div>
            </div>
          </div>

          <button type="submit" class="btn btn-primary btn-block" [disabled]="registerForm.invalid || loading">
            <span *ngIf="loading" class="spinner"></span>
            <span *ngIf="!loading">Registrarme</span>
          </button>
        </form>

        <div class="auth-footer">
          <p>¿Ya tienes una cuenta? <a routerLink="/login">Iniciar sesión</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);
      padding: 20px;
    }
    .auth-card {
      background: #ffffff;
      width: 100%;
      max-width: 500px;
      padding: 32px;
      border-radius: 16px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2);
    }
    .auth-header {
      text-align: center;
      margin-bottom: 24px;
      h2 { font-size: 22px; color: #0f172a; }
      p { color: #64748b; font-size: 13px; }
    }
    .password-checklist {
      margin-top: 10px;
      background: #f8fafc;
      padding: 12px;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
      display: flex;
      flex-direction: column;
      gap: 6px;
      font-size: 12px;
    }
    .check-item {
      color: #94a3b8;
      display: flex;
      align-items: center;
      gap: 6px;
      &.valid {
        color: #166534;
        font-weight: 600;
      }
    }
    .btn-block { width: 100%; padding: 12px; margin-top: 12px; }
    .auth-footer { margin-top: 20px; text-align: center; font-size: 13px; color: #64748b; }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      ci: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      telefono: [''],
      id_rol: [4, [Validators.required]],
      id_empresa: [1],
      password: ['', [
        Validators.required, 
        Validators.minLength(8), 
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
      ]]
    });
  }

  get f() { return this.registerForm.controls; }

  get passwordVal(): string {
    return this.f['password'].value || '';
  }

  get hasMinLength(): boolean {
    return this.passwordVal.length >= 8;
  }

  get hasUppercase(): boolean {
    return /[A-Z]/.test(this.passwordVal);
  }

  get hasNumber(): boolean {
    return /\d/.test(this.passwordVal);
  }

  get hasSymbol(): boolean {
    return /[@$!%*?&]/.test(this.passwordVal);
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.loading = true;
    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.notificationService.success('Registro exitoso. Ya puedes iniciar sesión.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        const msg = err.error?.detail || 'Error al registrar el usuario.';
        this.notificationService.error(msg);
      }
    });
  }
}
