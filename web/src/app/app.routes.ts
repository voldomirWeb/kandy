import type { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadComponent: () =>
      import('./routes/auth/auth-layout.component').then((m) => m.AuthLayoutComponent),
    children: [
      {
        path: 'login',
        loadComponent: () => import('./routes/auth/login.component').then((m) => m.LoginComponent),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./routes/auth/register.component').then((m) => m.RegisterComponent),
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    loadComponent: () =>
      import('./routes/main-layout.component').then((m) => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./routes/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'jobs',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./routes/jobs/jobs-list.component').then((m) => m.JobsListComponent),
          },
          {
            path: 'create',
            loadComponent: () =>
              import('./routes/jobs/job-form.component').then((m) => m.JobFormComponent),
          },
          {
            path: ':id/edit',
            loadComponent: () =>
              import('./routes/jobs/job-form.component').then((m) => m.JobFormComponent),
          },
          {
            path: ':id/applicants',
            loadComponent: () =>
              import('./routes/jobs/applicants-kanban.component').then((m) => m.ApplicantsKanbanComponent),
          },
        ],
      },
      {
        path: 'settings',
        children: [
          {
            path: 'integrations',
            loadComponent: () =>
              import('./routes/settings/integration-settings.component').then((m) => m.IntegrationSettingsComponent),
          },
        ],
      },
    ],
  },
];
