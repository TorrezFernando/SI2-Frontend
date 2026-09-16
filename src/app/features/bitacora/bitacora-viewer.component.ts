import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BitacoraService } from '../../core/services/bitacora.service';
import { NotificationService } from '../../core/services/notification.service';
import { BitacoraLogEntry } from '../../core/models/log.model';

@Component({
  selector: 'app-bitacora-viewer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bitacora-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Bitácora Cifrada de Auditoría</h1>
          <p class="page-subtitle">Desencriptación en tiempo real de eventos del sistema (GET /admin/bitacora?dev_key=...)</p>
        </div>
        <span class="badge badge-danger">Exclusivo SuperAdmin (Rol #1)</span>
      </div>

      <!-- DevKey Form Card -->
      <div class="card key-card">
        <h3>Desencriptación con Llave de Desarrollador</h3>
        <p class="desc">La bitácora en el servidor se encuentra almacenada mediante cifrado simétrico (Fernet). Ingrese la llave para desencriptar:</p>

        <form class="key-form" (ngSubmit)="consultarBitacora()">
          <div class="form-group flex-group">
            <input 
              type="password" 
              [(ngModel)]="devKey" 
              name="devKey" 
              placeholder="Ingrese la llave Fernet de desarrollador..." 
              required>
            <button type="submit" class="btn btn-primary" [disabled]="loading || !devKey">
              <span *ngIf="loading" class="spinner"></span>
              <span *ngIf="!loading">Desencriptar & Consultar</span>
            </button>
          </div>
        </form>
      </div>

      <!-- Results Table Card -->
      <div class="card" *ngIf="searched">
        <div class="card-header">
          <h3>Registros Desencriptados</h3>
          <span class="count-badge" *ngIf="logs.length > 0">{{ logs.length }} entradas encontradas</span>
        </div>

        <div class="table-container" *ngIf="logs.length > 0 && !loading">
          <table class="data-table">
            <thead>
              <tr>
                <th>Fecha y Hora</th>
                <th>Dirección IP</th>
                <th>Usuario (Token / Sub)</th>
                <th>Acción HTTP Ejecutada</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let log of logs">
                <td><span class="date-tag">{{ log.fecha_hora || 'N/A' }}</span></td>
                <td><code>{{ log.ip || 'Desconocida' }}</code></td>
                <td>
                  <span class="user-tag" [ngClass]="{'anon': log.usuario === 'Anónimo'}">
                    {{ log.usuario || 'Anónimo' }}
                  </span>
                </td>
                <td>
                  <code class="action-tag" [ngClass]="getActionClass(log.accion)">
                    {{ log.accion }}
                  </code>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="empty-box" *ngIf="logs.length === 0 && !loading">
          <p>No se encontraron registros en la bitácora o la llave no devolvió datos.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .key-card h3 { font-size: 16px; color: #0f172a; margin-bottom: 4px; }
    .key-card .desc { font-size: 13px; color: #64748b; margin-bottom: 16px; }
    .flex-group { display: flex; gap: 12px; margin-bottom: 0; }
    .flex-group input { flex: 1; }
    .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .card-header h3 { font-size: 16px; color: #0f172a; }
    .count-badge { background: #e0f2fe; color: #0369a1; padding: 4px 12px; border-radius: 99px; font-weight: 600; font-size: 12px; }
    .date-tag { font-weight: 600; color: #334155; font-size: 12.5px; }
    .user-tag { font-weight: 700; color: #1e3a8a; }
    .user-tag.anon { color: #64748b; font-weight: 400; font-style: italic; }
    .action-tag { padding: 3px 8px; border-radius: 4px; font-size: 12px; font-weight: 700; }
    .action-tag.get { background: #ecfdf5; color: #047857; }
    .action-tag.post { background: #eff6ff; color: #1d4ed8; }
    .action-tag.put { background: #fffbeb; color: #b45309; }
    .action-tag.delete { background: #fef2f2; color: #b91c1c; }
    .empty-box { text-align: center; padding: 40px; color: #64748b; }
  `]
})
export class BitacoraViewerComponent {
  devKey = '';
  logs: BitacoraLogEntry[] = [];
  loading = false;
  searched = false;

  constructor(
    private bitacoraService: BitacoraService,
    private notificationService: NotificationService
  ) {}

  consultarBitacora(): void {
    if (!this.devKey) return;

    this.loading = true;
    this.searched = true;

    this.bitacoraService.getBitacoraSegura(this.devKey).subscribe({
      next: (data) => {
        this.logs = data;
        this.loading = false;
        this.notificationService.success(`Bitácora desencriptada con éxito. ${data.length} registros cargados.`);
      },
      error: (err) => {
        this.loading = false;
        this.logs = [];
        const msg = err.error?.detail || 'Llave de desarrollador inválida o sin autorización.';
        this.notificationService.error(msg);
      }
    });
  }

  getActionClass(accion?: string): string {
    if (!accion) return '';
    if (accion.startsWith('GET')) return 'get';
    if (accion.startsWith('POST')) return 'post';
    if (accion.startsWith('PUT')) return 'put';
    if (accion.startsWith('DELETE')) return 'delete';
    return '';
  }
}
