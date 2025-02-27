import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SancionesPenales } from 'src/app/core/model/sancionesPenales.model';
import { Utilities } from 'src/app/core/services/utilities';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SancionesPenalesService { 
  private utilities = inject(Utilities);
  private http = inject(HttpClient);
  logicApiUrl = this.utilities.logicApiUrl();

  getListaSancionesPenales(): Observable<any> {
    return this.http.get(`${this.logicApiUrl}/api/SancionesPenales/listar`);
  }

  getSancionesPenales(idSancionesPenales: number): Observable<any> {
    return this.http.get(`${this.logicApiUrl}/api/SancionesPenales/obtener/${idSancionesPenales}`);
  }

  getSearchSancionesPenales(SancionesPenales: SancionesPenales): Observable<any> { 
    return this.http.post(`${this.logicApiUrl}/api/SancionesPenales/buscar`, SancionesPenales);
  }

  createSancionesPenales(SancionesPenales: SancionesPenales): Observable<any> {
    return this.http.post(`${this.logicApiUrl}/api/SancionesPenales/crear`, SancionesPenales);
  }

  updateSancionesPenales(SancionesPenales: SancionesPenales): Observable<any> {
    return this.http.put(`${this.logicApiUrl}/api/SancionesPenales/actualizar`, SancionesPenales);
  }

  deleteSancionesPenales(idSancionesPenales: number): Observable<any> {
    return this.http.delete(`${this.logicApiUrl}/api/SancionesPenales/eliminar/${idSancionesPenales}`);
  }
}
