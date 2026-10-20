import { Service, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface UserInfo {
    name: string,
    email: string,
    phone: string,
    password: string
}

@Service()
export class Users {
    http = inject(HttpClient);
    url = 'http://localhost:4000';

    private _users: any = signal([]);
    users = this._users.asReadonly();

    getUsers() {
        this.http.get(
            this.url + '/users',
            { withCredentials: true }
        ).subscribe({
            next: users => this._users.set(users),
            error: err => console.error('Loading users failed', err),
        });
    }

    addUser(userInfo: UserInfo) {
        this.http.post(
            this.url + '/register', 
            userInfo,
            { withCredentials: true }
        ).subscribe({
            next: () => this.getUsers(),
            error: (err) => console.error('Adding a user faild', err)
        });
    }
}
