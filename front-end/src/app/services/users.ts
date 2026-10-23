import { Service, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, map, Observable, of, tap } from 'rxjs';

export interface UserInfo {
    name: string,
    email: string,
    phone: string,
    password: string
}

export interface LoginInfo {
    email: string,
    password: string
}

export type Role = 'user' | 'admin';

export interface User {
  id: number | string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  avatar: string;
}

@Service()
export class Users {
    private http = inject(HttpClient);
    private router = inject(Router);

    private url = 'http://localhost:4000';

    private _users: any = signal([]);
    users = this._users.asReadonly();

    private _currentUser: any = signal([]);
    currentUser = this._currentUser.asReadonly();

    private _isAuthenticated = signal(false);
    readonly isAuthenticated = this._isAuthenticated.asReadonly();

    private _authChecked = signal(false);

    readonly idAdmin = computed(
        () => this._currentUser().role === 'admin'
    );

    getToken(): string | null {
        return typeof localStorage !== 'undefined'
            ? localStorage.getItem('token')
            : null;
    }

    checkAuth(): Observable<boolean> {
        if (this._authChecked()) {
            return of(this._isAuthenticated());
        }

        return this.http.get<User>(
            `${this.url}/me`,
            { withCredentials: true }
            ).pipe(tap(user => {
                console.log(user.role);
                this._currentUser.set(user);
                this._isAuthenticated.set(true);
                this._authChecked.set(true);
            }),map(() => true),
                catchError(() => {
                this._currentUser.set(null);
                this._isAuthenticated.set(false);
                this._authChecked.set(true);
                return of(false);
            }),
        );
    }
    
    getUsers() {
        this.http.get(
            `${this.url}/users`,
            { withCredentials: true }
        ).subscribe({
            next: users => this._users.set(users),
            error: err => console.error('Loading users failed', err),
        });
    }

    register(userInfo: UserInfo) {
        return this.http.post(
            `${this.url}/register`,
            userInfo,
            { withCredentials: true }
        ).pipe(
            tap(() => this.checkAuth())
        );
    }

    login(loginInfo: LoginInfo) {
        return this.http.post(
            `${this.url}/login`,
            loginInfo,
            { withCredentials: true }
        ).pipe(
            tap(() => this.checkAuth())
        );
    }

    logout() {
        return this.http.post(
            `${this.url}/logout`,
            {},
            { withCredentials: true }
        ).pipe(tap(() => {
            this._currentUser.set(null);
            this._isAuthenticated.set(false);
            this._authChecked.set(true);
        }));
    }

    deleteUser(user: User) {
        return this.http.delete(
            `${this.url}/users/${user.id}`,
            { withCredentials: true }
        ).pipe(
            tap(() => {
                this._users.update((users: User[]) =>
                    users.filter((u: User) => u.id !== user.id)
                );
            })
        );
    }

    updateUser(userId: number, changes: any) {
        return this.http.put(
            `${this.url}/users/${userId}`,
            changes,
            { withCredentials: true }
        ).pipe(tap(user => {
            this._currentUser.set(user);
        }));
    }

    updateUserAdmin(userId: number, changes: any) {
        return this.http.put(
            `${this.url}/users/admin/${userId}`,
            changes,
            { withCredentials: true }
        ).pipe(
            tap(updatedUser => 
                this._users.update((users: User[]) => 
                    users.map( (user: User) =>
                        user.id === userId ? { ...user, ...updatedUser } : user
                    )
                )
            )
        );
    }
}
