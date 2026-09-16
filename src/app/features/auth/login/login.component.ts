import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <svg class="logo-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 21h18M3 10l9-7 9 7v11H3V10z"/>
            <path d="M9 21v-6h6v6"/>
          </svg>
          <h2>Inmobiliaria Raíces</h2>
          <p>Sistema SaaS Multi-tenant</p>
        </div>

        <!-- Lockout Warning Banner -->
        <div class="alert alert-danger" *ngIf="isLocked">
          <strong>Cuenta Bloqueada Temporalmente:</strong> Has superado el límite de 3 intentos fallidos. Por favor espera {{ lockoutTimer }} segundos para volver a intentarlo.
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" *ngIf="!isLocked">
          <div class="form-group">
            <label for="correo">Correo Electrónico</label>
            <input 
              id="correo" 
              type="email" 
              formControlName="correo" 
              placeholder="ejemplo@raices.com" 
              autocomplete="email">
            <div class="error-msg" *ngIf="f['correo'].touched && f['correo'].errors?.['required']">
              El correo es requerido.
            </div>
            <div class="error-msg" *ngIf="f['correo'].touched && f['correo'].errors?.['email']">
              Ingrese un correo válido.
            </div>
          </div>

          <div class="form-group">
            <label for="password">Contraseña</label>
            <input 
              id="password" 
              type="password" 
              formControlName="password" 
              placeholder="••••••••" 
              autocomplete="current-password">
            <div class="error-msg" *ngIf="f['password'].touched && f['password'].errors?.['required']">
              La contraseña es requerida.
            </div>
          </div>

          <div class="attempts-info" *ngIf="failedAttempts > 0 && failedAttempts < 3">
            <span class="text-warning">Intentos fallidos: {{ failedAttempts }} de 3</span>
          </div>

          <div class="auth-options">
            <a routerLink="/forgot-password" class="forgot-link">¿Olvidaste tu contraseña?</a>
          </div>

          <button type="submit" class="btn btn-primary btn-block" [disabled]="loginForm.invalid || loading">
            <span *ngIf="loading" class="spinner"></span>
            <span *ngIf="!loading">Iniciar Sesión</span>
          </button>
        </form>

        <div class="auth-footer">
          <p>¿No tienes cuenta? <a routerLink="/register">Regístrate aquí</a></p>
          <div class="public-link">
            <a routerLink="/catalogo">← Explorar Catálogo Público</a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh; display: flex; align-items: center; justify-content: center;
      background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%); padding: 20px;
    }
    .auth-card {
      background: #ffffff; width: 100%; max-width: 420px; padding: 36px;
      border-radius: 16px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2);
    }
    .auth-header {
      text-align: center; margin-bottom: 24px;
      .logo-svg { width: 44px; height: 44px; stroke: #2563eb; margin-bottom: 8px; }
      h2 { font-size: 24px; color: #0f172a; }
      p { color: #64748b; font-size: 13px; margin-top: 4px; }
    }
    .attempts-info { font-size: 12.5px; margin-bottom: 12px; font-weight: 600; color: #d97706; }
    .auth-options { display: flex; justify-content: flex-end; margin-bottom: 20px; .forgot-link { font-size: 12.5px; } }
    .btn-block { width: 100%; padding: 12px; }
    .auth-footer {
      margin-top: 24px; text-align: center; font-size: 13px; color: #64748b;
      border-top: 1px solid #f1f5f9; padding-top: 16px;
      .public-link { margin-top: 12px; }
    }
  `]
})
export class LoginComponent implements OnDestroy {
  loginForm: FormGroup;
  loading = false;
  failedAttempts = 0;
  isLocked = false;
  lockoutTimer = 30;
  private intervalId: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  get f() { return this.loginForm.controls; }

  onSubmit(): void {
    if (this.loginForm.invalid || this.isLocked) return;

    this.loading = true;
    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.failedAttempts = 0;
        this.notificationService.success('Bienvenido de nuevo');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.failedAttempts++;

        if (this.failedAttempts >= 3) {
          this.triggerLockout();
        } else {
          const msg = err.error?.detail || `Credenciales inválidas. Intento ${this.failedAttempts} de 3.`;
          this.notificationService.error(msg);
        }
      }
    });
  }

  private triggerLockout(): void {
    this.isLocked = true;
    this.lockoutTimer = 30;
    this.notificationService.error('Has superado 3 intentos fallidos. Tu acceso se ha bloqueado por 30 segundos.');

    this.intervalId = setInterval(() => {
      this.lockoutTimer--;
      if (this.lockoutTimer <= 0) {
        clearInterval(this.intervalId);
        this.isLocked = false;
        this.failedAttempts = 0;
        this.notificationService.info('Ya puedes volver a intentar iniciar sesión.');
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
