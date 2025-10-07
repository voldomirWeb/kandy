import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { IconComponent } from './icon.component';

export type StatusType = 'success' | 'error' | 'warning' | 'info';

@Component({
  selector: 'app-status-message',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div [class]="messageClasses()" role="alert">
      <div class="flex items-start gap-3">
        <div class="flex-shrink-0 mt-0.5">
          <app-icon
            [name]="getIcon()"
            size="lg"
            [class]="iconColorClass()"
          />
        </div>
        <div class="flex-1 space-y-1">
          <h3 [class]="titleClasses()">{{ title() }}</h3>
          <p class="text-text-secondary">{{ message() }}</p>
        </div>
      </div>
    </div>
  `,
})
export class StatusMessageComponent {
  public type = input.required<StatusType>();
  public title = input.required<string>();
  public message = input.required<string>();

  public messageClasses() {
    const baseClasses = 'bg-surface-elevated rounded-2xl p-6 shadow-md border-l-4';

    const typeClasses = {
      success: 'border-success',
      error: 'border-error',
      warning: 'border-warning',
      info: 'border-info',
    };

    return `${baseClasses} ${typeClasses[this.type()]}`;
  }

  public titleClasses() {
    const baseClasses = 'font-bold text-lg';

    const typeClasses = {
      success: 'text-success-light',
      error: 'text-error-light',
      warning: 'text-warning-light',
      info: 'text-info-light',
    };

    return `${baseClasses} ${typeClasses[this.type()]}`;
  }

  public iconColorClass() {
    const typeClasses = {
      success: 'text-success-light',
      error: 'text-error-light',
      warning: 'text-warning-light',
      info: 'text-info-light',
    };

    return typeClasses[this.type()];
  }

  public getIcon(): string {
    const icons = {
      success: 'check_circle',
      error: 'error',
      warning: 'warning',
      info: 'info',
    };

    return icons[this.type()];
  }
}
