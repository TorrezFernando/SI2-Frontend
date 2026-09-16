import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BitacoraLogEntry } from '../models/log.model';
import { environment } from '../config/environment';

@Injectable({
  providedIn: 'root'
})
export class BitacoraService {
  constructor(private http: HttpClient) {}

  public getBitacoraSegura(devKey: string): Observable<BitacoraLogEntry[]> {
    const params = new HttpParams().set('dev_key', devKey);
    return this.http.get<BitacoraLogEntry[]>(`${environment.apiBaseUrl}/admin/bitacora`, { params });
  }
}
