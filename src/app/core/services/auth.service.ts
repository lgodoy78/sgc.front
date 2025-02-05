import { effect, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { filter, lastValueFrom, tap } from 'rxjs';
import { Utilities } from './utilities';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private utilities = inject(Utilities);
  private http = inject(HttpClient);
  private router = inject(Router);

  private accessToken = signal<string | null>(null);
  private usuarioState = signal({
    idUsuario: 0,
    usuario: '',
    rol: '',
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
      usuario: response.nombreUsuario,
      idUsuario: response.idUsuario,
      rol: response.rol,
    }));

    // localStorage.setItem('accessToken', response.accessToken);
    //  this.isAuthenticated.set(true);
    return response;
  }

  async Auth(rutEmpresa: string): Promise<any> {
    const usuario = this.usuarioState().usuario;
    const idUsuario = this.usuarioState().idUsuario;
    const rol = this.usuarioState().rol;
    const minutosToken = 90;

    const response = await lastValueFrom(
      this.http.post<any>(`${this.logicApiUrl}/api/login/token`, {
        usuario,
        rutEmpresa,
        rol,
        idUsuario,
        minutosToken,
      })
    );

    localStorage.setItem('accessToken', response.token);
    this.isAuthenticated.set(true);
    return response;
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
}
