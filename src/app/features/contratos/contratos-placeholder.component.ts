import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contratos-placeholder',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="placeholder-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Gestión de Contratos</h1>
          <p class="page-subtitle">Contratos de Alquiler, Venta y Anticrético</p>
        </div>
      </div>
    </div>
  `
})
export class ContratosPlaceholderComponent {}
