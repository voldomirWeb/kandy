import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardComponent } from '../../components/card.component';
import { ButtonComponent } from '../../components/button.component';
import { IconComponent } from '../../components/icon.component';

interface Job {
  id: number;
  title: string;
  department: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  status: 'draft' | 'published' | 'closed';
  applicants: number;
  publishedTo: string[];
  createdAt: string;
}

@Component({
  selector: 'app-jobs-list',
  standalone: true,
  imports: [CommonModule, RouterLink, CardComponent, ButtonComponent, IconComponent],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-3xl font-bold text-text-primary">Jobs</h1>
          <p class="text-text-secondary mt-1">Manage your job postings and track applications</p>
        </div>
        <a routerLink="/jobs/create">
          <app-button variant="primary" size="md">
            <app-icon name="add" size="sm" />
            Create Job
          </app-button>
        </a>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <app-card class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-text-tertiary text-sm">Total Jobs</p>
              <p class="text-3xl font-bold text-text-primary mt-1">{{ stats().total }}</p>
            </div>
            <div class="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center">
              <app-icon name="work" size="md" class="text-primary-500" />
            </div>
          </div>
        </app-card>

        <app-card class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-text-tertiary text-sm">Published</p>
              <p class="text-3xl font-bold text-text-primary mt-1">{{ stats().published }}</p>
            </div>
            <div class="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
              <app-icon name="check_circle" size="md" class="text-success" />
            </div>
          </div>
        </app-card>

        <app-card class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-text-tertiary text-sm">Total Applicants</p>
              <p class="text-3xl font-bold text-text-primary mt-1">{{ stats().applicants }}</p>
            </div>
            <div class="w-12 h-12 rounded-xl bg-accent-500/10 flex items-center justify-center">
              <app-icon name="group" size="md" class="text-accent-500" />
            </div>
          </div>
        </app-card>

        <app-card class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-text-tertiary text-sm">Drafts</p>
              <p class="text-3xl font-bold text-text-primary mt-1">{{ stats().drafts }}</p>
            </div>
            <div class="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
              <app-icon name="draft" size="md" class="text-warning" />
            </div>
          </div>
        </app-card>
      </div>

      <!-- Filters -->
      <app-card class="p-4">
        <div class="flex flex-wrap gap-3">
          <button
            *ngFor="let filter of filters"
            (click)="setActiveFilter(filter.value)"
            [class.bg-primary-500]="activeFilter() === filter.value"
            [class.text-white]="activeFilter() === filter.value"
            [class.bg-surface-elevated]="activeFilter() !== filter.value"
            [class.text-text-secondary]="activeFilter() !== filter.value"
            class="px-4 py-2 rounded-lg font-medium transition-colors hover:bg-primary-600"
          >
            {{ filter.label }}
          </button>
        </div>
      </app-card>

      <!-- Jobs List -->
      <div class="space-y-4">
        @for (job of filteredJobs(); track job.id) {
          <app-card class="p-6 hover:border-primary-500/50 transition-colors">
            <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <!-- Job Info -->
              <div class="flex-1">
                <div class="flex items-start gap-3">
                  <div class="flex-1">
                    <div class="flex items-center gap-3 flex-wrap">
                      <h3 class="text-xl font-semibold text-text-primary">{{ job.title }}</h3>
                      <span
                        [class]="getStatusClass(job.status)"
                        class="px-3 py-1 rounded-full text-xs font-medium"
                      >
                        {{ job.status }}
                      </span>
                    </div>
                    <div class="flex flex-wrap items-center gap-4 mt-2 text-sm text-text-secondary">
                      <span class="flex items-center gap-1">
                        <app-icon name="business" size="sm" />
                        {{ job.department }}
                      </span>
                      <span class="flex items-center gap-1">
                        <app-icon name="location_on" size="sm" />
                        {{ job.location }}
                      </span>
                      <span class="flex items-center gap-1">
                        <app-icon name="schedule" size="sm" />
                        {{ job.type }}
                      </span>
                      <span class="flex items-center gap-1">
                        <app-icon name="group" size="sm" />
                        {{ job.applicants }} applicants
                      </span>
                    </div>
                    @if (job.publishedTo.length > 0) {
                      <div class="flex items-center gap-2 mt-3">
                        <span class="text-xs text-text-tertiary">Published to:</span>
                        <div class="flex gap-2">
                          @for (platform of job.publishedTo; track platform) {
                            <span class="px-2 py-1 bg-surface-elevated rounded text-xs text-text-secondary">
                              {{ platform }}
                            </span>
                          }
                        </div>
                      </div>
                    }
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex items-center gap-2">
                <a [routerLink]="['/jobs', job.id, 'applicants']">
                  <app-button variant="secondary" size="sm">
                    <app-icon name="group" size="sm" />
                    View Applicants
                  </app-button>
                </a>
                <a [routerLink]="['/jobs', job.id, 'edit']">
                  <app-button variant="ghost" size="sm">
                    <app-icon name="edit" size="sm" />
                  </app-button>
                </a>
                <app-button variant="ghost" size="sm" (click)="deleteJob(job.id)">
                  <app-icon name="delete" size="sm" class="text-error" />
                </app-button>
              </div>
            </div>
          </app-card>
        } @empty {
          <app-card class="p-12 text-center">
            <app-icon name="work_outline" size="lg" class="text-text-tertiary mx-auto mb-4" />
            <h3 class="text-xl font-semibold text-text-primary mb-2">No jobs found</h3>
            <p class="text-text-secondary mb-6">Get started by creating your first job posting</p>
            <a routerLink="/jobs/create">
              <app-button variant="primary" size="md">
                <app-icon name="add" size="sm" />
                Create Job
              </app-button>
            </a>
          </app-card>
        }
      </div>
    </div>
  `,
})
export class JobsListComponent {
  jobs = signal<Job[]>([
    {
      id: 1,
      title: 'Senior Frontend Developer',
      department: 'Engineering',
      location: 'Remote',
      type: 'full-time',
      status: 'published',
      applicants: 24,
      publishedTo: ['LinkedIn', 'Indeed'],
      createdAt: '2025-10-01',
    },
    {
      id: 2,
      title: 'Product Designer',
      department: 'Design',
      location: 'New York, NY',
      type: 'full-time',
      status: 'published',
      applicants: 15,
      publishedTo: ['LinkedIn'],
      createdAt: '2025-10-03',
    },
    {
      id: 3,
      title: 'Marketing Manager',
      department: 'Marketing',
      location: 'San Francisco, CA',
      type: 'full-time',
      status: 'draft',
      applicants: 0,
      publishedTo: [],
      createdAt: '2025-10-05',
    },
  ]);

  activeFilter = signal<string>('all');

  filters = [
    { label: 'All Jobs', value: 'all' },
    { label: 'Published', value: 'published' },
    { label: 'Draft', value: 'draft' },
    { label: 'Closed', value: 'closed' },
  ];

  stats = signal({
    total: 3,
    published: 2,
    applicants: 39,
    drafts: 1,
  });

  filteredJobs = signal<Job[]>(this.jobs());

  setActiveFilter(filter: string): void {
    this.activeFilter.set(filter);
    if (filter === 'all') {
      this.filteredJobs.set(this.jobs());
    } else {
      this.filteredJobs.set(this.jobs().filter(job => job.status === filter));
    }
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      published: 'bg-success/10 text-success',
      draft: 'bg-warning/10 text-warning',
      closed: 'bg-error/10 text-error',
    };
    return classes[status] || '';
  }

  deleteJob(id: number): void {
    // TODO: Implement delete confirmation and API call
    console.log('Delete job', id);
  }
}

