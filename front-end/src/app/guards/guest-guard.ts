import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';

import { Users } from '../services/users';

export const guestGuard: CanActivateFn = () => {
  const UsersService = inject(Users);
  const router = inject(Router);

  return UsersService.checkAuth().pipe(
    map(isAuthenticated =>
      isAuthenticated ? router.createUrlTree(['/']) : true
    )
  )
};
