import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule],
  host: {
    class: 'flex',
  },
  template: `
    <span
      class="material-symbols-outlined"
      [class]="iconClasses()"
      [attr.aria-hidden]="true"
    >
      {{ name() }}
    </span>
  `,
})
export class IconComponent {
  public name = input.required<string>();
  public size = input<IconSize>('md');
  public filled = input<boolean>(false);

  public iconClasses() {
    const sizeClasses: Record<IconSize, string> = {
      xs: '!text-base', // 16px
      sm: '!text-lg', // 18px
      md: '!text-2xl', // 24px
      lg: '!text-3xl', // 30px
      xl: '!text-4xl', // 36px
      '2xl': '!text-5xl', // 48px
    };

    const filledClass = this.filled() ? 'font-variation-settings-fill-1' : '';

    return `${sizeClasses[this.size()]} ${filledClass}`;
  }
}
