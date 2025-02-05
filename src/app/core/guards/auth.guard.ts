import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verificar autenticación usando la señal del servicio
  if (authService.isAuthenticated()) {
    return true;
  }

  // Redirigir a login y guardar URL solicitada
  return router.createUrlTree(['/login'] );
};