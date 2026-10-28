import { Component, inject, isDevMode, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { I18nService } from '../../../core/services/i18n.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  protected readonly i18n = inject(I18nService);

  protected email = '';
  protected password = '';
  protected newRecoveryPassword = '';
  protected readonly isRecoverMode = signal(false);
  protected readonly error = signal('');
  protected readonly infoMsg = signal('');
  protected readonly isLoading = signal(false);
  protected readonly showPassword = signal(false);
  /** true tras el primer intento de envío: muestra los errores de todos los campos. */
  protected readonly submitted = signal(false);

  /** Las cuentas demo con credenciales visibles solo existen en desarrollo, nunca en producción. */
  protected readonly showDemoAccounts = isDevMode();

  onSubmit(form?: NgForm): void {
    if (this.isLoading()) return;
    this.submitted.set(true);
    if (form?.invalid) return;

    this.error.set('');
    this.infoMsg.set('');
    this.isLoading.set(true);

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res.user.role === 'SUPER_ADMIN') {
          this.router.navigate(['/super-admin']);
        } else if (res.user.role === 'BUSINESS_ADMIN') {
          this.router.navigate(['/brand-admin']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.error.set(err.error?.message || this.i18n.t('auth.invalidCredentials'));
      },
    });
  }

  onRecoverPassword(form?: NgForm): void {
    if (this.isLoading()) return;
    this.submitted.set(true);
    if (!this.email.trim()) {
      this.error.set(this.i18n.t('auth.recoverEmailRequired'));
      return;
    }
    if (form?.invalid) return;

    this.error.set('');
    this.isLoading.set(true);
    this.authService
      .recoverPassword({
        email: this.email,
        newPassword: this.newRecoveryPassword || 'Knect2026*',
      })
      .subscribe({
        next: (res) => {
          this.isLoading.set(false);
          this.infoMsg.set(res.message);
          this.submitted.set(false);
          this.isRecoverMode.set(false);
        },
        error: () => {
          this.isLoading.set(false);
          this.error.set(this.i18n.t('auth.recoverNotFound'));
        },
      });
  }

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  setRecoverMode(value: boolean): void {
    this.error.set('');
    this.infoMsg.set('');
    this.submitted.set(false);
    this.isRecoverMode.set(value);
  }

  quickDemoLogin(email: string, pass: string): void {
    this.email = email;
    this.password = pass;
    this.onSubmit();
  }
}
