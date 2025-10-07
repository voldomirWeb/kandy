import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ToastService } from '../services/toast.service';
import { IconComponent } from './icon.component';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="fixed flex flex-col top-4 right-4 z-50 gap-y-2 w-96 max-w-[calc(100vw-2rem)] min-h-14">
      @for (toast of toastService.toasts$(); track toast.id) {
        <div
          class='glass-effect rounded-2xl p-2 shadow-xl backdrop-blur-lg w-full flex items-center gap-4'
          [class]="getToastClasses(toast.type)"
        >
          <app-icon
            [name]="getIcon(toast.type)"
            size="lg"
            [class]="getIconColorClass(toast.type)"
          />
          <div class="flex-1 space-y-1 min-w-0">
            <h4 [class]="getTitleClasses(toast.type)">
              {{ toast.title }}
            </h4>
            <p class="text-sm text-text-secondary">
              {{ toast.message }}
            </p>
          </div>
          <button
            (click)="toastService.remove(toast.id)"
            class="flex-shrink-0 text-text-tertiary hover:text-text-primary transition-colors"
            aria-label="Close notification"
          >
            <app-icon name="close" size="sm"/>
          </button>
        </div>
      }
    </div>
  `,
  styles: [
    `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    div[class*="glass-effect"] {
      animation: slideIn 0.3s ease-out;
    }
  `,
  ],
})
export class ToastContainerComponent {
  toastService = inject(ToastService);

  public getToastClasses(type: string): string {
    const typeClasses: Record<string, string> = {
      success: 'border-l-4 border-success',
      error: 'border-l-4 border-error',
      warning: 'border-l-4 border-warning',
      info: 'border-l-4 border-info',
    };

    return `${typeClasses[type] || 'border-l-4 border-info'}`;
  }

  public getTitleClasses(type: string): string {
    const baseClasses = 'font-bold text-base';

    const typeClasses: Record<string, string> = {
      success: 'text-success-light',
      error: 'text-error-light',
      warning: 'text-warning-light',
      info: 'text-info-light',
    };

    return `${baseClasses} ${typeClasses[type] || ''}`;
  }

  public getIconColorClass(type: string): string {
    const typeClasses: Record<string, string> = {
      success: 'text-success-light',
      error: 'text-error-light',
      warning: 'text-warning-light',
      info: 'text-info-light',
    };

    return typeClasses[type] || '';
  }

  public getIcon(type: string): string {
    const icons: Record<string, string> = {
      success: 'check_circle',
      error: 'error',
      warning: 'warning',
      info: 'info',
    };

    return icons[type] || 'info';
  }
}
