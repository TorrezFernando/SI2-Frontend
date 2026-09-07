import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  selector: 'app-propiedades',
  templateUrl: './propiedades.html',
})
export class Propiedades implements OnInit {
  propiedades: any[] = [];
  propietarios: any[] = [];
  agentes: any[] = [];
  propiedadForm: FormGroup;
  selectedFile: File | null = null;
  mensajeError: string = '';
  mensajeExito: string = '';
  userRole: number = 0;
  
  constructor(private http: HttpClient, private fb: FormBuilder, private cdr: ChangeDetectorRef) {
    this.propiedadForm = this.fb.group({
      id_propietario: ['', Validators.required],
      id_agente: ['', Validators.required],
      titulo: ['', Validators.required],
      direccion: ['', Validators.required],
      precio: ['', Validators.required],
      tipo_operacion: ['Venta', Validators.required]
    });
  }

  ngOnInit() {
    const roleStr = localStorage.getItem('user_role');
    this.userRole = roleStr ? parseInt(roleStr, 10) : 0;
    this.loadPropiedades();
    if (this.userRole === 1) {
      this.loadPropietarios();
      this.loadAgentes();
    }
  }

  getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  loadPropiedades() {
    this.http.get('http://localhost:8000/modulo_inmuebles/propiedades', { headers: this.getHeaders() })
      .subscribe((res: any) => {
        this.propiedades = res;
        this.cdr.detectChanges();
      });
  }

  loadPropietarios() {
    this.http.get('http://localhost:8000/modulo_inmuebles/propietarios_list', { headers: this.getHeaders() })
      .subscribe((res: any) => {
        this.propietarios = res;
        this.cdr.detectChanges();
      });
  }

  loadAgentes() {
    this.http.get('http://localhost:8000/modulo_inmuebles/agentes', { headers: this.getHeaders() })
      .subscribe((res: any) => {
        this.agentes = res;
        this.cdr.detectChanges();
      });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit() {
    if (this.propiedadForm.valid) {
      this.mensajeError = '';
      this.mensajeExito = '';
      
      // Convertir los valores del select a números enteros
      const formData = {
        ...this.propiedadForm.value,
        id_propietario: parseInt(this.propiedadForm.value.id_propietario, 10),
        id_agente: parseInt(this.propiedadForm.value.id_agente, 10),
        precio: parseFloat(this.propiedadForm.value.precio)
      };
      
      this.http.post('http://localhost:8000/modulo_inmuebles/propiedades', formData, { headers: this.getHeaders() })
        .subscribe({
          next: (res: any) => {
            if (this.selectedFile) {
              const uploadData = new FormData();
              uploadData.append('file', this.selectedFile);
              this.http.post(`http://localhost:8000/modulo_inmuebles/propiedades/${res.id_propiedad}/imagenes`, uploadData, { headers: this.getHeaders() })
                .subscribe({
                  next: () => {
                    this.loadPropiedades();
                    this.propiedadForm.reset({tipo_operacion: 'Venta'});
                    this.selectedFile = null;
                    this.mensajeExito = 'Propiedad creada exitosamente.';
                    this.cdr.detectChanges();
                    setTimeout(() => { this.mensajeExito = ''; this.cdr.detectChanges(); }, 3000);
                  },
                  error: (err) => {
                    console.error('Error al subir imagen:', err);
                    this.loadPropiedades();
                    this.propiedadForm.reset({tipo_operacion: 'Venta'});
                    this.mensajeExito = 'Propiedad creada, pero hubo un error al subir la imagen.';
                    this.cdr.detectChanges();
                    setTimeout(() => { this.mensajeExito = ''; this.cdr.detectChanges(); }, 3000);
                  }
                });
            } else {
              this.loadPropiedades();
              this.propiedadForm.reset({tipo_operacion: 'Venta'});
              this.mensajeExito = 'Propiedad creada exitosamente (sin foto).';
              this.cdr.detectChanges();
              setTimeout(() => { this.mensajeExito = ''; this.cdr.detectChanges(); }, 3000);
            }
          },
          error: (err) => {
            console.error('Error al crear propiedad:', err);
            this.mensajeError = err.error?.detail || 'Error al crear propiedad. Verifique que los datos sean correctos.';
            this.cdr.detectChanges();
          }
        });
    }
  }

  updateEstado(id: number, estado: string) {
    this.http.put(`http://localhost:8000/modulo_inmuebles/propiedades/${id}/estado`, { estado }, { headers: this.getHeaders() })
      .subscribe(() => this.loadPropiedades());
  }
}
