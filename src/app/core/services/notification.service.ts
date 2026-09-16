import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastMessage {
  id: number;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private toastsSubject = new BehaviorSubject<ToastMessage[]>([]);
  public toasts$ = this.toastsSubject.asObservable();
  private nextId = 1;

  public show(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', duration: number = 4000): void {
    const toast: ToastMessage = { id: this.nextId++, message, type };
    const current = this.toastsSubject.value;
    this.toastsSubject.next([...current, toast]);

    setTimeout(() => {
      this.remove(toast.id);
    }, duration);
  }

  public success(message: string): void {
    this.show(message, 'success');
  }

  public error(message: string): void {
    this.show(message, 'error');
  }

  public info(message: string): void {
    this.show(message, 'info');
  }

  public warning(message: string): void {
    this.show(message, 'warning');
  }

  public remove(id: number): void {
    const current = this.toastsSubject.value;
    this.toastsSubject.next(current.filter(t => t.id !== id));
  }
}
