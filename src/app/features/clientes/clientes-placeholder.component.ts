import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-clientes-placeholder',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="placeholder-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Gestión de Clientes</h1>
          <p class="page-subtitle">Listado de clientes compradores e inquilinos</p>
        </div>
      </div>
    </div>
  `
})
export class ClientesPlaceholderComponent {}
