import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

export type ButtonVariant = 'primary' | 'accent' | 'secondary' | 'ghost' | 'success' | 'error';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      class='font-medium rounded-xl transition-all duration-normal focus-visible:ring-4 focus-visible:outline-none cursor-pointer'
      [type]="type()"
      [disabled]="disabled()"
      [class]="buttonClasses()"
      (click)="handleClick($event)"
    >
      <ng-content></ng-content>
    </button>
  `,
})
export class ButtonComponent {
  public variant = input<ButtonVariant>('primary');
  public size = input<ButtonSize>('md');
  public type = input<'button' | 'submit' | 'reset'>('button');
  public disabled = input<boolean>(false);
  public fullWidth = input<boolean>(false);

  public clicked = output<MouseEvent>();

  public handleClick(event: MouseEvent) {
    if (!this.disabled()) {
      this.clicked.emit(event);
    }
  }

  public buttonClasses() {
    const sizeClasses: Record<ButtonSize, string> = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    };

    const variantClasses: Record<ButtonVariant, string> = {
      primary:
        'bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-text-primary shadow-md hover:shadow-lg hover:-translate-y-0.5 focus-visible:ring-primary-500/50',
      accent:
        'bg-accent-600 hover:bg-accent-700 active:bg-accent-800 text-text-primary shadow-md hover:shadow-lg hover:-translate-y-0.5 focus-visible:ring-accent-500/50',
      secondary:
        'bg-surface-elevated hover:bg-surface-hover text-text-primary border-2 border-border hover:border-border-hover hover:-translate-y-0.5 focus-visible:ring-border-hover/50',
      ghost:
        'text-primary-400 hover:text-primary-300 hover:bg-surface-elevated focus-visible:ring-primary-500/50',
      success:
        'bg-success hover:bg-success-dark active:bg-green-800 text-text-primary shadow-md hover:shadow-lg hover:-translate-y-0.5 focus-visible:ring-success/50',
      error:
        'bg-error hover:bg-error-dark active:bg-red-700 text-text-primary shadow-md hover:shadow-lg hover:-translate-y-0.5 focus-visible:ring-error/50',
    };

    const disabledClasses =
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none';
    const widthClasses = this.fullWidth() ? 'w-full' : '';

    return `${sizeClasses[this.size()]} ${variantClasses[this.variant()]} ${disabledClasses} ${widthClasses}`;
  }
}
