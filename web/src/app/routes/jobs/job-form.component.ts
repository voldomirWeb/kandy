import { CommonModule } from '@angular/common';
import {Component, inject, signal} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CardComponent } from '../../components/card.component';
import { ButtonComponent } from '../../components/button.component';
import { IconComponent } from '../../components/icon.component';

@Component({
  selector: 'app-job-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    CardComponent,
    ButtonComponent,
    IconComponent,
  ],
  template: `
    <div class="max-w-4xl mx-auto space-y-6">
      <!-- Header -->
      <div class="flex items-center gap-4">
        <a routerLink="/jobs">
          <app-button variant="ghost" size="sm">
            <app-icon name="arrow_back" size="sm" />
          </app-button>
        </a>
        <div>
          <h1 class="text-3xl font-bold text-text-primary">Create Job</h1>
          <p class="text-text-secondary mt-1">Fill in the details to create a new job posting</p>
        </div>
      </div>

      <form [formGroup]="jobForm" (ngSubmit)="onSubmit()">
        <!-- Basic Information -->
        <app-card class="p-6 mb-6">
          <h2 class="text-xl font-semibold text-text-primary mb-4 flex items-center gap-2">
            <app-icon name="info" size="sm" />
            Basic Information
          </h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-text-primary mb-2">
                Job Title <span class="text-error">*</span>
              </label>
              <input
                type="text"
                formControlName="title"
                placeholder="e.g. Senior Frontend Developer"
                class="w-full px-4 py-3 bg-surface border-2 border-border rounded-xl text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-primary-500 transition-colors"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">
                  Department <span class="text-error">*</span>
                </label>
                <input
                  type="text"
                  formControlName="department"
                  placeholder="e.g. Engineering"
                  class="w-full px-4 py-3 bg-surface border-2 border-border rounded-xl text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-primary-500 transition-colors"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">
                  Location <span class="text-error">*</span>
                </label>
                <input
                  type="text"
                  formControlName="location"
                  placeholder="e.g. Remote, New York, NY"
                  class="w-full px-4 py-3 bg-surface border-2 border-border rounded-xl text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-primary-500 transition-colors"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">
                  Employment Type <span class="text-error">*</span>
                </label>
                <select
                  formControlName="type"
                  class="w-full px-4 py-3 bg-surface border-2 border-border rounded-xl text-text-primary focus:outline-none focus:border-primary-500 transition-colors"
                >
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">
                  Salary Range
                </label>
                <input
                  type="text"
                  formControlName="salary"
                  placeholder="e.g. $80,000 - $120,000"
                  class="w-full px-4 py-3 bg-surface border-2 border-border rounded-xl text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-primary-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-text-primary mb-2">
                Job Description <span class="text-error">*</span>
              </label>
              <textarea
                formControlName="description"
                rows="6"
                placeholder="Describe the role, responsibilities, and what you're looking for..."
                class="w-full px-4 py-3 bg-surface border-2 border-border rounded-xl text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-primary-500 transition-colors resize-none"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-text-primary mb-2">
                Requirements <span class="text-error">*</span>
              </label>
              <textarea
                formControlName="requirements"
                rows="6"
                placeholder="List the required skills, experience, and qualifications..."
                class="w-full px-4 py-3 bg-surface border-2 border-border rounded-xl text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-primary-500 transition-colors resize-none"
              ></textarea>
            </div>
          </div>
        </app-card>

        <!-- Publishing Options -->
        <app-card class="p-6 mb-6">
          <h2 class="text-xl font-semibold text-text-primary mb-4 flex items-center gap-2">
            <app-icon name="public" size="sm" />
            Publishing Options
          </h2>
          <div class="space-y-4">
            <p class="text-text-secondary text-sm">Select the platforms where you want to publish this job</p>

            <div class="space-y-3">
              @for (platform of platforms; track platform.id) {
                <label class="flex items-center gap-3 p-4 bg-surface-elevated rounded-xl cursor-pointer hover:bg-surface-hover transition-colors">
                  <input
                    type="checkbox"
                    [checked]="selectedPlatforms().includes(platform.id)"
                    (change)="togglePlatform(platform.id)"
                    class="w-5 h-5 rounded border-2 border-border text-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-background"
                  />
                  <div class="flex-1">
                    <div class="flex items-center gap-2">
                      <span class="font-medium text-text-primary">{{ platform.name }}</span>
                      @if (!platform.configured) {
                        <span class="px-2 py-1 bg-warning/10 text-warning text-xs rounded">Not configured</span>
                      }
                    </div>
                    <p class="text-sm text-text-tertiary">{{ platform.description }}</p>
                  </div>
                </label>
              }
            </div>

            <div class="p-4 bg-primary-500/10 border-2 border-primary-500/20 rounded-xl">
              <div class="flex gap-3">
                <app-icon name="info" size="sm" class="text-primary-500 mt-0.5" />
                <div>
                  <p class="text-sm text-text-primary">
                    <span class="font-medium">Note:</span> You need to configure your platform credentials in the
                    <a routerLink="/settings/integrations" class="text-primary-500 hover:underline">Integration Settings</a>
                    before you can publish to external platforms.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </app-card>

        <!-- Actions -->
        <div class="flex justify-end gap-3">
          <a routerLink="/jobs">
            <app-button variant="ghost" size="md" type="button">
              Cancel
            </app-button>
          </a>
          <app-button variant="secondary" size="md" type="button" (click)="saveDraft()">
            <app-icon name="save" size="sm" />
            Save as Draft
          </app-button>
          <app-button variant="primary" size="md" type="submit" [disabled]="!jobForm.valid">
            <app-icon name="publish" size="sm" />
            Publish Job
          </app-button>
        </div>
      </form>
    </div>
  `,
})
export class JobFormComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  selectedPlatforms = signal<string[]>([]);

  platforms = [
    {
      id: 'internal',
      name: 'Internal Portal',
      description: 'Always available on your careers page',
      configured: true,
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      description: 'Post to LinkedIn Jobs',
      configured: false,
    },
    {
      id: 'indeed',
      name: 'Indeed',
      description: 'Post to Indeed',
      configured: false,
    },
    {
      id: 'glassdoor',
      name: 'Glassdoor',
      description: 'Post to Glassdoor',
      configured: false,
    },
  ];

  jobForm: FormGroup = this.fb.group({
    title: ['', [Validators.required]],
    department: ['', [Validators.required]],
    location: ['', [Validators.required]],
    type: ['full-time', [Validators.required]],
    salary: [''],
    description: ['', [Validators.required]],
    requirements: ['', [Validators.required]],
  });

  togglePlatform(platformId: string): void {
    const current = this.selectedPlatforms();
    if (current.includes(platformId)) {
      this.selectedPlatforms.set(current.filter(id => id !== platformId));
    } else {
      this.selectedPlatforms.set([...current, platformId]);
    }
  }

  saveDraft(): void {
    // TODO: Implement save as draft
    console.log('Save draft', this.jobForm.value, this.selectedPlatforms());
    this.router.navigate(['/jobs']);
  }

  onSubmit(): void {
    if (this.jobForm.valid) {
      // TODO: Implement job creation with API
      console.log('Create job', this.jobForm.value, this.selectedPlatforms());
      this.router.navigate(['/jobs']);
    }
  }
}
