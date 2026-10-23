import { Component, computed, inject, signal } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

import { Users } from '../../services/users';
import { RouterLink } from '@angular/router';
import { EditDialog } from '../edit-dialog/edit-dialog';

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
  dialog = inject(MatDialog);

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

  editUser(user: any) {
    this.dialog
      .open<EditDialog, any>(EditDialog, {data: user, width: '440px' })
      .afterClosed()
      .subscribe((result) => {
        if (!result) return;
      })
  }

  ngOnInit() {
    this.UsersService.getUsers();
  }
}
