import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pending-banner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pending-banner" *ngIf="showBanner">
      <div class="content">
        <h4>Integración Backend Pendiente (Módulo Preparado)</h4>
        <p>{{ message || 'Esta sección visual está diseñada y estructurada en el frontend, pero los endpoints correspondientes en el backend FastAPI están pendientes de implementación.' }}</p>
      </div>
    </div>
  `
})
export class PendingBannerComponent implements OnInit {
  @Input() message?: string;
  showBanner = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUserValue;
    const currentUrl = this.router.url;
    // Solo visible si es SuperAdmin (rol #1) Y únicamente en la pestaña /dashboard/info-tecnica
    this.showBanner = (user?.id_rol === 1) && currentUrl.includes('/dashboard/info-tecnica');
  }
}
