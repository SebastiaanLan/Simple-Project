import { Component, signal, inject, OnInit  } from '@angular/core';

import { Users } from '../services/users';

@Component({
  imports: [],
  selector: 'app-main',
  styleUrl: './main.css',
  templateUrl: './main.html',
})

export class Main {
  usersService = inject(Users);
  users = this.usersService.users;
  
  ngOnInit() {
    this.usersService.getUsers()
  }
}
