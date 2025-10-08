import { CommonModule } from '@angular/common';
import {Component, inject, signal} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CardComponent } from '../../components/card.component';
import { ButtonComponent } from '../../components/button.component';
import { IconComponent } from '../../components/icon.component';

interface Applicant {
  id: number;
  name: string;
  email: string;
  phone: string;
  appliedAt: string;
  source: string;
  status: 'new' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';
  resumeUrl?: string;
  coverLetter?: string;
}

interface KanbanColumn {
  id: string;
  title: string;
  status: Applicant['status'];
  color: string;
  applicants: Applicant[];
}

@Component({
  selector: 'app-applicants-kanban',
  standalone: true,
  imports: [CommonModule, RouterLink, CardComponent, ButtonComponent, IconComponent],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center gap-4">
        <a routerLink="/jobs">
          <app-button variant="ghost" size="sm">
            <app-icon name="arrow_back" size="sm" />
          </app-button>
        </a>
        <div class="flex-1">
          <h1 class="text-3xl font-bold text-text-primary">{{ jobTitle() }}</h1>
          <p class="text-text-secondary mt-1">{{ totalApplicants() }} applicants</p>
        </div>
        <app-button variant="secondary" size="md">
          <app-icon name="filter_list" size="sm" />
          Filter
        </app-button>
      </div>

      <!-- Kanban Board -->
      <div class="overflow-x-auto pb-4">
        <div class="flex gap-4 min-w-max">
          @for (column of columns(); track column.id) {
            <div class="w-80 flex-shrink-0">
              <!-- Column Header -->
              <div class="mb-4">
                <div class="flex items-center justify-between p-4 bg-surface rounded-xl border-2 border-border">
                  <div class="flex items-center gap-3">
                    <div
                      class="w-3 h-3 rounded-full"
                      [style.background-color]="column.color"
                    ></div>
                    <h3 class="font-semibold text-text-primary">{{ column.title }}</h3>
                    <span class="px-2 py-1 bg-surface-elevated rounded-full text-xs text-text-secondary">
                      {{ column.applicants.length }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Applicant Cards -->
              <div class="space-y-3 min-h-[200px]">
                @for (applicant of column.applicants; track applicant.id) {
                  <app-card
                    class="p-4 cursor-pointer hover:border-primary-500/50 transition-all hover:shadow-lg"
                    (click)="openApplicantDetails(applicant)"
                  >
                    <div class="space-y-3">
                      <!-- Applicant Info -->
                      <div class="flex items-start justify-between">
                        <div class="flex-1">
                          <h4 class="font-semibold text-text-primary">{{ applicant.name }}</h4>
                          <p class="text-sm text-text-secondary mt-1">{{ applicant.email }}</p>
                        </div>
                        <button
                          class="p-1.5 rounded-lg hover:bg-surface-elevated transition-colors"
                          (click)="$event.stopPropagation(); openMenu(applicant)"
                        >
                          <app-icon name="more_vert" size="sm" class="text-text-tertiary" />
                        </button>
                      </div>

                      <!-- Metadata -->
                      <div class="flex items-center gap-2 text-xs text-text-tertiary">
                        <span class="flex items-center gap-1">
                          <app-icon name="schedule" size="sm" />
                          {{ formatDate(applicant.appliedAt) }}
                        </span>
                        <span class="w-1 h-1 rounded-full bg-text-tertiary"></span>
                        <span class="px-2 py-1 bg-surface-elevated rounded">{{ applicant.source }}</span>
                      </div>

                      <!-- Actions -->
                      <div class="flex gap-2 pt-2 border-t border-border">
                        @if (applicant.resumeUrl) {
                          <button
                            class="flex-1 px-3 py-2 bg-surface-elevated hover:bg-surface-hover rounded-lg text-xs font-medium text-text-primary transition-colors flex items-center justify-center gap-1"
                            (click)="$event.stopPropagation(); viewResume(applicant)"
                          >
                            <app-icon name="description" size="sm" />
                            Resume
                          </button>
                        }
                        <button
                          class="flex-1 px-3 py-2 bg-surface-elevated hover:bg-surface-hover rounded-lg text-xs font-medium text-text-primary transition-colors flex items-center justify-center gap-1"
                          (click)="$event.stopPropagation(); sendEmail(applicant)"
                        >
                          <app-icon name="email" size="sm" />
                          Email
                        </button>
                      </div>
                    </div>
                  </app-card>
                } @empty {
                  <div class="p-8 text-center text-text-tertiary">
                    <app-icon name="inbox" size="md" class="mx-auto mb-2 opacity-50" />
                    <p class="text-sm">No applicants</p>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class ApplicantsKanbanComponent {
  private route = inject(ActivatedRoute);

  jobId = signal<number>(1);
  jobTitle = signal<string>('Senior Frontend Developer');

  columns = signal<KanbanColumn[]>([
    {
      id: 'new',
      title: 'New',
      status: 'new',
      color: '#3b82f6',
      applicants: [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          appliedAt: '2025-10-07T10:30:00',
          source: 'LinkedIn',
          status: 'new',
          resumeUrl: '/resumes/1.pdf',
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '+1234567891',
          appliedAt: '2025-10-07T14:20:00',
          source: 'Indeed',
          status: 'new',
          resumeUrl: '/resumes/2.pdf',
        },
      ],
    },
    {
      id: 'screening',
      title: 'Screening',
      status: 'screening',
      color: '#f59e0b',
      applicants: [
        {
          id: 3,
          name: 'Bob Johnson',
          email: 'bob@example.com',
          phone: '+1234567892',
          appliedAt: '2025-10-06T09:15:00',
          source: 'LinkedIn',
          status: 'screening',
          resumeUrl: '/resumes/3.pdf',
        },
      ],
    },
    {
      id: 'interview',
      title: 'Interview',
      status: 'interview',
      color: '#8b5cf6',
      applicants: [
        {
          id: 4,
          name: 'Alice Williams',
          email: 'alice@example.com',
          phone: '+1234567893',
          appliedAt: '2025-10-05T16:45:00',
          source: 'Internal',
          status: 'interview',
          resumeUrl: '/resumes/4.pdf',
        },
      ],
    },
    {
      id: 'offer',
      title: 'Offer',
      status: 'offer',
      color: '#ec4899',
      applicants: [],
    },
    {
      id: 'hired',
      title: 'Hired',
      status: 'hired',
      color: '#10b981',
      applicants: [],
    },
    {
      id: 'rejected',
      title: 'Rejected',
      status: 'rejected',
      color: '#ef4444',
      applicants: [],
    },
  ]);

  totalApplicants = signal<number>(4);

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  }

  openApplicantDetails(applicant: Applicant): void {
    console.log('Open applicant details', applicant);
    // TODO: Open modal or navigate to applicant detail page
  }

  openMenu(applicant: Applicant): void {
    console.log('Open menu', applicant);
    // TODO: Show context menu for actions
  }

  viewResume(applicant: Applicant): void {
    console.log('View resume', applicant);
    // TODO: Open resume in new tab or modal
  }

  sendEmail(applicant: Applicant): void {
    console.log('Send email', applicant);
    // TODO: Open email compose modal
  }
}

