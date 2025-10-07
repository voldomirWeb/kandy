import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, type Observable, tap, throwError } from 'rxjs';
import type { LoginResponse, RegisterResponse } from '../api/schemas/auth.schema';
import { AuthApiService } from '../api/services/auth-api.service';

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  last_login_at?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authApi = inject(AuthApiService);
  private router = inject(Router);

  public isAuthenticated = signal<boolean>(false);
  public currentUser = signal<User | null>(null);
  public accessToken = signal<string | null>(null);

  constructor() {
    this.checkAuthState();
  }

  private checkAuthState(): void {
    const token = localStorage.getItem('access_token');
    const userJson = localStorage.getItem('user');

    if (token && userJson) {
      try {
        const user = JSON.parse(userJson);
        this.accessToken.set(token);
        this.currentUser.set(user);
        this.isAuthenticated.set(true);
      } catch (error) {
        console.error('Failed to parse user data:', error);
        this.clearAuthState();
      }
    }
  }

  public login(
    email: string,
    password: string,
    rememberMe: boolean = false,
  ): Observable<LoginResponse> {
    return this.authApi.login(email, password, rememberMe).pipe(
      tap((response) => {
        this.storeAuthData(response);
      }),
      catchError((error) => {
        console.error('Login failed:', error);
        return throwError(() => error);
      }),
    );
  }

  public register(name: string, email: string, password: string): Observable<RegisterResponse> {
    return this.authApi.register(name, email, password).pipe(
      tap((response) => {
        this.storeAuthData(response);
      }),
      catchError((error) => {
        console.error('Registration failed:', error);
        return throwError(() => error);
      }),
    );
  }

  public logout(): void {
    this.authApi.logout().subscribe({
      next: () => {
        this.clearAuthState();
        this.router.navigate(['/auth/login']);
      },
      error: (error) => {
        console.error('Logout failed:', error);
        this.clearAuthState();
        this.router.navigate(['/auth/login']);
      },
    });
  }

  private storeAuthData(response: LoginResponse | RegisterResponse): void {
    localStorage.setItem('access_token', response.token);
    localStorage.setItem('refresh_token', response.refresh_token);
    localStorage.setItem('user', JSON.stringify(response.user));

    this.accessToken.set(response.token);
    this.currentUser.set(response.user);
    this.isAuthenticated.set(true);
  }

  private clearAuthState(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');

    this.accessToken.set(null);
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
  }
}
