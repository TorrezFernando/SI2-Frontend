import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role, RoleCreateRequest } from '../models/role.model';
import { environment } from '../config/environment';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  constructor(private http: HttpClient) {}

  public getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${environment.apiBaseUrl}/roles`);
  }

  public createRole(roleData: RoleCreateRequest): Observable<Role> {
    return this.http.post<Role>(`${environment.apiBaseUrl}/roles`, roleData);
  }

  public updateRolePermisos(idRol: number, permisosIds: number[]): Observable<{ message: string, rol_id: number }> {
    return this.http.put<{ message: string, rol_id: number }>(
      `${environment.apiBaseUrl}/roles/${idRol}/permisos`,
      permisosIds
    );
  }
}
