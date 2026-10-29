import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  selector: 'app-propiedades',
  templateUrl: './propiedades.html',
})
export class Propiedades implements OnInit {
  propiedades: any[] = [];
  tipos: any[] = [];
  zonas: any[] = [];
  selectedImage: File | null = null;
  propietarios: any[] = [];
  agentes: any[] = [];
  empresas: any[] = [];

  propiedadForm: FormGroup;
  editForm: FormGroup;

  mensajeError: string = '';
  mensajeExito: string = '';
  get isSuperAdmin(): boolean { return JSON.parse(localStorage.getItem('user') || '{}').is_superadmin === true; }
  userRole: number = 0;

  // Super Admin: empresa seleccionada para filtrar
  empresaSeleccionada: number | null = null;

  // Modal de edición
  mostrarModalEditar: boolean = false;
  propiedadEditando: any = null;

  // Modal crear
  mostrarModalCrear: boolean = false;

  constructor(private http: HttpClient, private fb: FormBuilder, private cdr: ChangeDetectorRef) {
    const formDef = {
      id_tipo_inmueble: ['', Validators.required],
      id_zona: ['', Validators.required],
      id_propietario: ['', Validators.required],
      id_agente: ['', Validators.required],
      titulo: ['', Validators.required],
      direccion: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(1)]],
      tipo_operacion: ['Venta', Validators.required],
      descripcion: [''],
      imagen_url: ['']
    };
    this.propiedadForm = this.fb.group(formDef);
    this.editForm = this.fb.group(formDef);
  }

  ngOnInit() {
    this.http.get<any[]>('http://localhost:8000/modulo_inmuebles/tipos', {headers: this.getHeaders()}).subscribe(data => {this.tipos = data; this.cdr.detectChanges();});
    this.http.get<any[]>('http://localhost:8000/modulo_inmuebles/zonas', {headers: this.getHeaders()}).subscribe(data => {this.zonas = data; this.cdr.detectChanges();});
    const roleStr = localStorage.getItem('user_role');
    this.userRole = roleStr ? parseInt(roleStr, 10) : 0;

    if (this.isSuperAdmin) {
      this.loadEmpresas();
    } else {
      this.loadPropiedades();
      this.loadPropietarios();
      this.loadAgentes();
    }
  }

  getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // ── Super Admin: cargar empresas para selector ──
  loadEmpresas() {
    this.http.get<any[]>('http://localhost:8000/admin/empresas', { headers: this.getHeaders() })
      .subscribe({ next: (res) => { this.empresas = [...res]; this.cdr.detectChanges(); } });
  }

  onEmpresaChange() {
    if (this.empresaSeleccionada) {
      this.loadPropiedades();
      this.loadPropietarios();
      this.loadAgentes();
    } else {
      this.propiedades = [];
    }
    this.cdr.detectChanges();
  }

  // ── Cargar datos ──
  loadPropiedades() {
    let url = 'http://localhost:8000/modulo_inmuebles/propiedades';
    if (this.isSuperAdmin && this.empresaSeleccionada) {
      url += `?id_tenant=${this.empresaSeleccionada}`;
    }
    this.http.get<any[]>(url, { headers: this.getHeaders() })
      .subscribe({
        next: (res) => { this.propiedades = [...res]; this.cdr.detectChanges(); },
        error: (err) => { console.error('Error propiedades:', err); }
      });
  }

  loadPropietarios() {
    let url = 'http://localhost:8000/modulo_inmuebles/propietarios';
    if (this.isSuperAdmin && this.empresaSeleccionada) {
      url += `?id_tenant=${this.empresaSeleccionada}`;
    }
    this.http.get<any[]>(url, { headers: this.getHeaders() })
      .subscribe({ next: (res) => { this.propietarios = [...res]; this.cdr.detectChanges(); } });
  }

  loadAgentes() {
    let url = 'http://localhost:8000/modulo_inmuebles/agentes';
    if (this.isSuperAdmin && this.empresaSeleccionada) {
      url += `?id_tenant=${this.empresaSeleccionada}`;
    }
    this.http.get<any[]>(url, { headers: this.getHeaders() })
      .subscribe({ next: (res) => { this.agentes = [...res]; this.cdr.detectChanges(); } });
  }

  // ── Crear propiedad ──
  abrirModalCrear() {
    this.propiedadForm.reset({ tipo_operacion: 'Venta', descripcion: '' });
    this.selectedImage = null;
    this.mensajeError = '';
    this.mostrarModalCrear = true;
  }

  onSubmit() {
    if (this.propiedadForm.valid) {
      this.mensajeError = '';
      const formData = {
        ...this.propiedadForm.value,
        descripcion: this.propiedadForm.value.descripcion || '',
        id_propietario: parseInt(this.propiedadForm.value.id_propietario, 10),
        id_agente: parseInt(this.propiedadForm.value.id_agente, 10),
        precio: parseFloat(this.propiedadForm.value.precio),
        imagenes: this.propiedadForm.value.imagen_url ? [this.propiedadForm.value.imagen_url] : []
      };
      this.http.post('http://localhost:8000/modulo_inmuebles/propiedades', formData, { headers: this.getHeaders() })
        .subscribe({
          next: (res: any) => {
            if (this.selectedImage) {
              const fd = new FormData();
              fd.append('file', this.selectedImage);
              this.http.post('http://localhost:8000/modulo_inmuebles/propiedades/' + res.id_propiedad + '/imagenes', fd, {headers: this.getHeaders()}).subscribe({
                next: () => this.loadPropiedades(),
                error: () => { this.mensajeError = 'El inmueble se guardó, pero la imagen no pudo subirse.'; this.cdr.detectChanges(); }
              });
              this.selectedImage = null;
            }
            this.loadPropiedades();
            this.mostrarModalCrear = false;
            this.mensajeExito = '¡Propiedad creada exitosamente!';
            this.cdr.detectChanges();
            setTimeout(() => { this.mensajeExito = ''; this.cdr.detectChanges(); }, 3000);
          },
          error: (err) => {
            this.mensajeError = err.error?.detail || 'Error al crear propiedad.';
            this.cdr.detectChanges();
          }
        });
    }
  }

  subiendoImagen = false;
  onFileSelected(event: any) {
    this.selectedImage = event.target.files?.[0] || null;
    if (this.selectedImage && this.selectedImage.size > 5 * 1024 * 1024) {
      this.mensajeError = 'La imagen no puede superar 5 MB.';
      this.selectedImage = null;
    }
  }

  generandoDescripcion = false;

  generarDescripcionIA(esEdicion: boolean = false) {
    const f = esEdicion ? this.editForm.value : this.propiedadForm.value;
    if (!f.titulo || !f.direccion || !f.precio || !f.tipo_operacion) {
      alert("Por favor, llena el título, dirección, precio y tipo de operación para que la IA pueda generar la descripción.");
      return;
    }

    this.generandoDescripcion = true;
    this.cdr.detectChanges();

    const enviarPeticion = (imagenBase64: string | null = null) => {
      const payload: any = {
        titulo: f.titulo,
        direccion: f.direccion,
        precio: f.precio,
        tipo_operacion: f.tipo_operacion
      };

      if (imagenBase64) {
        payload.imagen_base64 = imagenBase64;
      } else if (f.imagen_url) {
        payload.imagen_url = f.imagen_url;
      } else if (esEdicion && this.propiedadEditando?.imagenes?.length > 0) {
        payload.imagen_url = this.propiedadEditando.imagenes[0].url;
      }

      this.http.post('http://localhost:8000/api/ia/generar-descripcion', payload, { headers: this.getHeaders() })
        .subscribe({
          next: (res: any) => {
            this.generandoDescripcion = false;
            if (res.success && res.descripcion) {
              if (esEdicion) {
                this.editForm.patchValue({ descripcion: res.descripcion });
              } else {
                this.propiedadForm.patchValue({ descripcion: res.descripcion });
              }
            }
            this.cdr.detectChanges();
          },
          error: (err) => {
            this.generandoDescripcion = false;
            console.error(err);
            alert("Hubo un error al generar la descripción con IA.");
            this.cdr.detectChanges();
          }
        });
    };

    if (this.selectedImage) {
      const reader = new FileReader();
      reader.onload = () => enviarPeticion(reader.result as string);
      reader.onerror = () => enviarPeticion(null);
      reader.readAsDataURL(this.selectedImage);
    } else {
      enviarPeticion(null);
    }
  }

  // ── Editar propiedad ──
  abrirEditar(prop: any) {
    this.propiedadEditando = prop;
    this.editForm.patchValue({
      id_tipo_inmueble: prop.id_tipo_inmueble,
      id_zona: prop.id_zona,
      descripcion: prop.descripcion || '',
      id_propietario: prop.id_propietario,
      id_agente: prop.id_agente,
      titulo: prop.titulo,
      direccion: prop.direccion,
      precio: prop.precio,
      tipo_operacion: prop.tipo_operacion
    });
    this.mensajeError = '';
    this.mostrarModalEditar = true;
    this.cdr.detectChanges();
  }

  onEditSubmit() {
    if (this.editForm.valid && this.propiedadEditando) {
      const formData = {
        ...this.editForm.value,
        descripcion: this.editForm.value.descripcion || '',
        id_propietario: parseInt(this.editForm.value.id_propietario, 10),
        id_agente: parseInt(this.editForm.value.id_agente, 10),
        precio: parseFloat(this.editForm.value.precio)
      };
      this.http.put(`http://localhost:8000/modulo_inmuebles/propiedades/${this.propiedadEditando.id_propiedad}`, formData, { headers: this.getHeaders() })
        .subscribe({
          next: () => {
            this.loadPropiedades();
            this.mostrarModalEditar = false;
            this.mensajeExito = '¡Propiedad actualizada exitosamente!';
            this.cdr.detectChanges();
            setTimeout(() => { this.mensajeExito = ''; this.cdr.detectChanges(); }, 3000);
          },
          error: (err) => {
            this.mensajeError = err.error?.detail || 'Error al modificar propiedad.';
            this.cdr.detectChanges();
          }
        });
    }
  }

  // ── Cambiar estado ──
  updateEstado(id: number, estado: string) {
    this.http.put(`http://localhost:8000/modulo_inmuebles/propiedades/${id}/estado`, { estado }, { headers: this.getHeaders() })
      .subscribe({ next: () => this.loadPropiedades() });
  }

  // ── Eliminar propiedad ──
  deletePropied(id: number) {
    if (confirm('¿Desea eliminar esta propiedad? Esta acción no se puede deshacer.')) {
      this.http.delete(`http://localhost:8000/modulo_inmuebles/propiedades/${id}`, { headers: this.getHeaders() })
        .subscribe({
          next: () => {
            this.loadPropiedades();
            this.mensajeExito = 'Propiedad eliminada.';
            this.cdr.detectChanges();
            setTimeout(() => { this.mensajeExito = ''; this.cdr.detectChanges(); }, 3000);
          }
        });
    }
  }

  getEstadoColor(estado: string): string {
    switch(estado) {
      case 'Disponible': return '#22c55e';
      case 'Reservada': return '#eab308';
      case 'Vendida': return '#ef4444';
      case 'Alquilada': return '#3b82f6';
      default: return '#94a3b8';
    }
  }

  getEstadoBg(estado: string): string {
    switch(estado) {
      case 'Disponible': return '#dcfce7';
      case 'Reservada': return '#fef9c3';
      case 'Vendida': return '#fee2e2';
      case 'Alquilada': return '#dbeafe';
      default: return '#f1f5f9';
    }
  }
}
