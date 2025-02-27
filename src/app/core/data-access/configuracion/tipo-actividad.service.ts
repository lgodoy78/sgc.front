import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tipoActividad } from 'src/app/core/model/tipoActividad.model';
import { Utilities } from 'src/app/core/services/utilities';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TipoActividadService { 
  private utilities = inject(Utilities);
  private http = inject(HttpClient);
  logicApiUrl = this.utilities.logicApiUrl();

  getListaTipoActividad(): Observable<any> {
    return this.http.get(`${this.logicApiUrl}/api/tipoactividad/listar`);
  }

  getTipoActividad(codTipoActividad: string): Observable<any> {
    return this.http.get(`${this.logicApiUrl}/api/tipoactividad/obtener/${codTipoActividad}`);
  }

  createTipoActividad(tipoActividad: tipoActividad): Observable<any> {
    return this.http.post(`${this.logicApiUrl}/api/tipoactividad/crear`, tipoActividad);
  }

  updateTipoActividad(tipoActividad: tipoActividad): Observable<any> {
    return this.http.put(`${this.logicApiUrl}/api/tipoactividad/actualizar`, tipoActividad);
  }

  deleteTipoActividad(codTipoActividad: string): Observable<any> {
    return this.http.delete(`${this.logicApiUrl}/api/tipoactividad/eliminar/${codTipoActividad}`);
  }
}
