import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  // Clonar request con token
  const authReq = addTokenToRequest(req, authService.currentAccessToken);
  
  return next(authReq).pipe(
    catchError(error => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
         return handle401Error(authReq, next, authService, router);
      }
      return throwError(() => error);
    })
  );
};

function addTokenToRequest(req: HttpRequest<unknown>, token: string | null) {
  return token 
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;
}

function handle401Error(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService,
  router: Router
) {
  // Evitar loops de errores
  if (req.url.includes('auth/refresh')) {
    authService.logout();
    return throwError(() => 'Session expired');
  }

  return throwError(() => 'Session expired');
 
}