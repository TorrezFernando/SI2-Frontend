import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  selector: 'app-propietarios',
  templateUrl: './propietarios.html',
})
export class Propietarios implements OnInit {
  propietarios: any[] = [];
  propietarioForm: FormGroup;
  mensajeError: string = '';
  mensajeExito: string = '';
  
  constructor(private http: HttpClient, private fb: FormBuilder, private cdr: ChangeDetectorRef) {
    this.propietarioForm = this.fb.group({
      ci_usuario: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadPropietarios();
  }

  getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  loadPropietarios() {
    this.http.get('http://localhost:8000/modulo_inmuebles/propietarios', { headers: this.getHeaders() })
      .subscribe((res: any) => {
        this.propietarios = res;
        this.cdr.detectChanges();
      });
  }

  onSubmit() {
    if (this.propietarioForm.valid) {
      this.mensajeError = '';
      this.mensajeExito = '';
      this.http.post('http://localhost:8000/modulo_inmuebles/propietarios', this.propietarioForm.value, { headers: this.getHeaders() })
        .subscribe({
          next: () => {
            this.loadPropietarios();
            this.propietarioForm.reset();
            this.mensajeExito = 'Propietario registrado exitosamente.';
            this.cdr.detectChanges();
            setTimeout(() => { this.mensajeExito = ''; this.cdr.detectChanges(); }, 3000);
          },
          error: (err) => {
            console.error(err);
            this.mensajeError = err.error?.detail || 'Error al registrar. Verifique que el CI exista en Usuarios y no esté duplicado.';
            this.cdr.detectChanges();
          }
        });
    }
  }

  deletePropietario(id: number) {
      this.http.delete(`http://localhost:8000/modulo_inmuebles/propietarios/${id}`, { headers: this.getHeaders() })
        .subscribe(() => this.loadPropietarios());
  }
}
