import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs'; 
import { Cargo } from '../../model/cargo.model';
import { Utilities } from 'src/app/core/services/utilities'; 

@Injectable({
  providedIn: 'root'
})
export class CargoService { 
  private utilities = inject(Utilities);
  private http = inject(HttpClient);
  logicApiUrl = this.utilities.logicApiUrl(); 

  constructor() { }

  getListaCargos(): Observable<any> { 
    return this.http.get(`${this.logicApiUrl}/api/cargo/listar`);
  }

  getCargo(id: number): Observable<any> {
    return this.http.get(`${this.logicApiUrl}/api/cargo/listar/${id}`);
  } 

  getSearchCargo(cargo:Cargo): Observable<any> { 
    return this.http.post(`${this.logicApiUrl}/api/cargo/buscar`, cargo);
  }

  createCargo(cargo: Cargo): Observable<any> {
    return this.http.post<Cargo>(`${this.logicApiUrl}/api/cargo/crear`, cargo);
  }

  updateCargo(cargo: Cargo): Observable<any> {
    return this.http.put<Cargo>(`${this.logicApiUrl}/api/cargo/actualizar`, cargo);
  }

  deleteCargo(id: number): Observable<any> {
    return this.http.delete<void>(`${this.logicApiUrl}/api/cargo/eliminar/${id}`);
  }
}
