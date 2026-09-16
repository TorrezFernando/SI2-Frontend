import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, ToastMessage } from '../../../core/services/notification.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      <div 
        *ngFor="let toast of toasts$ | async" 
        class="toast-item" 
        [ngClass]="'toast-' + toast.type"
        (click)="remove(toast.id)">
        <span class="toast-indicator"></span>
        <span class="toast-msg">{{ toast.message }}</span>
        <button class="toast-close">&times;</button>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed; top: 20px; right: 20px; z-index: 9999;
      display: flex; flex-direction: column; gap: 10px; max-width: 380px; width: 100%; pointer-events: none;
    }
    .toast-item {
      pointer-events: auto; display: flex; align-items: center; gap: 12px;
      padding: 12px 16px; border-radius: 8px; background: #ffffff;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15); font-size: 13.5px; cursor: pointer;
      border-left: 4px solid #3b82f6;
      &.toast-success { border-left-color: #10b981; }
      &.toast-error { border-left-color: #ef4444; }
      &.toast-warning { border-left-color: #f59e0b; }
      &.toast-info { border-left-color: #3b82f6; }
    }
    .toast-indicator { width: 8px; height: 8px; border-radius: 50%; background: currentColor; flex-shrink: 0; }
    .toast-msg { flex: 1; color: #1e293b; font-weight: 500; }
    .toast-close { background: none; border: none; font-size: 18px; color: #94a3b8; cursor: pointer; }
  `]
})
export class ToastContainerComponent {
  toasts$: Observable<ToastMessage[]>;

  constructor(private notificationService: NotificationService) {
    this.toasts$ = this.notificationService.toasts$;
  }

  remove(id: number): void {
    this.notificationService.remove(id);
  }
}
