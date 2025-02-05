import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { UserService } from '../services/user.service';

export const roleGuard = (allowedRoles: string[]) => {
  return () => {
    const userService = inject(UserService);
    const router = inject(Router);
    
   /* return userService.getUserRoles().pipe(
      map(roles => {
        const hasRole = roles.some(role => allowedRoles.includes(role));
        return hasRole || router.parseUrl('/unauthorized');
      })
    );*/


  };
};