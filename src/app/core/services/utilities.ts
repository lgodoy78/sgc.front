import { Injectable } from '@angular/core';
import { AppExternalConfig } from './app-external-config';
import { Observable, filter, map, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class Utilities { 
  url:any;
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

  logicApiUrl() {
    this.logicApiUrl$.pipe(
      filter(url => !!url),
      tap(url => this.url = url)
    ).subscribe();

    return this.url;
  }
   
}