import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardComponent } from '../../components/card.component';
import { ButtonComponent } from '../../components/button.component';
import { IconComponent } from '../../components/icon.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, CardComponent, ButtonComponent, IconComponent],
  template: `
    <div class="space-y-8">
      <!-- Welcome Header -->
      <div class="space-y-2">
        <h1 class="text-4xl font-bold text-text-primary">
          Welcome to Kandy ATS 👋
        </h1>
        <p class="text-text-secondary text-lg">
          Your complete applicant tracking system
        </p>
      </div>

      <div class="flex flex-wrap gap-4">
        <a routerLink="/jobs/create">
          <app-button variant="primary" size="lg">
            <app-icon name="add" size="md"/>
            Create Job Posting
          </app-button>
        </a>
        <a routerLink="/settings/integrations">
          <app-button variant="secondary" size="lg">
            <app-icon name="link" size="md"/>
            Setup Integrations
          </app-button>
        </a>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <app-card>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-text-tertiary text-sm">Active Jobs</p>
              <p class="text-3xl font-bold text-text-primary mt-1">{{ stats().activeJobs }}</p>
              <p class="text-success text-xs mt-1">+2 this week</p>
            </div>
            <div class="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center">
              <app-icon name="work" size="md" class="text-primary-500"/>
            </div>
          </div>
        </app-card>

        <app-card>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-text-tertiary text-sm">Total Applicants</p>
              <p class="text-3xl font-bold text-text-primary mt-1">{{ stats().totalApplicants }}</p>
              <p class="text-success text-xs mt-1">+15 this week</p>
            </div>
            <div class="w-12 h-12 rounded-xl bg-accent-500/10 flex items-center justify-center">
              <app-icon name="group" size="md" class="text-accent-500"/>
            </div>
          </div>
        </app-card>

        <app-card>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-text-tertiary text-sm">New Today</p>
              <p class="text-3xl font-bold text-text-primary mt-1">{{ stats().newToday }}</p>
              <p class="text-text-tertiary text-xs mt-1">Applications</p>
            </div>
            <div class="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
              <app-icon name="trending_up" size="md" class="text-success"/>
            </div>
          </div>
        </app-card>

        <app-card>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-text-tertiary text-sm">In Interview</p>
              <p class="text-3xl font-bold text-text-primary mt-1">{{ stats().inInterview }}</p>
              <p class="text-text-tertiary text-xs mt-1">Candidates</p>
            </div>
            <div class="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
              <app-icon name="people" size="md" class="text-warning"/>
            </div>
          </div>
        </app-card>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2">
          <app-card class="p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-semibold text-text-primary">Recent Job Postings</h2>
              <a routerLink="/jobs">
                <app-button variant="ghost" size="sm">
                  View All
                  <app-icon name="arrow_forward" size="sm"/>
                </app-button>
              </a>
            </div>
            <div class="space-y-4">
              @for (job of recentJobs(); track job.id) {
                <div
                  class="flex items-center justify-between p-4 bg-surface-elevated rounded-xl hover:bg-surface-hover transition-colors">
                  <div class="flex-1">
                    <h3 class="font-semibold text-text-primary">{{ job.title }}</h3>
                    <p class="text-sm text-text-secondary mt-1">{{ job.applicants }} applicants</p>
                  </div>
                  <a [routerLink]="['/jobs', job.id, 'applicants']">
                    <app-button variant="secondary" size="sm">
                      View
                    </app-button>
                  </a>
                </div>
              }
            </div>
          </app-card>
        </div>

        <div>
          <app-card class="p-6">
            <h2 class="text-xl font-semibold text-text-primary mb-6">Quick Links</h2>
            <div class="space-y-3">
              <a
                routerLink="/jobs"
                class="flex items-center gap-3 p-3 bg-surface-elevated hover:bg-surface-hover rounded-xl transition-colors"
              >
                <div class="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center">
                  <app-icon name="work" size="sm" class="text-primary-500"/>
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-text-primary">All Jobs</p>
                  <p class="text-xs text-text-tertiary">Manage postings</p>
                </div>
                <app-icon name="chevron_right" size="sm" class="text-text-tertiary"/>
              </a>

              <a
                routerLink="/settings/integrations"
                class="flex items-center gap-3 p-3 bg-surface-elevated hover:bg-surface-hover rounded-xl transition-colors"
              >
                <div class="w-10 h-10 rounded-lg bg-accent-500/10 flex items-center justify-center">
                  <app-icon name="link" size="sm" class="text-accent-500"/>
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-text-primary">Integrations</p>
                  <p class="text-xs text-text-tertiary">Connect platforms</p>
                </div>
                <app-icon name="chevron_right" size="sm" class="text-text-tertiary"/>
              </a>
            </div>
          </app-card>

          <app-card class="p-6 mt-6">
            <h3 class="text-lg font-semibold text-text-primary mb-4">Integration Status</h3>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 rounded-full bg-success"></div>
                  <span class="text-sm text-text-primary">Internal Portal</span>
                </div>
                <span class="text-xs text-success">Active</span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 rounded-full bg-text-tertiary"></div>
                  <span class="text-sm text-text-primary">LinkedIn</span>
                </div>
                <span class="text-xs text-text-tertiary">Not configured</span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 rounded-full bg-text-tertiary"></div>
                  <span class="text-sm text-text-primary">Indeed</span>
                </div>
                <span class="text-xs text-text-tertiary">Not configured</span>
              </div>
            </div>
            <a routerLink="/settings/integrations" class="mt-4 block">
              <app-button variant="ghost" size="sm" class="w-full">
                Configure Integrations
              </app-button>
            </a>
          </app-card>
        </div>
      </div>
    </div>
  `,
})
export class DashboardComponent {
  public stats = signal({
    activeJobs: 3,
    totalApplicants: 39,
    newToday: 5,
    inInterview: 4,
  });

  public recentJobs = signal([
    { id: 1, title: 'Senior Frontend Developer', applicants: 24 },
    { id: 2, title: 'Product Designer', applicants: 15 },
    { id: 3, title: 'Marketing Manager', applicants: 0 },
  ]);
}
