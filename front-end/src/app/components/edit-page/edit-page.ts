import { Component, inject, OnInit, output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { Users } from '../../services/users';

@Component({
  imports: [
    ReactiveFormsModule,
    MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule
  ],
  selector: 'app-edit-page',
  styleUrl: './edit-page.css',
  templateUrl: './edit-page.html',
})
export class EditPage {
  private FormBuilder = inject(FormBuilder);
  private UsersService = inject(Users);

  cancelled = output<void>();

  form = this.FormBuilder.group({
    name: ['', [Validators.required, Validators.pattern(/^[\p{L}][\p{L}\s'\-]*$/u), Validators.minLength(2), Validators.maxLength(32)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^[+]?[- ()0-9]{6,20}$/)]],
  });

  ngOnInit() {
    const { name, email, phone } = this.UsersService.currentUser();
    this.form.reset({ name, email, phone});
  }

  hasChanges(): boolean {
    const value = this.form.getRawValue();
    const user = this.UsersService.currentUser();

    return (
      value.name?.trim() !== user.name ||
      value.email?.trim() !== user.email ||
      value.phone?.trim() !== user.phone
    )
  }

  save() {
    if (this.form.invalid || !this.hasChanges()) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const user = this.UsersService.currentUser();
    const changes: Record<string, string> = {};

    for (const key of ['name', 'email', 'phone'] as const) {
      const newValue = value[key]?.trim();
      if (newValue !== user[key]) {
        changes[key] = newValue!;
      }
    }

    this.UsersService.updateUser(user.id, changes).subscribe({
      next: () => {
        this.cancelled.emit();
      },
      error: (err) => console.error(err)
    })
  }

  cancel() {
    this.cancelled.emit();
  }
}
