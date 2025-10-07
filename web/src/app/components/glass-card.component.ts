import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-glass-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="cardClasses()">
      <ng-content></ng-content>
    </div>
  `,
})
export class GlassCardComponent {
  public padding = input<'none' | 'sm' | 'md' | 'lg'>('md');
  public rounded = input<'md' | 'lg' | 'xl' | '2xl' | '3xl'>('2xl');

  public cardClasses() {
    const baseClasses = 'glass-effect shadow-xl';

    const paddingClasses: Record<string, string> = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    const roundedClasses: Record<string, string> = {
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      '2xl': 'rounded-2xl',
      '3xl': 'rounded-3xl',
    };

    return `${baseClasses} ${paddingClasses[this.padding()]} ${roundedClasses[this.rounded()]}`;
  }
}
