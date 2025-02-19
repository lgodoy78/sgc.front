import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Utilities } from 'src/app/core/services/utilities';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ComunaService {
  private utilities = inject(Utilities);
  private http = inject(HttpClient);
  logicApiUrl = this.utilities.logicApiUrl();

  getListaPaises(): Observable<any> {
    return this.http.get(`${this.logicApiUrl}/api/pais/listar`);
  }
  getListaRegiones(codPais:any): Observable<any> {
    return this.http.get(`${this.logicApiUrl}/api/region/listar/${codPais}`);
  }
  getListaComunas(codPais:any,codRegion:any): Observable<any> {
    return this.http.get(`${this.logicApiUrl}/api/comuna/listar/${codPais}/${codRegion}`);
  }
}
