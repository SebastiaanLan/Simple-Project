import { Routes } from '@angular/router';

import { authGuard } from './guards/auth-guard';

import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Profile } from './components/profile/profile';
import { Dashboard } from './components/dashboard/dashboard';
import { EditPage } from './components/edit-page/edit-page';

export const routes: Routes = [
    { path: 'login', component: Login, canActivate: [authGuard('guest')] },
    { path: 'register', component: Register, canActivate: [authGuard('guest')] },
    { path: 'dashboard', component: Dashboard, canActivate: [authGuard('role', ['admin'])] },
    { path: '', component: Profile, canActivate: [authGuard('role', ['user', 'admin'])] },
    { path: 'profile/edit', component: EditPage, canActivate: [authGuard('role', ['user', 'admin'])] }
];
