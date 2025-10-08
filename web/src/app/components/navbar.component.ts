import { CommonModule } from '@angular/common';
import { Component, input, output, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IconComponent } from './icon.component';

export interface User {
  name: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, IconComponent],
  template: `
    <nav class="bg-surface border-b-2 border-border sticky top-0 z-50">
      <div class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center gap-8">
            <a routerLink="/dashboard" class="flex items-center gap-2">
              <h1 class="text-gradient text-2xl font-bold">Kandy</h1>
            </a>

            <!-- Desktop Navigation -->
            <div class="hidden lg:flex items-center gap-4">
              <a
                routerLink="/dashboard"
                routerLinkActive="text-primary-400 bg-surface-elevated"
                [routerLinkActiveOptions]="{ exact: true }"
                class="flex items-center gap-2 px-4 py-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors"
              >
                <app-icon name="dashboard" size="sm"/>
                <span class="font-medium">Dashboard</span>
              </a>
              <a
                routerLink="/jobs"
                routerLinkActive="text-primary-400 bg-surface-elevated"
                class="flex items-center gap-2 px-4 py-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors"
              >
                <app-icon name="work" size="sm"/>
                <span class="font-medium">Jobs</span>
              </a>
              <a
                routerLink="/settings/integrations"
                routerLinkActive="text-primary-400 bg-surface-elevated"
                class="flex items-center gap-2 px-4 py-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors"
              >
                <app-icon name="settings" size="sm"/>
                <span class="font-medium">Settings</span>
              </a>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <button
              class="p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <app-icon name="notifications" size="md"/>
            </button>

            <div class="hidden lg:flex items-center gap-3 px-3 py-2 rounded-xl bg-surface-elevated">
              <div
                class="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <app-icon name="person" size="sm" class="text-white"/>
              </div>
              <div class="hidden sm:block">
                <p class="text-sm font-medium text-text-primary">{{ currentUser()?.name }}</p>
                <p class="text-xs text-text-tertiary">{{ currentUser()?.role }}</p>
              </div>
              <button
                title='Logout'
                (click)="onLogout.emit()"
                class="p-2 rounded-lg text-text-tertiary hover:text-error hover:bg-surface-hover transition-colors cursor-pointer"
                aria-label="Logout"
              >
                <app-icon name="logout" size="md"/>
              </button>
            </div>

            <button
              (click)="toggleMenu()"
              class="lg:hidden p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              <app-icon [name]="mobileMenuOpen() ? 'close' : 'menu'" size="md"/>
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Mobile Menu Overlay -->
    @if (mobileMenuOpen()) {
      <div
        class="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        (click)="closeMenu()"
      ></div>
    }

    <!-- Mobile Menu Drawer -->
    <div
      class="lg:hidden fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-surface border-l-2 border-border z-50 transform transition-transform duration-300 ease-in-out"
      [class.translate-x-0]="mobileMenuOpen()"
      [class.translate-x-full]="!mobileMenuOpen()"
    >
      <div class="flex flex-col h-full">
        <!-- Mobile Menu Header -->
        <div class="flex items-center justify-between p-4 border-b-2 border-border">
          <h2 class="text-lg font-semibold text-text-primary">Menu</h2>
          <button
            (click)="closeMenu()"
            class="p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <app-icon name="close" size="md"/>
          </button>
        </div>

        <!-- User Info -->
        <div class="p-4 border-b-2 border-border">
          <div class="flex items-center gap-3">
            <div
              class="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <app-icon name="person" size="md" class="text-white"/>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-text-primary truncate">{{ currentUser()?.name }}</p>
              <p class="text-xs text-text-tertiary truncate">{{ currentUser()?.email }}</p>
              <p class="text-xs text-text-tertiary capitalize">{{ currentUser()?.role }}</p>
            </div>
          </div>
        </div>

        <!-- Mobile Navigation Links -->
        <nav class="flex-1 overflow-y-auto p-4">
          <div class="space-y-2">
            <a
              routerLink="/dashboard"
              routerLinkActive="text-primary-400 bg-surface-elevated"
              [routerLinkActiveOptions]="{ exact: true }"
              (click)="closeMenu()"
              class="flex items-center gap-3 px-4 py-3 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors"
            >
              <app-icon name="dashboard" size="md"/>
              <span class="font-medium">Dashboard</span>
            </a>
            <a
              routerLink="/jobs"
              routerLinkActive="text-primary-400 bg-surface-elevated"
              (click)="closeMenu()"
              class="flex items-center gap-3 px-4 py-3 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors"
            >
              <app-icon name="work" size="md"/>
              <span class="font-medium">Jobs</span>
            </a>
            <a
              routerLink="/settings/integrations"
              routerLinkActive="text-primary-400 bg-surface-elevated"
              (click)="closeMenu()"
              class="flex items-center gap-3 px-4 py-3 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors"
            >
              <app-icon name="settings" size="md"/>
              <span class="font-medium">Settings</span>
            </a>
          </div>
        </nav>

        <!-- Mobile Menu Footer -->
        <div class="p-4 border-t-2 border-border">
          <button
            (click)="handleMobileLogout()"
            class="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-error/10 text-error hover:bg-error/20 transition-colors cursor-pointer"
          >
            <app-icon name="logout" size="md"/>
            <span class="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>
  `,
})
export class NavbarComponent {
  public currentUser = input<User | null>(null);
  public onLogout = output<void>();

  public mobileMenuOpen = signal(false);

  public toggleMenu(): void {
    this.mobileMenuOpen.update(value => !value);
  }

  public closeMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  public handleMobileLogout(): void {
    this.closeMenu();
    this.onLogout.emit();
  }
}
