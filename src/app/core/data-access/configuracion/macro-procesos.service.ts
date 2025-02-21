import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { macroProcesos } from 'src/app/core/model/macroProcesos.model';
import { Utilities } from 'src/app/core/services/utilities';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MacroProcesosService { 
  private utilities = inject(Utilities);
  private http = inject(HttpClient);
  logicApiUrl = this.utilities.logicApiUrl();

  getListaMacroProcesos(): Observable<any> {
    return this.http.get(`${this.logicApiUrl}/api/macroproceso/listar`);
  }

  getMacroProceso(codMacroProceso: string): Observable<any> {
    return this.http.get(`${this.logicApiUrl}/api/macroproceso/obtener/${codMacroProceso}`);
  }

  createMacroProceso(macroProceso: macroProcesos): Observable<any> {
    return this.http.post(`${this.logicApiUrl}/api/macroproceso/crear`, macroProceso);
  }

  updateMacroProceso(macroProceso: macroProcesos): Observable<any> {
    return this.http.put(`${this.logicApiUrl}/api/macroproceso/actualizar`, macroProceso);
  }

  deleteMacroProceso(codMacroProceso: string): Observable<any> {
    return this.http.delete(`${this.logicApiUrl}/api/macroproceso/eliminar/${codMacroProceso}`);
  }
}
