import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { IconComponent } from '../components/icon.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, IconComponent, RouterLinkActive],
  template: `
    <div class="min-h-screen bg-background">
      <!-- Navigation Bar -->
      <nav class="bg-surface border-b-2 border-border sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <!-- Left Side - Logo & Navigation -->
            <div class="flex items-center gap-8">
              <!-- Logo -->
              <a routerLink="/dashboard" class="flex items-center gap-2">
                <h1 class="text-gradient text-2xl font-bold">Kandy</h1>
              </a>

              <!-- Main Navigation -->
              <div class="hidden md:flex items-center gap-4">
                <a
                  routerLink="/dashboard"
                  routerLinkActive="text-primary-400 bg-surface-elevated"
                  [routerLinkActiveOptions]="{ exact: true }"
                  class="flex items-center gap-2 px-4 py-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors"
                >
                  <app-icon name="dashboard" size="sm" />
                  <span class="font-medium">Dashboard</span>
                </a>
              </div>
            </div>

            <!-- Right Side - User Menu -->
            <div class="flex items-center gap-4">
              <!-- Notifications -->
              <button
                class="p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors"
                aria-label="Notifications"
              >
                <app-icon name="notifications" size="md" />
              </button>

              <!-- User Menu -->
              <div class="flex items-center gap-3 px-3 py-2 rounded-xl bg-surface-elevated">
                <div class="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                  <app-icon name="person" size="sm" class="text-white" />
                </div>
                <div class="hidden sm:block">
                  <p class="text-sm font-medium text-text-primary">{{ currentUser()?.name }}</p>
                  <p class="text-xs text-text-tertiary">{{ currentUser()?.role }}</p>
                </div>
                <button
                  (click)="logout()"
                  class="p-2 rounded-lg text-text-tertiary hover:text-error hover:bg-surface-hover transition-colors"
                  aria-label="Logout"
                >
                  <app-icon name="logout" size="sm" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <router-outlet></router-outlet>
      </main>

      <!-- Footer -->
      <footer class="bg-surface border-t-2 border-border mt-auto">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div class="flex flex-col md:flex-row justify-between items-center gap-4">
            <p class="text-text-tertiary text-sm">
              © 2025 Kandy. All rights reserved.
            </p>
            <div class="flex gap-6">
              <a href="#" class="text-text-tertiary hover:text-text-primary text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" class="text-text-tertiary hover:text-text-primary text-sm transition-colors">
                Terms of Service
              </a>
              <a href="#" class="text-text-tertiary hover:text-text-primary text-sm transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  `,
})
export class MainLayoutComponent {
  private authService = inject(AuthService);

  public currentUser = this.authService.currentUser;

  logout(): void {
    this.authService.logout();
  }
}
