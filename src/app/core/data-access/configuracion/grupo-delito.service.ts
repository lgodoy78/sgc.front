import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GrupoDelito } from 'src/app/core/model/grupoDelito.model';
import { Utilities } from 'src/app/core/services/utilities';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class GrupoDelitoService { 
  private utilities = inject(Utilities);
  private http = inject(HttpClient);
  logicApiUrl = this.utilities.logicApiUrl();

  getListaGrupoDelito(): Observable<any> {
    return this.http.get(`${this.logicApiUrl}/api/GrupoDelito/listar`);
  }

  getGrupoDelito(idGrupoDelito: number): Observable<any> {
    return this.http.get(`${this.logicApiUrl}/api/GrupoDelito/obtener/${idGrupoDelito}`);
  }

  getSearchGrupoDelito(GrupoDelito: GrupoDelito): Observable<any> { 
    return this.http.post(`${this.logicApiUrl}/api/GrupoDelito/buscar`, GrupoDelito);
  }

  createGrupoDelito(GrupoDelito: GrupoDelito): Observable<any> {
    return this.http.post(`${this.logicApiUrl}/api/GrupoDelito/crear`, GrupoDelito);
  }

  updateGrupoDelito(GrupoDelito: GrupoDelito): Observable<any> {
    return this.http.put(`${this.logicApiUrl}/api/GrupoDelito/actualizar`, GrupoDelito);
  }

  deleteGrupoDelito(idGrupoDelito: number): Observable<any> {
    return this.http.delete(`${this.logicApiUrl}/api/GrupoDelito/eliminar/${idGrupoDelito}`);
  }
}
