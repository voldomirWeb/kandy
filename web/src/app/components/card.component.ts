import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="cardClasses()">
      <ng-content></ng-content>
    </div>
  `,
})
export class CardComponent {
  public clickable = input<boolean>(false);
  public padding = input<'none' | 'sm' | 'md' | 'lg'>('md');

  public cardClasses() {
    const baseClasses = 'bg-surface border-2 border-border rounded-2xl shadow-md';
    const hoverClasses = this.clickable() ? 'card-hover cursor-pointer' : '';

    const paddingClasses: Record<string, string> = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    return `${baseClasses} ${hoverClasses} ${paddingClasses[this.padding()]}`;
  }
}
