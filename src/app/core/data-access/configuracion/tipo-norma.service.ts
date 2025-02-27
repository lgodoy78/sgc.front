import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TipoNorma } from 'src/app/core/model/tipoNorma.model';
import { Utilities } from 'src/app/core/services/utilities';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TipoNormaService { 
  private utilities = inject(Utilities);
  private http = inject(HttpClient);
  logicApiUrl = this.utilities.logicApiUrl();

  getListaTipoNorma(): Observable<any> {
    return this.http.get(`${this.logicApiUrl}/api/tiponorma/listar`);
  }

  getTipoNorma(codTipoNorma: string): Observable<any> {
    return this.http.get(`${this.logicApiUrl}/api/tiponorma/obtener/${codTipoNorma}`);
  }

  createTipoNorma(tipoNorma: TipoNorma): Observable<any> {
    return this.http.post(`${this.logicApiUrl}/api/tiponorma/crear`, tipoNorma);
  }

  updateTipoNorma(tipoNorma: TipoNorma): Observable<any> {
    return this.http.put(`${this.logicApiUrl}/api/tiponorma/actualizar`, tipoNorma);
  }

  deleteTipoNorma(codTipoNorma: string): Observable<any> {
    return this.http.delete(`${this.logicApiUrl}/api/tiponorma/eliminar/${codTipoNorma}`);
  }
}
