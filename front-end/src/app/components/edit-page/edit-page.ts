import { Component, computed, inject, OnInit, output, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { Users } from '../../services/users';

const MAX_AVATAR_SIZE = 2 * 1024 * 1024;
const ALLOWED_AVATAR_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

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

  avatarUrl = `http://localhost:4000/users/avatar/${this.UsersService.currentUser().id}`;

  avatarFile = signal<File | null>(null);
  avatarPreview = signal<string | null>(null);
  removeAvatar = signal(false);
  avatarError = signal('');

  form = this.FormBuilder.group({
    name: ['', [Validators.required, Validators.pattern(/^[\p{L}][\p{L}\s'\-]*$/u), Validators.minLength(2), Validators.maxLength(32)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^[+]?[- ()0-9]{6,20}$/)]],
    avatar: ['', [Validators.required]]
  });

  currentAvatar = computed(
    () => this.avatarPreview() ?? (this.removeAvatar() ? null : (this.UsersService.currentUser().avatarUrl ?? null)) 
  )

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
      value.phone?.trim() !== user.phone ||
      value.avatar?.trim() !== user.avatar
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

    for (const key of ['name', 'email', 'phone', 'avatar'] as const) {
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

  clearAvatar() {
    this.clearPreview();
    this.avatarFile.set(null);
    this.avatarError.set('');
    this.removeAvatar.set(!!this.UsersService.currentUser.avatarUrl);
  }

  clearPreview() {
    const url = this.avatarPreview();

    if (url) {
      URL.revokeObjectURL(url);
    }

    this.avatarPreview.set(null);
  }

  onAvatarSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';

    if (!file) return;

    if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
      this.avatarError.set("Please choos a PNG, JPG or WebP image");
      return;
    }

    if (file.size > MAX_AVATAR_SIZE) {
      this.avatarError.set("The image must be 2 MB or smaller");
      return;
    }

    this.avatarError.set('');
    this.clearPreview();
    this.avatarFile.set(file);
    this.avatarPreview.set(URL.createObjectURL(file));
    this.removeAvatar.set(false);
  }
}
