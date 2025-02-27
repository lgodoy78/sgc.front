import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AgrupacionControl } from 'src/app/core/model/agrupacionControl.model';
import { Utilities } from 'src/app/core/services/utilities';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AgrupacionControlService { 
  private utilities = inject(Utilities);
  private http = inject(HttpClient);
  logicApiUrl = this.utilities.logicApiUrl();

  getListaAgrupacionControl(): Observable<any> {
    return this.http.get(`${this.logicApiUrl}/api/agrupacioncontrol/listar`);
  }

  getAgrupacionControl(codAgrupacionControl: string): Observable<any> {
    return this.http.get(`${this.logicApiUrl}/api/agrupacioncontrol/obtener/${codAgrupacionControl}`);
  }

  createAgrupacionControl(agrupacionControl: AgrupacionControl): Observable<any> {
    return this.http.post(`${this.logicApiUrl}/api/agrupacioncontrol/crear`, agrupacionControl);
  }

  updateAgrupacionControl(agrupacionControl: AgrupacionControl): Observable<any> {
    return this.http.put(`${this.logicApiUrl}/api/agrupacioncontrol/actualizar`, agrupacionControl);
  }

  deleteAgrupacionControl(codAgrupacionControl: string): Observable<any> {
    return this.http.delete(`${this.logicApiUrl}/api/agrupacioncontrol/eliminar/${codAgrupacionControl}`);
  }
}
