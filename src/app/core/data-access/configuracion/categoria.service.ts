import { Injectable, inject } from '@angular/core'; 
import { Observable } from 'rxjs';
import { Categoria } from '../../model/categoria.model'; 
import { Utilities } from 'src/app/core/services/utilities';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private utilities = inject(Utilities);
  private http = inject(HttpClient);
  logicApiUrl = this.utilities.logicApiUrl();

  getListaCategoria(): Observable<any> { 
    return this.http.get(`${this.logicApiUrl}/api/categoria/listar`);
  }

  getCategoria(id: number): Observable<any> { 
    return this.http.get(`${this.logicApiUrl}/api/categoria/obtener/${id}`);
  } 
 
  getSearchCategoria(categoria: Categoria): Observable<any> {  
    return this.http.post(`${this.logicApiUrl}/api/categoria/buscar`, categoria);
  }

  createCategoria(categoria: Categoria): Observable<any> { 
    return this.http.post(`${this.logicApiUrl}/api/categoria/crear`, categoria);
  }

  updateCategoria(categoria: Categoria): Observable<any> {
    return this.http.put(`${this.logicApiUrl}/api/categoria/actualizar`, categoria);
  }

  deleteCategoria(id: number): Observable<any> {
    return this.http.delete(`${this.logicApiUrl}/api/categoria/eliminar/${id}`);
  }
}
