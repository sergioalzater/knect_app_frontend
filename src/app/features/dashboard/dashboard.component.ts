import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { KnectDataService } from '../../core/services/knect-data.service';
import { I18nService } from '../../core/services/i18n.service';
import { Business } from '../../shared/models';

@Component({
  selector: 'app-dashboard',
  imports: [FormsModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  protected readonly authService = inject(AuthService);
  private readonly dataService = inject(KnectDataService);
  private readonly router = inject(Router);
  protected readonly i18n = inject(I18nService);

  protected readonly activeSection = signal<'PROFILE' | 'RATE_RESTAURANTS'>('PROFILE');
  protected readonly restaurantsToRate = signal<Business[]>([]);

  protected name = '';
  protected lastName = '';
  protected phone = '';
  protected email = '';
  protected password = '';
  protected readonly showPassword = signal(false);
  protected readonly isSaving = signal(false);
  protected readonly savedMsg = signal('');
  protected readonly errorMsg = signal('');

  ngOnInit(): void {
    const u = this.authService.user();
    if (u) {
      this.name = u.name || '';
      this.lastName = u.lastName || '';
      this.phone = u.phone || '';
      this.email = u.email || '';
    }
    this.dataService.getCatalog({ page: 0, size: 6 }).subscribe((res) => {
      this.restaurantsToRate.set(res.content);
    });
  }

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  saveProfile(): void {
    if (this.isSaving() || !this.name.trim() || !this.email.trim()) return;
    this.isSaving.set(true);
    this.savedMsg.set('');
    this.errorMsg.set('');

    this.authService
      .updateProfile({
        name: this.name,
        lastName: this.lastName,
        phone: this.phone,
        email: this.email,
        password: this.password || undefined,
      })
      .subscribe({
        next: () => {
          this.isSaving.set(false);
          this.password = '';
          this.savedMsg.set(
            this.i18n.lang() === 'es'
              ? 'Tus datos personales han sido actualizados correctamente.'
              : 'Your personal details have been updated successfully.',
          );
        },
        error: (err) => {
          this.isSaving.set(false);
          this.errorMsg.set(
            err.error?.message ||
              (this.i18n.lang() === 'es' ? 'Error al actualizar el perfil.' : 'Failed to update profile.'),
          );
        },
      });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
