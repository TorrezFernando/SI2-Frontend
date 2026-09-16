import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const notificationService = inject(NotificationService);
  const router = inject(Router);

  const token = authService.getToken();

  // No agregar el token si es login, register o forgot-password
  const isAuthEndpoint = req.url.includes('/login') || req.url.includes('/register') || req.url.includes('/forgot-password');

  let authReq = req;
  if (token && !isAuthEndpoint) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !isAuthEndpoint) {
        authService.logout();
        notificationService.error('Su sesión ha expirado o no es válida. Por favor, inicie sesión.');
        router.navigate(['/login']);
      } else if (error.status === 403) {
        notificationService.error(error.error?.detail || 'Acceso denegado. No posee los permisos requeridos.');
      } else if (error.status === 422) {
        notificationService.error('Error de validación en los datos enviadas.');
      } else if (error.status === 500) {
        notificationService.error('Ha ocurrido un error interno en el servidor.');
      }
      return throwError(() => error);
    })
  );
};
