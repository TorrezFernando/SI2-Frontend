import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-visitas-placeholder',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="placeholder-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Programación de Visitas</h1>
          <p class="page-subtitle">Agenda de visitas a inmuebles (Programada, Realizada, Cancelada)</p>
        </div>
      </div>
    </div>
  `
})
export class VisitasPlaceholderComponent {}
