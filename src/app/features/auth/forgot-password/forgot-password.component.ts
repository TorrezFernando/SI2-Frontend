import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h2>Recuperar Contraseña</h2>
          <p>Ingresa tu correo para recibir instrucciones</p>
        </div>

        <form [formGroup]="forgotForm" (ngSubmit)="onSubmit()" *ngIf="!submitted">
          <div class="form-group">
            <label for="correo">Correo Electrónico</label>
            <input id="correo" type="email" formControlName="correo" placeholder="correo@ejemplo.com">
            <div class="error-msg" *ngIf="f['correo'].touched && f['correo'].errors?.['required']">Correo requerido.</div>
            <div class="error-msg" *ngIf="f['correo'].touched && f['correo'].errors?.['email']">Correo inválido.</div>
          </div>

          <button type="submit" class="btn btn-primary btn-block" [disabled]="forgotForm.invalid || loading">
            <span *ngIf="loading" class="spinner"></span>
            <span *ngIf="!loading">Enviar Instrucciones</span>
          </button>
        </form>

        <div class="alert alert-success" *ngIf="submitted">
          {{ serverResponse }}
        </div>

        <div class="auth-footer">
          <a routerLink="/login">← Volver al inicio de sesión</a>
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
      max-width: 420px;
      padding: 32px;
      border-radius: 16px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2);
    }
    .auth-header {
      text-align: center;
      margin-bottom: 24px;
      h2 { font-size: 20px; color: #0f172a; }
      p { color: #64748b; font-size: 13px; margin-top: 4px; }
    }
    .btn-block { width: 100%; padding: 12px; }
    .auth-footer { margin-top: 20px; text-align: center; font-size: 13px; }
  `]
})
export class ForgotPasswordComponent {
  forgotForm: FormGroup;
  loading = false;
  submitted = false;
  serverResponse = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {
    this.forgotForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]]
    });
  }

  get f() { return this.forgotForm.controls; }

  onSubmit(): void {
    if (this.forgotForm.invalid) return;

    this.loading = true;
    this.authService.forgotPassword(this.forgotForm.value).subscribe({
      next: (res) => {
        this.loading = false;
        this.submitted = true;
        this.serverResponse = res.message;
        this.notificationService.info(res.message);
      },
      error: () => {
        this.loading = false;
        // Incluso en error mostramos mensaje amigable sin revelar
        this.submitted = true;
        this.serverResponse = 'Si el correo existe, se han enviado las instrucciones de recuperación.';
      }
    });
  }
}
