import { Injectable } from '@angular/core';
import { AppExternalConfig } from './app-external-config';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class Utilities {
  constructor(private appConfig: AppExternalConfig) {}

  get logicApiUrl$(): Observable<string> {
    return this.appConfig.config$.pipe(
      map(config => config?.logicApiUrl || 'https://localhost:5000')
    );
  }

  get statusEnabled$(): Observable<boolean> {
    return this.appConfig.config$.pipe(
      map(config => config?.statusEnabled || false)
    );
  }
}