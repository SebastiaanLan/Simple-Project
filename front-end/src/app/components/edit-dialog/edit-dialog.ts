import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Users } from '../../services/users';

@Component({
  imports: [
    ReactiveFormsModule,
    MatButtonModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule
  ],
  selector: 'app-edit-dialog',
  styleUrl: './edit-dialog.css',
  templateUrl: './edit-dialog.html',
})
export class EditDialog {
  FormBuilder = inject(FormBuilder);
  UsersService = inject(Users);

  dialogRef = inject(MatDialogRef);
  user = inject(MAT_DIALOG_DATA);

  confirmingDelete = signal(false);

  form = this.FormBuilder.group({
    name: [this.user.name, [Validators.required, Validators.pattern(/^[\p{L}][\p{L}\s'\-]*$/u), Validators.minLength(2), Validators.maxLength(32)]],
    email: [this.user.email, [Validators.required, Validators.email]],
    phone: [this.user.phone, [Validators.required, Validators.pattern(/^[+]?[- ()0-9]{6,20}$/)]],
    role: [this.user.role === 'admin' ? 'admin' : 'user', [Validators.required]]
  });

  askDelete() {
    this.confirmingDelete.set(true);
  }

  keepUser() {
    this.confirmingDelete.set(false);
  }

  deleteUser() {
    this.UsersService.deleteUser(this.user).subscribe({
      next: () => {
        this.dialogRef.close()
      }, error: (err) => console.error(err)
    });
  }

  hasChanges() {
    const value = this.form.getRawValue();

    return (
      value.name?.trim() !== this.user.name ||
      value.email?.trim() !== this.user.email ||
      value.phone?.trim() !== this.user.phone ||
      value.role !== this.user.role
    )
  };

  save() {
    if (this.form.invalid || !this.hasChanges()) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const changes: Record<string, string> = {};

    for (const key of ['name', 'email', 'phone', 'role'] as const) {
      const newValue = value[key]?.trim();
      if (newValue !== this.user[key]) {
        changes[key] = newValue!;
      }
    }

    this.UsersService.updateUserAdmin(this.user.id, changes).subscribe({
      next: () => {
        this.dialogRef.close()
      },
      error: (err) => console.error(err)
    })
  }
}
