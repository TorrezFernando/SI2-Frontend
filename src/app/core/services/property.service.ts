import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PropertyCatalogItem, PropertyFilterParams } from '../models/property.model';
import { environment } from '../config/environment';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  constructor(private http: HttpClient) {}

  public getCatalogo(filters?: PropertyFilterParams, tenantId?: number): Observable<PropertyCatalogItem[]> {
    let params = new HttpParams();

    if (filters) {
      if (filters.tipo_operacion) params = params.set('tipo_operacion', filters.tipo_operacion);
      if (filters.precio_min !== undefined && filters.precio_min !== null) params = params.set('precio_min', filters.precio_min);
      if (filters.precio_max !== undefined && filters.precio_max !== null) params = params.set('precio_max', filters.precio_max);
      if (filters.cuartos !== undefined && filters.cuartos !== null) params = params.set('cuartos', filters.cuartos);
      if (filters.banos !== undefined && filters.banos !== null) params = params.set('banos', filters.banos);
      if (filters.salas !== undefined && filters.salas !== null) params = params.set('salas', filters.salas);
      if (filters.metros_min !== undefined && filters.metros_min !== null) params = params.set('metros_min', filters.metros_min);
      if (filters.metros_max !== undefined && filters.metros_max !== null) params = params.set('metros_max', filters.metros_max);
      if (filters.zona) params = params.set('zona', filters.zona);
      if (filters.amueblado !== undefined && filters.amueblado !== null) params = params.set('amueblado', filters.amueblado);
      if (filters.servicios_basicos !== undefined && filters.servicios_basicos !== null) params = params.set('servicios_basicos', filters.servicios_basicos);
    }

    let headers = new HttpHeaders();
    if (tenantId !== undefined && tenantId !== null) {
      headers = headers.set('X-Tenant-ID', tenantId.toString());
    }

    return this.http.get<PropertyCatalogItem[]>(
      `${environment.apiBaseUrl}/modulo_inmuebles/propiedades/catalogo`,
      { params, headers }
    );
  }
}
