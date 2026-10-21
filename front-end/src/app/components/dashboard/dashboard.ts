import { Component, computed, inject, signal } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';


import { Users } from '../../services/users';
import { RouterLink } from '@angular/router';

@Component({
  imports: [
    MatButtonModule, MatCardModule, MatIconModule, MatFormFieldModule, MatInputModule, MatTableModule,
    RouterLink
],
  selector: 'app-dashboard',
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard {
  UsersService = inject(Users);

  displayedColumns = ['name', 'email', 'phone', 'role', 'actions'];
  
  search = signal('');

  filteredUsers = computed(() => {
    const query = this.search().trim().toLowerCase();
    
    if(!query) {
      return this.UsersService.users();
    }

    return this.UsersService.users().filter((user: any) =>
      [user.name, user.email, user.phone].some((value) => value.toLowerCase().includes(query))
    );
  });

  onSearch(event: Event) {
    this.search.set((event.target as HTMLInputElement).value);
  }

  deleteUser(user: any) {
    this.UsersService.deleteUser(user).subscribe({
      next: () => this.UsersService.getUsers(),
      error: (err) => console.error(err)
    });
  }

  promoteUser(user: any) {
    this.UsersService.changeRole(user, 'admin').subscribe({
      next: () => this.UsersService.getUsers(),
      error: (err) => console.error(err)
    })
  }

  demoteUser(user: any) {
    this.UsersService.changeRole(user, 'user').subscribe({
      next: () => this.UsersService.getUsers(),
      error: (err) => console.error(err)
    })
  }


  initials(name: string): string {
    return name
      .split(' ')
      .filter(Boolean)
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }


  ngOnInit() {
    this.UsersService.getUsers()
  }
}
