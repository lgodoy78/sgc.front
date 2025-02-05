import { APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { AppExternalConfig } from './core/services/app-external-config';

export const appConfig: ApplicationConfig = {
  
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: (config: AppExternalConfig) => () => config.loadConfig(), 
      deps: [AppExternalConfig],
      multi: true
    },
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(
      withInterceptors([authInterceptor])
    )   
  ]
};

 