import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { PermissionService } from '../services/permission.service';
import { NotificationService } from '../services/notification.service';

export const permissionGuard = (requiredPermission: string): CanActivateFn => {
  return (route, state) => {
    const permissionService = inject(PermissionService);
    const notificationService = inject(NotificationService);
    const router = inject(Router);

    if (permissionService.hasPermission(requiredPermission)) {
      return true;
    }

    notificationService.error('No tiene permiso para acceder a esta sección.');
    router.navigate(['/dashboard']);
    return false;
  };
};
