import { Component, ElementRef, HostListener, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { I18nService } from '../../../core/services/i18n.service';

const DESKTOP_BREAKPOINT = 992;

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  protected readonly authService = inject(AuthService);
  protected readonly i18n = inject(I18nService);
  private readonly router = inject(Router);

  protected readonly mobileMenuOpen = signal(false);
  protected readonly scrolled = signal(false);
  protected quickSearch = '';

  private readonly toggleBtn = viewChild<ElementRef<HTMLButtonElement>>('toggleBtn');

  toggleMenu(): void {
    this.mobileMenuOpen.update((v) => !v);
  }

  closeMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  onQuickSearch(): void {
    const q = this.quickSearch.trim();
    this.closeMenu();
    this.router.navigate(['/businesses'], { queryParams: q ? { search: q } : {} });
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.mobileMenuOpen()) {
      this.closeMenu();
      this.toggleBtn()?.nativeElement.focus();
    }
  }

  @HostListener('window:scroll')
  protected onScroll(): void {
    this.scrolled.set(window.scrollY > 8);
  }

  @HostListener('window:resize')
  protected onResize(): void {
    if (window.innerWidth >= DESKTOP_BREAKPOINT && this.mobileMenuOpen()) {
      this.closeMenu();
    }
  }
}
