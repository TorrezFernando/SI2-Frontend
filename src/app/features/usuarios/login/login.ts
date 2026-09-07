import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.http.post('http://localhost:8000/gestion_usuarios/auth/login', this.loginForm.value).subscribe({
        next: (response: any) => {
          localStorage.setItem('token', response.access_token);
          
          // Extraer el rol del token JWT
          try {
            const payload = JSON.parse(atob(response.access_token.split('.')[1]));
            localStorage.setItem('user_role', payload.rol);
          } catch (e) {
            console.error('Error leyendo rol del token');
          }
          
          // Redirigir al layout (dashboard)
          this.router.navigate(['/dashboard/profile']);
        },
        error: (err) => {
          this.errorMessage = 'Credenciales inválidas. Por favor intenta de nuevo.';
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
