import { Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { z } from 'zod';
import {
  type LoginRequest,
  type LoginResponse,
  loginRequestSchema,
  loginResponseSchema,
  type RefreshTokenRequest,
  type RefreshTokenResponse,
  type RegisterRequest,
  type RegisterResponse,
  refreshTokenRequestSchema,
  refreshTokenResponseSchema,
  registerRequestSchema,
  registerResponseSchema,
} from '../schemas/auth.schema';
import { BaseApiService } from './base-api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService extends BaseApiService {
  protected apiConfig = {
    baseUrl: '/api',
  };

  public login(email: string, password: string, rememberMe?: boolean): Observable<LoginResponse> {
    const request: LoginRequest = {
      email,
      password,
      remember_me: rememberMe,
    };

    return this.post('/auth/login', request, loginRequestSchema, loginResponseSchema);
  }

  public register(name: string, email: string, password: string): Observable<RegisterResponse> {
    const request: RegisterRequest = {
      name,
      email,
      password,
    };

    return this.post('/auth/register', request, registerRequestSchema, registerResponseSchema);
  }

  public refreshToken(refreshToken: string): Observable<RefreshTokenResponse> {
    const request: RefreshTokenRequest = {
      refresh_token: refreshToken,
    };

    return this.post(
      '/auth/refresh',
      request,
      refreshTokenRequestSchema,
      refreshTokenResponseSchema,
    );
  }

  public logout(): Observable<{ message?: string }> {
    const emptySchema = z.object({ message: z.string().optional() });
    // TODO im backend implementieren
    return this.post('/auth/logout', {}, z.object({}), emptySchema);
  }
}
