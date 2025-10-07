import { CommonModule } from '@angular/common';
import { Component, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconComponent } from './icon.component';

export interface InputError {
  message: string;
}

@Component({
  selector: 'app-password-input',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div class="space-y-2">
      @if (label()) {
        <label [for]="id()" class="block text-sm font-medium text-text-primary">
          {{ label() }}
          @if (required()) {
            <span class="text-error ml-1">*</span>
          }
        </label>
      }

      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <app-icon name="lock" size="sm" class="text-text-tertiary"/>
        </div>

        <input
          [id]="id()"
          [type]="showPassword() ? 'text' : 'password'"
          [name]="name()"
          [placeholder]="placeholder()"
          [required]="required()"
          [disabled]="disabled()"
          [(ngModel)]="value"
          (blur)="onBlur()"
          [class]="inputClasses()"
        />

        <button
          type="button"
          (click)="togglePassword()"
          class="absolute inset-y-0 right-0 pr-3 flex items-center text-text-tertiary hover:text-text-primary transition-colors"
          [disabled]="disabled()"
        >
          <app-icon [name]="showPassword() ? 'visibility_off' : 'visibility'" size="sm"/>
        </button>
      </div>

      @if (error() && touched()) {
        <p class="text-sm text-error flex items-center gap-1">
          <app-icon name="error" size="xs"/>
          {{ error()!.message }}
        </p>
      }

      @if (hint() && !error()) {
        <p class="text-xs text-text-tertiary">
          {{ hint() }}
        </p>
      }
    </div>
  `,
})
export class PasswordInputComponent {
  public id = input.required<string>();
  public name = input.required<string>();
  public label = input<string>('');
  public placeholder = input<string>('');
  public hint = input<string>('');
  public required = input<boolean>(false);
  public disabled = input<boolean>(false);
  public error = input<InputError | null>(null);

  public value = model<string>('');
  public showPassword = model<boolean>(false);
  public touched = model<boolean>(false);

  public togglePassword() {
    this.showPassword.update((show) => !show);
  }

  public onBlur() {
    this.touched.set(true);
  }

  public inputClasses() {
    const baseClasses =
      'w-full pl-10 pr-12 py-3 bg-surface border-2 rounded-xl text-text-primary placeholder-text-tertiary transition-all';
    const errorClasses =
      this.error() && this.touched()
        ? 'border-error focus:ring-error focus:border-error'
        : 'border-border focus:ring-primary-500 focus:border-transparent';
    const disabledClasses = this.disabled() ? 'opacity-50 cursor-not-allowed' : '';

    return `${baseClasses} ${errorClasses} ${disabledClasses} focus:outline-none focus:ring-2`;
  }
}
