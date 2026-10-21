import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';


import { Users, UserInfo } from '../../services/users';

@Component({
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule, MatIconModule, MatFormFieldModule, MatInputModule, MatButtonModule,
  ],
  selector: 'app-register',
  styleUrl: './register.css',
  templateUrl: './register.html',
})
export class Register {
  FormBuilder = inject(NonNullableFormBuilder);
  UsersService = inject(Users);
  router = inject(Router);

  registerError = '';

  form = this.FormBuilder.group({
    name: ['', [Validators.required, Validators.pattern(/^[\p{L}][\p{L}\s'\-]*$/u), Validators.minLength(2), Validators.maxLength(32)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^[+]?[- ()0-9]{6,20}$/)]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(32)]]
  });

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.registerError = '';

    const userInfo: UserInfo = this.form.getRawValue();
    this.UsersService.register(userInfo).subscribe({
      next: () => this.router.navigate(['/']),
      error: () => {
        this.registerError = 'Creating a account Failed'
      }
    });
  }
}
