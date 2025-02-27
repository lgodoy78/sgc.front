import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AgrupacionRiesgo } from 'src/app/core/model/agrupacionRiesgo.model';
import { Utilities } from 'src/app/core/services/utilities';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AgrupacionRiesgoService { 
  private utilities = inject(Utilities);
  private http = inject(HttpClient);
  logicApiUrl = this.utilities.logicApiUrl();

  getListaAgrupacionRiesgo(): Observable<any> {
    return this.http.get(`${this.logicApiUrl}/api/agrupacionriesgo/listar`);
  }

  getAgrupacionRiesgo(codAgrupacionRiesgo: string): Observable<any> {
    return this.http.get(`${this.logicApiUrl}/api/agrupacionriesgo/obtener/${codAgrupacionRiesgo}`);
  }

  createAgrupacionRiesgo(agrupacionRiesgo: AgrupacionRiesgo): Observable<any> {
    return this.http.post(`${this.logicApiUrl}/api/agrupacionriesgo/crear`, agrupacionRiesgo);
  }

  updateAgrupacionRiesgo(agrupacionRiesgo: AgrupacionRiesgo): Observable<any> {
    return this.http.put(`${this.logicApiUrl}/api/agrupacionriesgo/actualizar`, agrupacionRiesgo);
  }

  deleteAgrupacionRiesgo(codAgrupacionRiesgo: string): Observable<any> {
    return this.http.delete(`${this.logicApiUrl}/api/agrupacionriesgo/eliminar/${codAgrupacionRiesgo}`);
  }
}
