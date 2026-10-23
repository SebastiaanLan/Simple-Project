import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';

import { Users, Role } from '../services/users';

export type AccessType = 'auth' | 'guest' | 'role';

export const authGuard = (
  type: AccessType,
  allowedRoles: Role[] = []
): CanActivateFn => {
  return () => {
  const UsersService = inject(Users);
  const router = inject(Router)

    return UsersService.checkAuth().pipe(
      map(isAuthenticated => {
          const user = UsersService.currentUser()

          if (type === 'guest') return isAuthenticated ? router.createUrlTree(['/']) : true;
          
          if (!isAuthenticated) return router.createUrlTree(['/login']);

          if (type === 'auth') return true;
          if (user && allowedRoles.includes(user.role)) return true;

          return router.createUrlTree(['/']);
        }
      )
    )
  }
}
