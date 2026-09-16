import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagos-placeholder',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="placeholder-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Registro y Control de Pagos</h1>
          <p class="page-subtitle">Transacciones por Transferencia, Efectivo y QR</p>
        </div>
      </div>
    </div>
  `
})
export class PagosPlaceholderComponent {}
