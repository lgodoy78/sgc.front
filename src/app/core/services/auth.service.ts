import { effect, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { filter, lastValueFrom, Observable, tap } from 'rxjs';
import { Utilities } from './utilities';

export interface UsuarioInterface {
  idUsuario: number;
  nombreUsuario: string;
  correoUsuario: string;
  idRol: number;
  rol:string;
  rutEmpresa: number;
}


@Injectable({ providedIn: 'root' })
export class AuthService {
  
  private utilities = inject(Utilities);
  private http = inject(HttpClient);
  private router = inject(Router);

  private accessToken = signal<string | null>(null);
  private usuarioState = signal<UsuarioInterface>({
    idUsuario: 0,
    nombreUsuario: '',
    correoUsuario: '',
    idRol: 0,
    rol: '',
    rutEmpresa: 0
  });
 
  logicApiUrl = '';
  isAuthenticated = signal(false);

  constructor() {
    this.checkAuth();
    this.initializeAuth();
    this.setupEffects();
    this.setupConfigDependencies();
  }

  private setupEffects() { 
    effect(() => {
      const token = this.accessToken();
      if (token) {
        // this.scheduleTokenRefresh();
      }
    });
  }

  private setupConfigDependencies() {
    this.utilities.logicApiUrl$.pipe(
      filter(url => !!url),
      tap(url => this.logicApiUrl = url)
    ).subscribe();
  }

  private checkAuth() {
    const token = localStorage.getItem('accessToken');
    this.isAuthenticated.set(!!token);
  }

  private initializeAuth() {
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
      this.accessToken.set(storedToken);
    }
    const storedUsuario = localStorage.getItem('usuarioState');
    if (storedUsuario) {
      this.usuarioState.set(JSON.parse(storedUsuario!) as UsuarioInterface);
    }
  }



  async login(mailUsuario: string, clave: string): Promise<any> {
    const response = await lastValueFrom(
      this.http.post<any>(`${this.logicApiUrl}/api/login/auth`, {
        mailUsuario,
        clave,
      })
    );

    this.usuarioState.update((state) => ({
      ...state,
      nombreUsuario: response.nombreUsuario,
      correoUsuario: mailUsuario,
      idUsuario: response.idUsuario,
      rol: response.rol,
      idRol: response.idRol,
    }));
    localStorage.setItem('usuarioState', JSON.stringify(this.usuarioState()));
    return response;
  }

  async Auth(rutEmpresa: any): Promise<any> {
    const nombreUsuario = this.usuarioState().nombreUsuario;
    const idUsuario = this.usuarioState().idUsuario; 
    const idRol = this.usuarioState().idRol;
    const minutosToken = 90;

    const response = await lastValueFrom(
      this.http.post<any>(`${this.logicApiUrl}/api/login/token`, {
        nombreUsuario,
        rutEmpresa,
        idRol,
        idUsuario,
        minutosToken,
      })
    );

    this.usuarioState.update((state) => ({
      ...state,
      rutEmpresa: rutEmpresa
    }));

    localStorage.setItem('accessToken', response.token);
    localStorage.setItem('usuarioState', JSON.stringify(this.usuarioState()));
    this.isAuthenticated.set(true); 
    
    return response;
  }

  listaEmpresasUsuario() : Observable<any> { 
    const idUsuario = this.usuarioState().idUsuario;
    return this.http.get(`${this.logicApiUrl}/api/login/empresas/usuario/${idUsuario}`);
  }

  logout() {
    this.accessToken.set(null);
    this.isAuthenticated.set(false);
    localStorage.removeItem('accessToken');
    this.router.navigate(['/login']);
  }

  get currentAccessToken() {
    return this.accessToken();
  }
  get getUsuarioState() {
    return this.usuarioState();
  }
}
