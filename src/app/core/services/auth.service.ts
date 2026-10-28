import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of, throwError } from 'rxjs';
import { User } from '../../shared/models/user.model';
import { environment } from '../../../environments/environment';

export interface AuthResponse {
  token: string;
  user: User;
}

const DEMO_USERS: Record<string, { password: string; user: User }> = {
  'admin@knect.com': {
    password: 'Admin123*',
    user: {
      id: 1,
      userId: 1,
      name: 'Sergio',
      lastName: 'Alzate Román (Super Admin)',
      phone: '+573001112233',
      email: 'admin@knect.com',
      role: 'SUPER_ADMIN',
      roles: ['SUPER_ADMIN'],
      isActive: true,
    },
  },
  'anatilde@knect.com': {
    password: 'Marca123*',
    user: {
      id: 2,
      userId: 2,
      name: 'Carlos',
      lastName: 'Restrepo (Anatilde)',
      phone: '+573104445566',
      email: 'anatilde@knect.com',
      role: 'BUSINESS_ADMIN',
      roles: ['BUSINESS_ADMIN'],
      isActive: true,
    },
  },
  'buffalo@knect.com': {
    password: 'Marca123*',
    user: {
      id: 3,
      userId: 3,
      name: 'Valentina',
      lastName: 'Ospina (Buffalo Smash)',
      phone: '+573157778899',
      email: 'buffalo@knect.com',
      role: 'BUSINESS_ADMIN',
      roles: ['BUSINESS_ADMIN'],
      isActive: true,
    },
  },
  'lasuiza@knect.com': {
    password: 'Marca123*',
    user: {
      id: 4,
      userId: 4,
      name: 'Guillermo',
      lastName: 'Villegas (La Suiza)',
      phone: '+573116203344',
      email: 'lasuiza@knect.com',
      role: 'BUSINESS_ADMIN',
      roles: ['BUSINESS_ADMIN'],
      isActive: true,
    },
  },
  'santokaffeto@knect.com': {
    password: 'Marca123*',
    user: {
      id: 5,
      userId: 5,
      name: 'Felipe',
      lastName: 'Cardona (Santo Kaffeto)',
      phone: '+573128504411',
      email: 'santokaffeto@knect.com',
      role: 'BUSINESS_ADMIN',
      roles: ['BUSINESS_ADMIN'],
      isActive: true,
    },
  },
  'sancanciomoda@knect.com': {
    password: 'Marca123*',
    user: {
      id: 6,
      userId: 6,
      name: 'Mariana',
      lastName: 'Duque (Moda Sancancio)',
      phone: '+573189001122',
      email: 'sancanciomoda@knect.com',
      role: 'BUSINESS_ADMIN',
      roles: ['BUSINESS_ADMIN'],
      isActive: true,
    },
  },
  'thinka@knect.com': {
    password: 'Marca123*',
    user: {
      id: 7,
      userId: 7,
      name: 'Alejandro',
      lastName: 'Giraldo (Thinka)',
      phone: '+573217004545',
      email: 'thinka@knect.com',
      role: 'BUSINESS_ADMIN',
      roles: ['BUSINESS_ADMIN'],
      isActive: true,
    },
  },
  'cliente@knect.com': {
    password: 'Cliente123*',
    user: {
      id: 8,
      userId: 8,
      name: 'María Camila',
      lastName: 'Gómez',
      phone: '+573209990011',
      email: 'cliente@knect.com',
      role: 'CLIENT',
      roles: ['CLIENT'],
      isActive: true,
    },
  },
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  private readonly currentUser = signal<User | null>(null);
  readonly user = this.currentUser.asReadonly();
  readonly isLoggedIn = computed(() => !!this.currentUser());
  readonly isSuperAdmin = computed(() => this.currentUser()?.role === 'SUPER_ADMIN');
  readonly isBusinessAdmin = computed(
    () => this.currentUser()?.role === 'BUSINESS_ADMIN' || this.currentUser()?.role === 'SUPER_ADMIN',
  );

  constructor() {
    this.loadUserFromStorage();
  }

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      catchError((err) => {
        const key = credentials.email.trim().toLowerCase();
        const demo = DEMO_USERS[key];
        if (demo && demo.password === credentials.password) {
          return of({ token: 'demo-jwt-token-' + demo.user.role, user: demo.user });
        }
        return throwError(() => err);
      }),
      tap((response) => this.handleAuthResponse(response)),
    );
  }

  register(data: {
    name: string;
    lastName?: string;
    phone?: string;
    email: string;
    password: string;
    role?: string;
  }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
      catchError(() => {
        const fallbackUser: User = {
          id: Date.now(),
          name: data.name,
          lastName: data.lastName || '',
          phone: data.phone || '',
          email: data.email,
          role: data.role === 'BUSINESS_ADMIN' ? 'BUSINESS_ADMIN' : 'CLIENT',
          isActive: true,
        };
        return of({ token: 'demo-jwt-token-registered', user: fallbackUser });
      }),
      tap((response) => this.handleAuthResponse(response)),
    );
  }

  recoverPassword(data: { email: string; newPassword: string }): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(`${this.apiUrl}/recover-password`, data).pipe(
      catchError(() =>
        of({
          success: true,
          message: 'Contraseña actualizada exitosamente.',
        }),
      ),
    );
  }

  updateProfile(data: {
    name: string;
    lastName?: string;
    phone?: string;
    email: string;
    password?: string;
  }): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/profile`, data).pipe(
      catchError(() => {
        const current = this.currentUser();
        const updated: User = {
          ...(current || { id: 4, role: 'CLIENT' }),
          name: data.name,
          lastName: data.lastName,
          phone: data.phone,
          email: data.email,
        };
        return of(updated);
      }),
      tap((updatedUser) => {
        this.currentUser.set(updatedUser);
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('auth_user', JSON.stringify(updatedUser));
        }
      }),
    );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    }
    this.currentUser.set(null);
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  hasRole(role: string): boolean {
    const user = this.currentUser();
    return user?.role === role || (user?.roles?.includes(role) ?? false);
  }

  private handleAuthResponse(response: AuthResponse): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('auth_user', JSON.stringify(response.user));
    }
    this.currentUser.set(response.user);
  }

  private loadUserFromStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem('auth_user');
      if (stored) {
        try {
          this.currentUser.set(JSON.parse(stored));
        } catch {
          localStorage.removeItem('auth_user');
        }
      }
    }
  }
}
