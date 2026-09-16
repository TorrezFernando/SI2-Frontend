import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="notfound-container">
      <div class="notfound-card">
        <div class="code">404</div>
        <h2>Página no encontrada</h2>
        <p>La ruta a la que intentas acceder no existe o fue movida.</p>
        <div class="actions">
          <a routerLink="/dashboard" class="btn btn-primary">Ir al Dashboard</a>
          <a routerLink="/catalogo" class="btn btn-outline">Ver Catálogo Público</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .notfound-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f8fafc;
      padding: 20px;
    }
    .notfound-card {
      text-align: center;
      background: #ffffff;
      padding: 48px;
      border-radius: 16px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05);
      max-width: 440px;
      width: 100%;

      .code { font-size: 72px; font-weight: 800; color: #2563eb; line-height: 1; margin-bottom: 12px; }
      h2 { font-size: 20px; color: #0f172a; margin-bottom: 8px; }
      p { color: #64748b; font-size: 14px; margin-bottom: 24px; }
      .actions { display: flex; gap: 12px; justify-content: center; }
    }
  `]
})
export class NotFoundComponent {}
