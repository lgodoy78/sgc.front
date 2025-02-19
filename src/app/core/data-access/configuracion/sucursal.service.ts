import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Sucursal } from 'src/app/core/model/sucursal.model';
import { Utilities } from 'src/app/core/services/utilities';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SucursalService { 
  private utilities = inject(Utilities);
  private http = inject(HttpClient);
  logicApiUrl = this.utilities.logicApiUrl();

  getListaSucursales(): Observable<any> {
    return this.http.get(`${this.logicApiUrl}/api/sucursal/listar`);
  }

  getSucursal(codSucursal: string): Observable<any> {
    return this.http.get(`${this.logicApiUrl}/api/sucursal/obtener/${codSucursal}`);
  }

  createSucursal(sucursal: Sucursal): Observable<any> {
    return this.http.post(`${this.logicApiUrl}/api/sucursal/crear`, sucursal);
  }

  updateSucursal(sucursal: Sucursal): Observable<any> {
    return this.http.put(`${this.logicApiUrl}/api/sucursal/actualizar`, sucursal);
  }

  deleteSucursal(codSucursal: string): Observable<any> {
    return this.http.delete(`${this.logicApiUrl}/api/sucursal/eliminar/${codSucursal}`);
  }
}
