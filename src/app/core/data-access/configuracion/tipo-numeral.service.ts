import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TipoNumeral } from 'src/app/core/model/tipoNumeral.model';
import { Utilities } from 'src/app/core/services/utilities';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TipoNumeralService { 
  private utilities = inject(Utilities);
  private http = inject(HttpClient);
  logicApiUrl = this.utilities.logicApiUrl();

  getListaTipoNumeral(): Observable<any> {
    return this.http.get(`${this.logicApiUrl}/api/TipoNumeral/listar`);
  }

  getTipoNumeral(codTipoNumeral: string): Observable<any> {
    return this.http.get(`${this.logicApiUrl}/api/TipoNumeral/obtener/${codTipoNumeral}`);
  }

  createTipoNumeral(TipoNumeral: TipoNumeral): Observable<any> {
    return this.http.post(`${this.logicApiUrl}/api/TipoNumeral/crear`, TipoNumeral);
  }

  updateTipoNumeral(TipoNumeral: TipoNumeral): Observable<any> {
    return this.http.put(`${this.logicApiUrl}/api/TipoNumeral/actualizar`, TipoNumeral);
  }

  deleteTipoNumeral(codTipoNumeral: string): Observable<any> {
    return this.http.delete(`${this.logicApiUrl}/api/TipoNumeral/eliminar/${codTipoNumeral}`);
  }
}
