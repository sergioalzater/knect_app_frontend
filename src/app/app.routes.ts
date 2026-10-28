import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard, businessAdminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login/login.component').then((m) => m.LoginComponent),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/auth/register/register.component').then((m) => m.RegisterComponent),
      },
    ],
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: 'brand-admin',
    canActivate: [businessAdminGuard],
    loadComponent: () =>
      import('./features/brand-admin/brand-admin.component').then((m) => m.BrandAdminComponent),
  },
  {
    path: 'super-admin',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./features/super-admin/super-admin.component').then((m) => m.SuperAdminComponent),
  },
  {
    path: 'businesses',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/businesses/business-list/business-list.component').then(
            (m) => m.BusinessListComponent,
          ),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./features/businesses/business-detail/business-detail.component').then(
            (m) => m.BusinessDetailComponent,
          ),
      },
    ],
  },
  {
    path: 'blog',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/blog/blog.component').then((m) => m.BlogComponent),
      },
      {
        path: ':slug',
        loadComponent: () =>
          import('./features/blog/blog.component').then((m) => m.BlogComponent),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
