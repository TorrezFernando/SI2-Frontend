import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-usuarios-placeholder',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="placeholder-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Gestión de Usuarios</h1>
          <p class="page-subtitle">Administración de usuarios por empresa o globales</p>
        </div>
      </div>

      <div class="card">
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>CI</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Teléfono</th>
                <th>Empresa</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>0000000</code></td>
                <td>Super Admin</td>
                <td>super&#64;saas.com</td>
                <td>70000000</td>
                <td><span class="badge badge-info">Global</span></td>
                <td>Super Administrador</td>
                <td><button class="btn btn-outline btn-sm" disabled>Acciones (Pendiente)</button></td>
              </tr>
              <tr>
                <td><code>1000001</code></td>
                <td>Admin Raices</td>
                <td>admin&#64;raices.com</td>
                <td>77712345</td>
                <td>Empresa #1</td>
                <td>Admin Empresa</td>
                <td><button class="btn btn-outline btn-sm" disabled>Acciones (Pendiente)</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class UsuariosPlaceholderComponent {}
