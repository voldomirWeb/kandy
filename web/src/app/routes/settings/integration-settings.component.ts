import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardComponent } from '../../components/card.component';
import { ButtonComponent } from '../../components/button.component';
import { IconComponent } from '../../components/icon.component';
import { ToastService } from '../../services/toast.service';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  configured: boolean;
  enabled: boolean;
  fields: IntegrationField[];
}

interface IntegrationField {
  name: string;
  label: string;
  type: 'text' | 'password' | 'url';
  placeholder: string;
  required: boolean;
}

@Component({
  selector: 'app-integration-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardComponent,
    ButtonComponent,
    IconComponent,
  ],
  template: `
    <div class="max-w-5xl mx-auto space-y-6">
      <!-- Header -->
      <div>
        <h1 class="text-3xl font-bold text-text-primary">Integration Settings</h1>
        <p class="text-text-secondary mt-1">
          Connect your job board accounts to automatically post jobs across multiple platforms
        </p>
      </div>

      <!-- Info Banner -->
      <app-card class="p-4 bg-primary-500/5 border-primary-500/20">
        <div class="flex gap-3">
          <app-icon name="info" size="sm" class="text-primary-500 mt-0.5 flex-shrink-0" />
          <div>
            <p class="text-sm text-text-primary">
              <span class="font-medium">How it works:</span> Configure your credentials for each platform below.
              Once configured, you can select which platforms to publish to when creating a new job posting.
            </p>
          </div>
        </div>
      </app-card>

      <!-- Integrations -->
      <div class="space-y-4">
        @for (integration of integrations(); track integration.id) {
          <app-card class="overflow-hidden">
            <!-- Integration Header -->
            <div
              class="p-6 cursor-pointer hover:bg-surface-hover transition-colors"
              (click)="toggleIntegration(integration.id)"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 rounded-xl bg-surface-elevated flex items-center justify-center">
                    <app-icon [name]="integration.icon" size="md" class="text-primary-500" />
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-text-primary flex items-center gap-2">
                      {{ integration.name }}
                      @if (integration.configured) {
                        <span class="px-2 py-1 bg-success/10 text-success text-xs rounded-full">
                          Configured
                        </span>
                      }
                    </h3>
                    <p class="text-sm text-text-secondary mt-1">{{ integration.description }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  @if (integration.configured) {
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        [checked]="integration.enabled"
                        (change)="toggleEnabled(integration.id)"
                        (click)="$event.stopPropagation()"
                        class="sr-only peer"
                      />
                      <div class="w-11 h-6 bg-surface-elevated peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                    </label>
                  }
                  <app-icon
                    [name]="expandedIntegration() === integration.id ? 'expand_less' : 'expand_more'"
                    size="md"
                    class="text-text-tertiary"
                  />
                </div>
              </div>
            </div>

            <!-- Integration Form (Expanded) -->
            @if (expandedIntegration() === integration.id) {
              <div class="px-6 pb-6 pt-2 border-t-2 border-border">
                <form [formGroup]="getIntegrationForm(integration.id)" (ngSubmit)="saveIntegration(integration.id)">
                  <div class="space-y-4 mb-6">
                    @for (field of integration.fields; track field.name) {
                      <div>
                        <label class="block text-sm font-medium text-text-primary mb-2">
                          {{ field.label }}
                          @if (field.required) {
                            <span class="text-error">*</span>
                          }
                        </label>
                        <input
                          [type]="field.type"
                          [formControlName]="field.name"
                          [placeholder]="field.placeholder"
                          class="w-full px-4 py-3 bg-surface border-2 border-border rounded-xl text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-primary-500 transition-colors"
                        />
                      </div>
                    }
                  </div>

                  <div class="flex justify-between items-center">
                    <div class="text-sm text-text-tertiary">
                      <app-icon name="security" size="sm" class="inline mr-1" />
                      Your credentials are encrypted and stored securely
                    </div>
                    <div class="flex gap-3">
                      @if (integration.configured) {
                        <app-button variant="ghost" size="md" type="button" (click)="testConnection(integration.id)">
                          <app-icon name="sync" size="sm" />
                          Test Connection
                        </app-button>
                      }
                      <app-button variant="primary" size="md" type="submit">
                        <app-icon name="save" size="sm" />
                        Save Configuration
                      </app-button>
                    </div>
                  </div>
                </form>
              </div>
            }
          </app-card>
        }
      </div>

      <!-- Documentation -->
      <app-card class="p-6">
        <h3 class="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
          <app-icon name="help" size="sm" />
          Need Help?
        </h3>
        <p class="text-text-secondary mb-4">
          Check out our documentation for step-by-step guides on setting up each integration:
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <a
            href="#"
            class="flex items-center gap-2 px-4 py-3 bg-surface-elevated hover:bg-surface-hover rounded-xl transition-colors text-text-primary"
          >
            <app-icon name="description" size="sm" />
            <span class="text-sm font-medium">LinkedIn Integration Guide</span>
          </a>
          <a
            href="#"
            class="flex items-center gap-2 px-4 py-3 bg-surface-elevated hover:bg-surface-hover rounded-xl transition-colors text-text-primary"
          >
            <app-icon name="description" size="sm" />
            <span class="text-sm font-medium">Indeed Integration Guide</span>
          </a>
        </div>
      </app-card>
    </div>
  `,
})
export class IntegrationSettingsComponent {
  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);

  expandedIntegration = signal<string | null>(null);

  integrations = signal<Integration[]>([
    {
      id: 'linkedin',
      name: 'LinkedIn',
      description: 'Post jobs directly to LinkedIn Jobs and reach millions of professionals',
      icon: 'work',
      configured: false,
      enabled: false,
      fields: [
        {
          name: 'clientId',
          label: 'Client ID',
          type: 'text',
          placeholder: 'Enter your LinkedIn Client ID',
          required: true,
        },
        {
          name: 'clientSecret',
          label: 'Client Secret',
          type: 'password',
          placeholder: 'Enter your LinkedIn Client Secret',
          required: true,
        },
        {
          name: 'companyId',
          label: 'Company ID',
          type: 'text',
          placeholder: 'Your LinkedIn Company ID',
          required: true,
        },
      ],
    },
    {
      id: 'indeed',
      name: 'Indeed',
      description: 'Reach more candidates by posting to Indeed, the #1 job site worldwide',
      icon: 'search',
      configured: false,
      enabled: false,
      fields: [
        {
          name: 'apiKey',
          label: 'API Key',
          type: 'password',
          placeholder: 'Enter your Indeed API Key',
          required: true,
        },
        {
          name: 'employerId',
          label: 'Employer ID',
          type: 'text',
          placeholder: 'Your Indeed Employer ID',
          required: true,
        },
      ],
    },
    {
      id: 'glassdoor',
      name: 'Glassdoor',
      description: 'Post jobs to Glassdoor and leverage company reviews to attract talent',
      icon: 'business',
      configured: false,
      enabled: false,
      fields: [
        {
          name: 'partnerId',
          label: 'Partner ID',
          type: 'text',
          placeholder: 'Enter your Glassdoor Partner ID',
          required: true,
        },
        {
          name: 'apiKey',
          label: 'API Key',
          type: 'password',
          placeholder: 'Enter your Glassdoor API Key',
          required: true,
        },
      ],
    },
  ]);

  integrationForms = new Map<string, FormGroup>();

  constructor() {
    // Initialize forms for each integration
    this.integrations().forEach(integration => {
      const formGroup: any = {};
      integration.fields.forEach(field => {
        formGroup[field.name] = ['', field.required ? [Validators.required] : []];
      });
      this.integrationForms.set(integration.id, this.fb.group(formGroup));
    });
  }

  toggleIntegration(id: string): void {
    this.expandedIntegration.set(this.expandedIntegration() === id ? null : id);
  }

  toggleEnabled(id: string): void {
    const integrations = this.integrations();
    const integration = integrations.find(i => i.id === id);
    if (integration && integration.configured) {
      integration.enabled = !integration.enabled;
      this.integrations.set([...integrations]);
      this.toastService.show(
        integration.enabled ? 'success' : 'info',
        `${integration.name}`,
        integration.enabled ? 'Integration enabled successfully' : 'Integration disabled'
      );
    }
  }

  getIntegrationForm(id: string): FormGroup {
    return this.integrationForms.get(id) || this.fb.group({});
  }

  saveIntegration(id: string): void {
    const form = this.integrationForms.get(id);
    if (form?.valid) {
      // TODO: Implement API call to save credentials
      const integrations = this.integrations();
      const integration = integrations.find(i => i.id === id);
      if (integration) {
        integration.configured = true;
        integration.enabled = true;
        this.integrations.set([...integrations]);
        this.toastService.show('success', `${integration.name}`, 'Configuration saved successfully');
        this.expandedIntegration.set(null);
      }
    }
  }

  testConnection(id: string): void {
    const integration = this.integrations().find(i => i.id === id);
    // TODO: Implement API call to test connection
    this.toastService.show('info', `${integration?.name}`, 'Testing connection...');
    setTimeout(() => {
      this.toastService.show('success', `${integration?.name}`, 'Connection successful!');
    }, 1500);
  }
}
