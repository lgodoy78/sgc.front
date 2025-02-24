import { Injectable, inject } from '@angular/core'; 
import { Observable } from 'rxjs';
import { SubIdentidad } from '../../model/subIdentidad.model'; 
import { Utilities } from 'src/app/core/services/utilities';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SubIdentidadService {
  private utilities = inject(Utilities);
  private http = inject(HttpClient);
  logicApiUrl = this.utilities.logicApiUrl();

  getListaSubIdentidades(): Observable<any> { 
    return this.http.get(`${this.logicApiUrl}/api/gerencia/listar`);
  }

  getSubIdentidad(id: number): Observable<any> { 
    return this.http.get(`${this.logicApiUrl}/api/gerencia/obtener/${id}`);
  } 

  getSearchSubIdentidad(subIdentidad: SubIdentidad): Observable<any> { 
    return this.http.post(`${this.logicApiUrl}/api/gerencia/buscar`, subIdentidad);
  }

  createSubIdentidad(subIdentidad: SubIdentidad): Observable<any> { 
    return this.http.post(`${this.logicApiUrl}/api/gerencia/crear`, subIdentidad);
  }

  updateSubIdentidad(subIdentidad: SubIdentidad): Observable<any> {
    return this.http.put(`${this.logicApiUrl}/api/gerencia/actualizar`, subIdentidad);
  }

  deleteSubIdentidad(id: number): Observable<any> {
    return this.http.delete(`${this.logicApiUrl}/api/gerencia/eliminar/${id}`);
  }
}
