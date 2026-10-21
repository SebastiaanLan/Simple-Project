import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { Users, LoginInfo } from '../../services/users';

@Component({
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule, MatIconModule, MatFormFieldModule, MatInputModule, MatButtonModule,
],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  FormBuilder = inject(NonNullableFormBuilder);
  UserService = inject(Users);
  router = inject(Router);

  loginError = ''

  form = this.FormBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loginError = '';

    const loginInfo: LoginInfo = this.form.getRawValue();
    this.UserService.login(loginInfo).subscribe({
      next: () => this.router.navigate(['/']),
      error: () => {
        this.loginError = 'Login Failed'
      }
    });
  }
}
