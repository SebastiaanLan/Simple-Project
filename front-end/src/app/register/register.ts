import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Users, UserInfo } from '../services/users';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-register',
  styleUrl: './register.css',
  templateUrl: './register.html',
})
export class Register {
  FormBuilder = inject(NonNullableFormBuilder);
  UsersService = inject(Users);

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

    const userInfo: UserInfo = this.form.getRawValue();
    this.UsersService.addUser(userInfo);
    this.form.reset();
  }
}
