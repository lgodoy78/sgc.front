import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ModalidadActividad } from 'src/app/core/model/modalidadActividad.model';
import { Utilities } from 'src/app/core/services/utilities';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ModalidadActividadService { 
  private utilities = inject(Utilities);
  private http = inject(HttpClient);
  logicApiUrl = this.utilities.logicApiUrl();

  getListaModalidadActividad(): Observable<any> {
    return this.http.get(`${this.logicApiUrl}/api/modalidadactividad/listar`);
  }

  getModalidadActividad(codModalidadActividad: string): Observable<any> {
    return this.http.get(`${this.logicApiUrl}/api/modalidadactividad/obtener/${codModalidadActividad}`);
  }

  createModalidadActividad(modalidadActividad: ModalidadActividad): Observable<any> {
    return this.http.post(`${this.logicApiUrl}/api/modalidadactividad/crear`, modalidadActividad);
  }

  updateModalidadActividad(modalidadActividad: ModalidadActividad): Observable<any> {
    return this.http.put(`${this.logicApiUrl}/api/modalidadactividad/actualizar`, modalidadActividad);
  }

  deleteModalidadActividad(codModalidadActividad: string): Observable<any> {
    return this.http.delete(`${this.logicApiUrl}/api/modalidadactividad/eliminar/${codModalidadActividad}`);
  }
}
