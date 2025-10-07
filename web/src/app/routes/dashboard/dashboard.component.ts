import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { CardComponent } from '../../components/card.component';
import { GlassCardComponent } from '../../components/glass-card.component';
import { IconComponent } from '../../components/icon.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    GlassCardComponent,
    IconComponent,
    GlassCardComponent,
    IconComponent,
    CardComponent,
  ],
  template: `
    <div class="space-y-8">
      <!-- Welcome Header -->
      <div class="space-y-2">
        <h1 class="text-4xl font-bold text-text-primary">
          Welcome back, {{ currentUser()?.name }}! 👋
        </h1>
        <p class="text-text-secondary text-lg">
          Here's what's happening with your account today.
        </p>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <app-glass-card padding="lg" rounded="2xl">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
              <app-icon name="person" size="lg" class="text-white" />
            </div>
            <div>
              <p class="text-text-tertiary text-sm">Profile</p>
              <p class="text-text-primary text-2xl font-bold">Active</p>
            </div>
          </div>
        </app-glass-card>

        <app-glass-card padding="lg" rounded="2xl">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center">
              <app-icon name="security" size="lg" class="text-white" />
            </div>
            <div>
              <p class="text-text-tertiary text-sm">Role</p>
              <p class="text-text-primary text-2xl font-bold capitalize">{{ currentUser()?.role }}</p>
            </div>
          </div>
        </app-glass-card>

        <app-glass-card padding="lg" rounded="2xl">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-success to-success-dark flex items-center justify-center">
              <app-icon name="check_circle" size="lg" class="text-white" />
            </div>
            <div>
              <p class="text-text-tertiary text-sm">Status</p>
              <p class="text-text-primary text-2xl font-bold">Verified</p>
            </div>
          </div>
        </app-glass-card>

        <app-glass-card padding="lg" rounded="2xl">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-info to-info-dark flex items-center justify-center">
              <app-icon name="schedule" size="lg" class="text-white" />
            </div>
            <div>
              <p class="text-text-tertiary text-sm">Last Login</p>
              <p class="text-text-primary text-sm font-semibold">{{ formatDate(currentUser()?.last_login_at) }}</p>
            </div>
          </div>
        </app-glass-card>
      </div>

      <!-- Quick Actions -->
      <div class="space-y-4">
        <h2 class="text-2xl font-bold text-text-primary">Quick Actions</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <app-card [clickable]="true" padding="lg">
            <div class="flex flex-col items-center text-center gap-4">
              <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                <app-icon name="settings" size="xl" class="text-white" />
              </div>
              <div>
                <h3 class="text-xl font-semibold text-text-primary mb-2">Account Settings</h3>
                <p class="text-text-secondary text-sm">Manage your account preferences and security settings</p>
              </div>
            </div>
          </app-card>

          <app-card [clickable]="true" padding="lg">
            <div class="flex flex-col items-center text-center gap-4">
              <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center">
                <app-icon name="lock" size="xl" class="text-white" />
              </div>
              <div>
                <h3 class="text-xl font-semibold text-text-primary mb-2">Security</h3>
                <p class="text-text-secondary text-sm">Update your password and manage active sessions</p>
              </div>
            </div>
          </app-card>

          <app-card [clickable]="true" padding="lg">
            <div class="flex flex-col items-center text-center gap-4">
              <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-success to-success-dark flex items-center justify-center">
                <app-icon name="help" size="xl" class="text-white" />
              </div>
              <div>
                <h3 class="text-xl font-semibold text-text-primary mb-2">Help & Support</h3>
                <p class="text-text-secondary text-sm">Get help and access documentation</p>
              </div>
            </div>
          </app-card>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="space-y-4">
        <h2 class="text-2xl font-bold text-text-primary">Recent Activity</h2>
        <app-card padding="lg">
          <div class="space-y-4">
            <div class="flex items-center gap-4 p-4 rounded-xl bg-surface-elevated">
              <app-icon name="login" size="md" class="text-primary-400" />
              <div class="flex-1">
                <p class="text-text-primary font-medium">Successful Login</p>
                <p class="text-text-tertiary text-sm">{{ currentUser()?.email }}</p>
              </div>
              <span class="text-text-tertiary text-sm">Just now</span>
            </div>

            <div class="flex items-center gap-4 p-4 rounded-xl bg-surface-elevated">
              <app-icon name="verified_user" size="md" class="text-success-light" />
              <div class="flex-1">
                <p class="text-text-primary font-medium">Account Verified</p>
                <p class="text-text-tertiary text-sm">Your account is active and verified</p>
              </div>
              <span class="text-text-tertiary text-sm">Today</span>
            </div>
          </div>
        </app-card>
      </div>
    </div>
  `,
})
export class DashboardComponent {
  private authService = inject(AuthService);

  public currentUser = this.authService.currentUser;

  public formatDate(dateString?: string): string {
    if (!dateString) return 'N/A';

    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins} min ago`;
      if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`;

      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return 'N/A';
    }
  }
}
