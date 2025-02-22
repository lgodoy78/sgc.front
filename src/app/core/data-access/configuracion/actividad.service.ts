import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Utilities } from 'src/app/core/services/utilities';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ActividadService {
  private utilities = inject(Utilities);
  private http = inject(HttpClient);
  logicApiUrl = this.utilities.logicApiUrl();

  getListaActividadesSii(): Observable<any> {
    return this.http.get(`${this.logicApiUrl}/api/SiiActividad/listar`);
  }
 
  getListaActividadesCmf(): Observable<any> {
    return this.http.get(`${this.logicApiUrl}/api/CmfActividad/listar`);
  }

  getListaSectoresFinancierosCmf(): Observable<any> {
    return this.http.get(`${this.logicApiUrl}/api/CmfSectores/listar`);
  }

  getListaComponentesInstitucionalesCmf(): Observable<any> {
    return this.http.get(`${this.logicApiUrl}/api/CmfComposicion/listar`);
  }
}
