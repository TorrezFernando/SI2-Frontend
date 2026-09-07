import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  selector: 'app-agentes',
  templateUrl: './agentes.html',
})
export class Agentes implements OnInit {
  agentes: any[] = [];
  agenteForm: FormGroup;
  mensajeError: string = '';
  mensajeExito: string = '';
  
  constructor(private http: HttpClient, private fb: FormBuilder, private cdr: ChangeDetectorRef) {
    this.agenteForm = this.fb.group({
      ci_usuario: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadAgentes();
  }

  getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  loadAgentes() {
    this.http.get('http://localhost:8000/modulo_inmuebles/agentes', { headers: this.getHeaders() })
      .subscribe((res: any) => {
        this.agentes = res;
        this.cdr.detectChanges();
      });
  }

  onSubmit() {
    if (this.agenteForm.valid) {
      this.mensajeError = '';
      this.mensajeExito = '';
      this.http.post('http://localhost:8000/modulo_inmuebles/agentes', this.agenteForm.value, { headers: this.getHeaders() })
        .subscribe({
          next: () => {
            this.loadAgentes();
            this.agenteForm.reset();
            this.mensajeExito = 'Agente registrado exitosamente.';
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

  deleteAgente(id: number) {
      this.http.delete(`http://localhost:8000/modulo_inmuebles/agentes/${id}`, { headers: this.getHeaders() })
        .subscribe(() => this.loadAgentes());
  }
}
