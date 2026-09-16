import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-propiedades-placeholder',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="placeholder-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Gestión de Propiedades (CRUD Administrativo)</h1>
          <p class="page-subtitle">Registro, edición y cambio de estado de inmuebles</p>
        </div>
      </div>

      <div class="card">
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Título del Inmueble</th>
                <th>Dirección</th>
                <th>Precio</th>
                <th>Operación</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>#1</strong></td>
                <td>Hermosa Casa en Equipetrol</td>
                <td>Av. San Martín, 3er Anillo</td>
                <td>$250,000.00</td>
                <td>Venta</td>
                <td><span class="badge badge-success">Disponible</span></td>
                <td><button class="btn btn-outline btn-sm" disabled>Editar (Pendiente)</button></td>
              </tr>
              <tr>
                <td><strong>#2</strong></td>
                <td>Departamento de Lujo en Urubo</td>
                <td>Condominio Urubo Golf</td>
                <td>$1,200.00</td>
                <td>Alquiler</td>
                <td><span class="badge badge-success">Disponible</span></td>
                <td><button class="btn btn-outline btn-sm" disabled>Editar (Pendiente)</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class PropiedadesPlaceholderComponent {}
