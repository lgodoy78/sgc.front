/*aimport { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, lastValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AppExternalConfig {
  private configLoaded = signal<boolean>(false);
  config = signal<any>(null); // Inicializar con null

  constructor(private http: HttpClient) {}

  sync loadConfig(): Promise<void> {
    console.log('Iniciando carga de configuración...');
    try {
      const config$ = this.http.get<any>('assets/config/config.json');
      const settings = await lastValueFrom(config$);
      console.log('Configuración cargada:', settings);
      this.config.set(settings);
      this.configLoaded.set(true);
    } catch (error) {
      console.error('Error en carga de configuración:', error);
      throw error;
    }
  }
  get isConfigLoaded(): boolean {
    return this.configLoaded();
  }
}
*/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AppExternalConfig {
  private configSubject = new BehaviorSubject<any>(null);
  config$ = this.configSubject.asObservable();

  constructor(private http: HttpClient) {}

  loadConfig(): Observable<any> {
    return this.http.get('assets/config/config.json').pipe(
      tap(config => {
        console.log('Configuración cargada');
        this.configSubject.next(config);
      }),
      catchError(error => {
        console.error('Error cargando configuración:', error);
        return throwError(() => new Error('Error loading config'));
      })
    );
  }
}