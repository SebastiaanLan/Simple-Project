import { Routes } from '@angular/router';

import { authGuard } from './guards/auth-guard';

import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { guestGuard } from './guards/guest-guard';
import { Profile } from './components/profile/profile';
import { Dashboard } from './components/dashboard/dashboard';
import { roleGuard } from './guards/role-guard';

export const routes: Routes = [
    { path: 'login', component: Login, canActivate: [guestGuard] },
    { path: 'register', component: Register, canActivate: [guestGuard] },
    { path: 'dashboard', component: Dashboard, canActivate: [roleGuard(['admin'])] },
    { path: '', component: Profile, canActivate: [authGuard] }
];
