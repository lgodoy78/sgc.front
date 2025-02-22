import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Empresa } from 'src/app/core/model/empresa.model';
import { Utilities } from 'src/app/core/services/utilities';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class EmpresaService {
  private utilities = inject(Utilities);
  private http = inject(HttpClient);
  logicApiUrl = this.utilities.logicApiUrl();

  getListaEmpresas(): Observable<any> {
    return this.http.get(`${this.logicApiUrl}/api/empresa/listar`);
  }

  getEmpresa(id: number): Observable<any> {
    return this.http.get(`${this.logicApiUrl}/api/empresa/obtener/${id}`);
  }

  createEmpresa(empresa: Empresa): Observable<any> {
    return this.http.post(`${this.logicApiUrl}/api/empresa/crear`, empresa);
  }

  updateEmpresa(empresa: Empresa): Observable<any> {
    return this.http.put(`${this.logicApiUrl}/api/empresa/actualizar`, empresa);
  }

  deleteEmpresa(rutEmpresa: number): Observable<any> {
    return this.http.delete(
      `${this.logicApiUrl}/api/empresa/eliminar/${rutEmpresa}`
    );
  }
}
