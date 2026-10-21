import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';

import { Users, Role } from '../services/users';

export const roleGuard = (allowedRoles: Role[]): CanActivateFn => {
  return () => {
    const UsersService = inject(Users);
    const router = inject(Router);

    return UsersService.checkAuth().pipe(
      map(authenticated => {
        if (!authenticated) {
          return router.createUrlTree(['/login']);
        }

        const user = UsersService.currentUser();

        if (user && allowedRoles.includes(user.role)) {
          return true;
        }

        return router.createUrlTree(['/']);
      })
    )
  }
};
