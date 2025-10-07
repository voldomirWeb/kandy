import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonComponent } from '../../components/button.component';
import { InputComponent, type InputError } from '../../components/input.component';
import { PasswordInputComponent } from '../../components/password-input.component';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ButtonComponent, InputComponent, PasswordInputComponent, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="text-center">
        <h2 class="text-2xl font-bold text-text-primary mb-2">Sign In</h2>
        <p class="text-text-secondary text-sm">
          Enter your credentials to access your account
        </p>
      </div>

      <form (ngSubmit)="onSubmit()" class="flex flex-col gap-y-4">
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
          [required]="true"
          [error]="passwordError()"
          [(value)]="password"
        />

        <div class="flex items-center justify-between">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              [(ngModel)]="rememberMe"
              name="rememberMe"
              class="w-4 h-4 rounded border-2 border-border bg-surface text-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-0 cursor-pointer"
            />
            <span class="text-sm text-text-secondary">Remember me</span>
          </label>
          <a
            href="#"
            class="text-sm text-primary-400 hover:text-primary-300 transition-colors"
          >
            Forgot password?
          </a>
        </div>

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
              Signing in...
            </span>
          } @else {
            Sign In
          }
        </app-button>
      </form>

      <div class="text-center">
        <p class="text-text-secondary text-sm">
          Don't have an account?
          <a
            routerLink="/auth/register"
            class="text-primary-400 hover:text-primary-300 font-medium transition-colors ml-1"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  `,
})
export class LoginComponent {
  private authService = inject(AuthService);
  private toast = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  public email = signal('');
  public password = signal('');
  public rememberMe = signal(false);
  public isLoading = signal(false);

  public emailError = signal<InputError | null>(null);
  public passwordError = signal<InputError | null>(null);

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
    this.passwordError.set(null);
    return true;
  }

  public onSubmit() {
    const isEmailValid = this.validateEmail();
    const isPasswordValid = this.validatePassword();

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    this.isLoading.set(true);

    this.authService.login(this.email(), this.password(), this.rememberMe()).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.toast.success('Login successful!', `Welcome back, ${response.user.name}!`);

        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
        this.router.navigate([returnUrl]);
      },
      error: (error) => {
        this.isLoading.set(false);
        const errorMessage = error.message || 'Login failed. Please try again.';
        this.toast.error('Login failed', errorMessage);

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
