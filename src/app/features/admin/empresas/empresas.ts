import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  selector: 'app-empresas',
  templateUrl: './empresas.html',
})
export class Empresas implements OnInit {
  empresas: any[] = [];
  planes: any[] = [];
  terminos: string[] = [];
  historial: any[] = [];
  empresaActiva: any = null;
  planSeleccionado = 'normal';
  aceptaTerminos = false;
  procesando = false;
  get isSuperAdmin(): boolean { return JSON.parse(localStorage.getItem('user') || '{}').is_superadmin === true; }

  abrirPlan(emp: any) {
    this.empresaActiva = emp;
    this.planSeleccionado = emp.plan;
    this.aceptaTerminos = false;
    this.http.get<any[]>('http://localhost:8000/suscripciones/' + emp.id_tenant + '/pagos', {headers: this.getHeaders()}).subscribe({
      next: data => { this.historial = data; this.cdr.detectChanges(); },
      error: err => this.mostrarError(err)
    });
  }
  mostrarError(err: any) {
    this.procesando = false;
    this.mensajeError = typeof err.error?.detail === 'string' ? err.error.detail : 'Revise los datos e intente nuevamente.';
    this.cdr.detectChanges();
  }
  actualizarPlan() {
    if (!this.aceptaTerminos || this.procesando) return;
    this.procesando = true;
    this.http.put('http://localhost:8000/suscripciones/' + this.empresaActiva.id_tenant + '/plan',
      {plan: this.planSeleccionado, acepta_terminos: true}, {headers: this.getHeaders()}).subscribe({
      next: data => { this.empresaActiva = data; this.procesando = false; this.loadEmpresas(); this.mensajeExito = 'Plan actualizado. Se conserva el vencimiento mensual.'; this.cdr.detectChanges(); },
      error: err => this.mostrarError(err)
    });
  }
  simularPago() {
    if (this.procesando || !confirm('Registrar un pago mensual simulado, sin cobro bancario real?')) return;
    this.procesando = true;
    this.http.post<any>('http://localhost:8000/suscripciones/' + this.empresaActiva.id_tenant + '/pagos-simulados',
      {periodo: this.empresaActiva.vencimiento, confirma_simulacion: true}, {headers: this.getHeaders()}).subscribe({
      next: data => { this.procesando = false; this.abrirPlan(data.suscripcion); this.loadEmpresas(); this.mensajeExito = 'Mensualidad simulada registrada. No hubo cobro real.'; this.cdr.detectChanges(); },
      error: err => this.mostrarError(err)
    });
  }
  renovar(activa: boolean) {
    if (this.procesando || !confirm(activa ? 'Reactivar renovación mensual?' : 'Cancelar renovación al finalizar el período vigente?')) return;
    this.procesando = true;
    this.http.put('http://localhost:8000/suscripciones/' + this.empresaActiva.id_tenant + '/renovacion',
      {activa, acepta_terminos: this.aceptaTerminos}, {headers: this.getHeaders()}).subscribe({
      next: data => { this.empresaActiva = data; this.procesando = false; this.loadEmpresas(); this.cdr.detectChanges(); },
      error: err => this.mostrarError(err)
    });
  }
  empresaForm: FormGroup;
  mensajeError: string = '';
  mensajeExito: string = '';
  mostrarModal: boolean = false;

  constructor(private http: HttpClient, private fb: FormBuilder, private cdr: ChangeDetectorRef) {
    this.empresaForm = this.fb.group({
      plan: ['normal', Validators.required],
      acepta_terminos: [false, Validators.requiredTrue],
      admin_password: ['', [Validators.required, Validators.minLength(8)]],
      nombre: ['', Validators.required],
      dominio: [''],
      admin_ci: ['', Validators.required],
      admin_nombre: ['', Validators.required],
      admin_correo: ['', [Validators.required, Validators.email]],
      admin_telefono: ['']
    });
  }

  ngOnInit() {
    this.loadEmpresas();
    this.http.get<any[]>('http://localhost:8000/suscripciones/planes').subscribe(data => {this.planes = data; this.cdr.detectChanges();});
    this.http.get<any>('http://localhost:8000/suscripciones/terminos').subscribe(data => {this.terminos = data.condiciones; this.cdr.detectChanges();});
  }

  getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  loadEmpresas() {
    this.http.get<any[]>('http://localhost:8000/admin/empresas', { headers: this.getHeaders() })
      .subscribe({
        next: (res: any[]) => {
          this.empresas = [...res];
          console.log('Empresas cargadas:', this.empresas.length);
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error cargando empresas:', err);
          this.mensajeError = err.error?.detail || `Error ${err.status}: No se pudieron cargar las empresas.`;
          this.cdr.detectChanges();
        }
      });
  }

  onSubmit() {
    if (this.empresaForm.valid) {
      this.http.post('http://localhost:8000/admin/empresas', this.empresaForm.value, { headers: this.getHeaders() })
        .subscribe({
          next: () => {
            this.loadEmpresas();
            this.mostrarModal = false;
            this.empresaForm.reset({plan: 'normal', acepta_terminos: false});
            this.mensajeExito = 'Empresa y administrador creados exitosamente.';
            setTimeout(() => this.mensajeExito = '', 3000);
          },
          error: (err) => {
            this.mensajeError = err.error?.detail || 'Error al crear la empresa.';
          }
        });
    }
  }
  
  resetPassword(idEmpresa: number) {
      if (confirm('¿Está seguro de que desea restablecer la contraseña del administrador a "12345"?')) {
          this.http.put(`http://localhost:8000/admin/empresas/${idEmpresa}/reset-admin-password`, {}, { headers: this.getHeaders() })
            .subscribe({
                next: (res: any) => {
                    alert(res.message);
                },
                error: (err) => {
                    alert(err.error?.detail || 'Error al restablecer la contraseña.');
                }
            });
      }
  }
}
