import { Service, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Service()
export class Users {
    http = inject(HttpClient);
    url = 'http://localhost:4000';

    private _users: any = signal([]);
    users = this._users.asReadonly();

    getTodos() {
        return this.http.get(this.url + '/users').subscribe(users => this._users.set(users));
    }
}
