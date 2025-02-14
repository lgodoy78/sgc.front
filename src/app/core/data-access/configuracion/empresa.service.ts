import { inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  delay,
  map,
  Observable,
  of,
  throwError,
} from 'rxjs';
import { Empresa } from 'src/app/core/model/empresa.model';
import { Utilities } from 'src/app/core/services/utilities';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class EmpresaService {
  private empresas = new BehaviorSubject<Empresa[]>([]);
  private utilities = inject(Utilities);
  private http = inject(HttpClient);
  logicApiUrl = this.utilities.logicApiUrl();

  itemsPerPage = 15;

  getListaEmpresas(): Observable<any> {
    return this.http.get(`${this.logicApiUrl}/api/empresa/listar`);
  }

  getEmpresa(id: any): Observable<any> {
    return this.http.post(`${this.logicApiUrl}/api/empresa/buscar`, {
      rutEmpresa:id
    });
  }

  createCompany(empresa: Empresa): Observable<Empresa> {
    try {
      const current = this.empresas.value;
      empresa.rutEmpresa = current.length + 1;
      this.empresas.next([...current, empresa]);
      return of(empresa).pipe(delay(1000));
    } catch (error) {
      return throwError(() => new Error('Error al crear empresa'));
    }
  }

  updateCompany(empresa: Empresa): Observable<boolean> {
    const current = this.empresas.value;
    const index = current.findIndex((c) => c.rutEmpresa === empresa.rutEmpresa);
    current[index] = empresa;
    this.empresas.next(current);
    return of(true).pipe(delay(1000));
  }

  deleteCompany(rutEmpresa: number): Observable<boolean> {
    const filtered = this.empresas.value.filter((c) => c.rutEmpresa !== rutEmpresa);
    this.empresas.next(filtered);
    return of(true).pipe(delay(500));
  }
}
