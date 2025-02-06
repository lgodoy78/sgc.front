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
  
  // Clonar request con token y cabeceras
  const authReq = addHeadersToRequest(req, authService.currentAccessToken);
  
  return next(authReq).pipe(
    catchError(error => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
         return handle401Error(authReq, next, authService, router);
      }
      return throwError(() => error);
    })
  );
};

function addHeadersToRequest(req: HttpRequest<unknown>, token: string | null) {
  // Cabeceras a agregar
  const headers: { [key: string]: string } = {};

  // Agregar 'Content-Type' solo si no está presente
  if (!req.headers.has('Content-Type')) {
    headers['Content-Type'] = 'application/json; charset=utf8';
  }

  // Agregar 'Authorization' si existe un token
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return req.clone({ setHeaders: headers });
}

function handle401Error(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService,
  router: Router
) {
  if (req.url.includes('auth/refresh')) {
    authService.logout();
    router.navigateByUrl('/login');
    return throwError(() => 'Sesión expirada');
  }

  return throwError(() => 'Error de autenticación');
}