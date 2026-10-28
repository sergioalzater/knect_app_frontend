import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { I18nService } from '../../../core/services/i18n.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  protected readonly i18n = inject(I18nService);

  protected name = '';
  protected lastName = '';
  protected phone = '';
  protected email = '';
  protected password = '';
  protected role = 'CLIENT';
  protected readonly error = signal('');
  protected readonly isLoading = signal(false);
  protected readonly showPassword = signal(false);
  /** true tras el primer intento de envío: muestra los errores de todos los campos. */
  protected readonly submitted = signal(false);

  /** Puntuación 0–4 de la contraseña: longitud, longitud extra, mayúsculas/minúsculas con números y símbolos. */
  protected passwordScore(): number {
    const p = this.password;
    if (!p) return 0;
    let score = 0;
    if (p.length >= 6) score++;
    if (p.length >= 10) score++;
    if (/[a-z]/.test(p) && /[A-Z]/.test(p) && /\d/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return Math.max(score, 1);
  }

  protected strengthLabel(): string {
    const score = this.passwordScore();
    return score === 0 ? '' : this.i18n.t(`auth.strength${score}`);
  }

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  onSubmit(form?: NgForm): void {
    if (this.isLoading()) return;
    this.submitted.set(true);
    if (form?.invalid) return;

    this.error.set('');
    this.isLoading.set(true);

    this.authService
      .register({
        name: this.name,
        lastName: this.lastName,
        phone: this.phone,
        email: this.email,
        password: this.password,
        role: this.role,
      })
      .subscribe({
        next: (res) => {
          this.isLoading.set(false);
          if (res.user.role === 'BUSINESS_ADMIN') {
            this.router.navigate(['/brand-admin']);
          } else {
            this.router.navigate(['/']);
          }
        },
        error: (err) => {
          this.isLoading.set(false);
          this.error.set(err.error?.message || this.i18n.t('auth.registerFailed'));
        },
      });
  }
}
