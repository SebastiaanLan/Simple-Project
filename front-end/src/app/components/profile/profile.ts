import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { Users } from '../../services/users';

@Component({
  imports: [
    MatButtonModule, MatCardModule, MatIconModule,
    RouterLink
],
  selector: 'app-profile',
  styleUrl: './profile.css',
  templateUrl: './profile.html',
})
export class Profile {
  private router = inject(Router);
  private UsersService = inject(Users);

  logout() {
    this.UsersService.logout().subscribe({
      next: () => this.router.navigate(['/login'])
    });
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

}
