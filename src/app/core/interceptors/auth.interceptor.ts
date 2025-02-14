import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn, 
  HttpHeaders,
  HttpResponse
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { catchError, tap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  // Clonar request con token y cabeceras
  const authReq = addHeadersToRequest(req, getToken('accessToken'));
  
  return next(authReq).pipe(
    tap(res => {
      if (res instanceof HttpResponse) {
        registrarCsrfToken(res.headers);
      }
    }),
    catchError(error => {
      switch (error.status) {
        case 401:
          return handle401Error(next, authService, router); 
        case 412:
          registrarCsrfToken(error.headers);
          req = agregarCsrfToken(req);
          return next(req);
        default: 
          break;
      }
      return throwError(() => error);
    })
  );
};

function addHeadersToRequest(req: HttpRequest<unknown>, token: string | null) { 
  const headers: { [key: string]: string } = {};
 
  if (!req.headers.has('Content-Type')) {
    headers['Content-Type'] = 'application/json; charset=utf8';
  }
   
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  req = agregarCsrfToken(req);

  return req.clone({ setHeaders: headers });
}

function agregarCsrfToken(req: HttpRequest<any>) {
 
  const nombreXsrf = 'x-xsrf';
  const token = getToken(nombreXsrf);

  if (token === null) {
    return req;
  }

  return req.clone({
    headers:
      req.headers
        .set(nombreXsrf, token)
  });
}

function registrarCsrfToken(res: HttpHeaders) {
  const nombreXsrf = 'x-xsrf';
  const tokenHeader =
    res.get(nombreXsrf);

  if (tokenHeader === null) {
    return;
  }
  setToken(nombreXsrf,tokenHeader);
}

function getToken(name: string) {
  return localStorage.getItem(name);
}

function setToken(name: string, token: string) {
  return localStorage.setItem(name,token);
}


  
function handle401Error( 
  next: HttpHandlerFn,
  authService: AuthService,
  router: Router
) {
  console.log('Error 400');
  authService.logout();
  router.navigate(['/login']);
  return throwError(() => 'Error de autenticación');
}