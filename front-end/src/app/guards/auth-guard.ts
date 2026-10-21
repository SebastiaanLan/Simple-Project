import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';

import { Users } from '../services/users';

export const authGuard: CanActivateFn = () => {
  const UsersService = inject(Users);
  const router = inject(Router)

  return UsersService.checkAuth().pipe(
    map(isAuthenticated =>
      isAuthenticated ? true : router.createUrlTree(['/login'])
    )
  )
};
