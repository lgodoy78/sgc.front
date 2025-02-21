import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { procesos } from 'src/app/core/model/procesos.model';
import { Utilities } from 'src/app/core/services/utilities';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProcesosService { 
  private utilities = inject(Utilities);
  private http = inject(HttpClient);
  logicApiUrl = this.utilities.logicApiUrl();

  getListaProcesos(): Observable<any> {
    return this.http.get(`${this.logicApiUrl}/api/proceso/listar`);
  }

  getProceso(codProceso: string): Observable<any> {
    return this.http.get(`${this.logicApiUrl}/api/proceso/obtener/${codProceso}`);
  }

  createProceso(proceso: procesos): Observable<any> {
    return this.http.post(`${this.logicApiUrl}/api/proceso/crear`, proceso);
  }

  updateProceso(proceso: procesos): Observable<any> {
    return this.http.put(`${this.logicApiUrl}/api/proceso/actualizar`, proceso);
  }

  deleteProceso(codProceso: string): Observable<any> {
    return this.http.delete(`${this.logicApiUrl}/api/proceso/eliminar/${codProceso}`);
  }
}
