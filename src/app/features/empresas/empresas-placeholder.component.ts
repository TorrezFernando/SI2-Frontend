import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empresas-placeholder',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="placeholder-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Gestión de Empresas SaaS</h1>
          <p class="page-subtitle">Administración global de inquilinos (Tenants)</p>
        </div>
      </div>

      <!-- Mock UI Preview -->
      <div class="card">
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID Empresa</th>
                <th>Nombre Comercial</th>
                <th>Dominio SaaS</th>
                <th>Fecha Registro</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>#1</strong></td>
                <td>Raíces Inmobiliaria</td>
                <td><code>raices.com</code></td>
                <td>2026-01-15</td>
                <td><span class="badge badge-success">Activa</span></td>
                <td><button class="btn btn-outline btn-sm" disabled>Editar (Pendiente)</button></td>
              </tr>
              <tr>
                <td><strong>#2</strong></td>
                <td>Horizonte Bienes Raíces</td>
                <td><code>horizonte.com</code></td>
                <td>2026-02-01</td>
                <td><span class="badge badge-success">Activa</span></td>
                <td><button class="btn btn-outline btn-sm" disabled>Editar (Pendiente)</button></td>
              </tr>
              <tr>
                <td><strong>#3</strong></td>
                <td>Cúspide Propiedades</td>
                <td><code>cuspide.com</code></td>
                <td>2026-02-10</td>
                <td><span class="badge badge-success">Activa</span></td>
                <td><button class="btn btn-outline btn-sm" disabled>Editar (Pendiente)</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class EmpresasPlaceholderComponent {}
