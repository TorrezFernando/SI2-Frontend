import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ToastContainerComponent } from '../../../shared/components/toast-container/toast-container.component';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, ToastContainerComponent],
  template: `
    <div class="dashboard-shell">
      <app-sidebar></app-sidebar>
      
      <main class="dashboard-content">
        <app-toast-container></app-toast-container>
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .dashboard-shell {
      display: flex;
      min-height: 100vh;
      background-color: #f8fafc;
    }
    .dashboard-content {
      margin-left: 260px;
      flex: 1;
      padding: 32px;
      max-width: 1400px;
      
      @media (max-width: 900px) {
        margin-left: 0;
        padding: 16px;
      }
    }
  `]
})
export class DashboardLayoutComponent {}
