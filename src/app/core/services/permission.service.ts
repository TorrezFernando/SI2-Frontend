import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Permission, PermissionCreateRequest } from '../models/permission.model';
import { environment } from '../config/environment';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) {}

  public hasPermission(permissionCode: string): boolean {
    const user = this.authService.currentUserValue;
    if (!user) return false;
    
    // SuperAdmin (rol 1) tiene acceso total por defecto
    if (user.id_rol === 1) return true;

    // Si el usuario tiene permisos dinámicos asignados desde la DB del backend
    if (user.permisos && user.permisos.includes(permissionCode)) {
      return true;
    }

    // Mapeo por defecto según el rol del usuario (SaaS RBAC)
    const rolePermissionsMap: { [key: number]: string[] } = {
      // Admin Empresa (rol 2)
      2: [
        'UI:MENU_CATALOGO', 'UI:MENU_PROPIEDADES', 'UI:MENU_CLIENTES', 
        'UI:MENU_PROPIETARIOS', 'UI:MENU_AGENTES', 'UI:MENU_VISITAS', 
        'UI:MENU_CONTRATOS', 'UI:MENU_PAGOS', 'UI:MENU_USUARIOS', 
        'UI:MENU_ROLES', 'UI:MENU_BITACORA', 'UI:BTN_CREAR_PROP', 'UI:BTN_ELIMINAR_PROP'
      ],
      // Agente Inmobiliario (roles 3, 5, 7)
      3: [
        'UI:MENU_CATALOGO', 'UI:MENU_PROPIEDADES', 'UI:MENU_CLIENTES', 
        'UI:MENU_PROPIETARIOS', 'UI:MENU_VISITAS', 'UI:MENU_CONTRATOS', 
        'UI:MENU_PAGOS', 'UI:BTN_CREAR_PROP'
      ],
      5: [
        'UI:MENU_CATALOGO', 'UI:MENU_PROPIEDADES', 'UI:MENU_CLIENTES', 
        'UI:MENU_PROPIETARIOS', 'UI:MENU_VISITAS', 'UI:MENU_CONTRATOS', 
        'UI:MENU_PAGOS', 'UI:BTN_CREAR_PROP'
      ],
      7: [
        'UI:MENU_CATALOGO', 'UI:MENU_PROPIEDADES', 'UI:MENU_CLIENTES', 
        'UI:MENU_PROPIETARIOS', 'UI:MENU_VISITAS', 'UI:MENU_CONTRATOS', 
        'UI:MENU_PAGOS', 'UI:BTN_CREAR_PROP'
      ],
      // Cliente / Propietario (roles 4, 6, 8)
      4: ['UI:MENU_CATALOGO', 'UI:MENU_VISITAS', 'UI:MENU_CONTRATOS', 'UI:MENU_PAGOS'],
      6: ['UI:MENU_CATALOGO', 'UI:MENU_VISITAS', 'UI:MENU_CONTRATOS', 'UI:MENU_PAGOS'],
      8: ['UI:MENU_CATALOGO', 'UI:MENU_VISITAS', 'UI:MENU_CONTRATOS', 'UI:MENU_PAGOS'],
    };

    const rolePerms = rolePermissionsMap[user.id_rol];
    if (rolePerms && rolePerms.includes(permissionCode)) {
      return true;
    }

    return false;
  }

  public getPermisos(): Observable<Permission[]> {
    return this.http.get<Permission[]>(`${environment.apiBaseUrl}/permisos`);
  }

  public createPermiso(permiso: PermissionCreateRequest): Observable<Permission> {
    return this.http.post<Permission>(`${environment.apiBaseUrl}/permisos`, permiso);
  }
}
