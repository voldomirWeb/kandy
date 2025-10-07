import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonComponent } from '../../components/button.component';
import { InputComponent, type InputError } from '../../components/input.component';
import { PasswordInputComponent } from '../../components/password-input.component';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, InputComponent, FormsModule, PasswordInputComponent, ButtonComponent],
  template: `
    <div class="space-y-6">
      <div class="text-center">
        <h2 class="text-2xl font-bold text-text-primary mb-2">Create Account</h2>
        <p class="text-text-secondary text-sm">
          Sign up to get started with Kandy
        </p>
      </div>

      <form (ngSubmit)="onSubmit()" class="flex flex-col gap-y-4">
        <app-input
          id="name"
          name="name"
          label="Full Name"
          placeholder="John Doe"
          icon="person"
          [required]="true"
          [error]="nameError()"
          [(value)]="name"
        />

        <app-input
          id="email"
          name="email"
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          icon="mail"
          [required]="true"
          [error]="emailError()"
          [(value)]="email"
        />

        <app-password-input
          id="password"
          name="password"
          label="Password"
          placeholder="••••••••"
          hint="Must be at least 8 characters with uppercase, lowercase, and numbers"
          [required]="true"
          [error]="passwordError()"
          [(value)]="password"
        />

        <app-password-input
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm Password"
          placeholder="••••••••"
          [required]="true"
          [error]="confirmPasswordError()"
          [(value)]="confirmPassword"
        />

        <label class="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            [(ngModel)]="acceptTerms"
            name="acceptTerms"
            required
            class="w-4 h-4 mt-0.5 rounded border-2 border-border bg-surface text-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-0 cursor-pointer"
          />
          <span class="text-sm text-text-secondary">
            I agree to the
            <a href="#" class="text-primary-400 hover:text-primary-300 transition-colors">
              Terms of Service
            </a>
            and
            <a href="#" class="text-primary-400 hover:text-primary-300 transition-colors">
              Privacy Policy
            </a>
          </span>
        </label>

        @if (termsError()) {
          <p class="text-sm text-error flex items-center gap-1 -mt-2">
            <span class="material-symbols-outlined text-base">error</span>
            {{ termsError()!.message }}
          </p>
        }

        <app-button
          type="submit"
          variant="primary"
          size="md"
          [fullWidth]="true"
          [disabled]="isLoading()"
        >
          @if (isLoading()) {
            <span class="flex items-center justify-center gap-2">
              <span class="material-symbols-outlined text-lg animate-spin">progress_activity</span>
              Creating account...
            </span>
          } @else {
            Create Account
          }
        </app-button>
      </form>

      <div class="text-center">
        <p class="text-text-secondary text-sm">
          Already have an account?
          <a
            routerLink="/auth/login"
            class="text-primary-400 hover:text-primary-300 font-medium transition-colors ml-1"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  `,
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private toast = inject(ToastService);
  private router = inject(Router);

  public name = signal('');
  public email = signal('');
  public password = signal('');
  public confirmPassword = signal('');
  public acceptTerms = signal(false);
  public isLoading = signal(false);

  public nameError = signal<InputError | null>(null);
  public emailError = signal<InputError | null>(null);
  public passwordError = signal<InputError | null>(null);
  public confirmPasswordError = signal<InputError | null>(null);
  public termsError = signal<InputError | null>(null);

  private validateName(): boolean {
    if (!this.name().trim()) {
      this.nameError.set({ message: 'Full name is required' });
      return false;
    }
    if (this.name().trim().length < 2) {
      this.nameError.set({ message: 'Name must be at least 2 characters' });
      return false;
    }
    this.nameError.set(null);
    return true;
  }

  private validateEmail(): boolean {
    if (!this.email().trim()) {
      this.emailError.set({ message: 'Email address is required' });
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email())) {
      this.emailError.set({ message: 'Please enter a valid email address' });
      return false;
    }
    this.emailError.set(null);
    return true;
  }

  private validatePassword(): boolean {
    if (!this.password()) {
      this.passwordError.set({ message: 'Password is required' });
      return false;
    }
    if (this.password().length < 8) {
      this.passwordError.set({ message: 'Password must be at least 8 characters' });
      return false;
    }
    if (!/[A-Z]/.test(this.password())) {
      this.passwordError.set({ message: 'Password must contain at least one uppercase letter' });
      return false;
    }
    if (!/[a-z]/.test(this.password())) {
      this.passwordError.set({ message: 'Password must contain at least one lowercase letter' });
      return false;
    }
    if (!/[0-9]/.test(this.password())) {
      this.passwordError.set({ message: 'Password must contain at least one number' });
      return false;
    }
    this.passwordError.set(null);
    return true;
  }

  private validateConfirmPassword(): boolean {
    if (!this.confirmPassword()) {
      this.confirmPasswordError.set({ message: 'Please confirm your password' });
      return false;
    }
    if (this.password() !== this.confirmPassword()) {
      this.confirmPasswordError.set({ message: 'Passwords do not match' });
      return false;
    }
    this.confirmPasswordError.set(null);
    return true;
  }

  private validateTerms(): boolean {
    if (!this.acceptTerms()) {
      this.termsError.set({ message: 'You must accept the terms and conditions' });
      return false;
    }
    this.termsError.set(null);
    return true;
  }

  onSubmit() {
    // Validate all fields
    const isNameValid = this.validateName();
    const isEmailValid = this.validateEmail();
    const isPasswordValid = this.validatePassword();
    const isConfirmPasswordValid = this.validateConfirmPassword();
    const isTermsValid = this.validateTerms();

    if (
      !isNameValid ||
      !isEmailValid ||
      !isPasswordValid ||
      !isConfirmPasswordValid ||
      !isTermsValid
    ) {
      return;
    }

    this.isLoading.set(true);

    this.authService.register(this.name(), this.email(), this.password()).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.toast.success('Registration successful!', `Welcome, ${response.user.name}!`);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isLoading.set(false);
        const errorMessage = error.message || 'Registration failed. Please try again.';
        this.toast.error('Registration failed', errorMessage);

        if (error.details?.name) {
          this.nameError.set({ message: error.details.name });
        }
        if (error.details?.email) {
          this.emailError.set({ message: error.details.email });
        }
        if (error.details?.password) {
          this.passwordError.set({ message: error.details.password });
        }
      },
    });
  }
}
