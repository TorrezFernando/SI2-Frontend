import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-propietarios-placeholder',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="placeholder-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Gestión de Propietarios</h1>
          <p class="page-subtitle">Dueños de inmuebles registrados</p>
        </div>
      </div>
    </div>
  `
})
export class PropietariosPlaceholderComponent {}
