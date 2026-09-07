import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  selector: 'app-roles',
  styleUrl: './roles.css',
  templateUrl: './roles.html',
})
export class Roles implements OnInit {
  roles: any[] = [];
  rolForm: FormGroup;
  mensaje: string = '';
  error: boolean = false;

  constructor(private http: HttpClient, private fb: FormBuilder, private cdr: ChangeDetectorRef) {
    this.rolForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit() {
    this.cargarRoles();
  }

  cargarRoles() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    this.http.get('http://localhost:8000/gestion_usuarios/roles', { headers }).subscribe({
      next: (data: any) => {
        this.roles = data;
        this.cdr.detectChanges(); // Forzar actualización de la UI
      },
      error: (err) => console.error(err)
    });
  }

  agregarRol() {
    if (this.rolForm.valid) {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      
      this.http.post('http://localhost:8000/gestion_usuarios/roles', this.rolForm.value, { headers }).subscribe({
        next: (nuevoRol: any) => {
          this.roles.push(nuevoRol);
          this.rolForm.reset();
          this.mensaje = '¡Rol agregado exitosamente!';
          this.error = false;
          this.cdr.detectChanges(); // Forzar actualización de la UI
          
          setTimeout(() => {
            this.mensaje = '';
            this.cdr.detectChanges();
          }, 3000);
        },
        error: (err) => {
          this.mensaje = 'Error al agregar el rol (es posible que ya exista).';
          this.error = true;
          this.cdr.detectChanges();
        }
      });
    }
  }
}
