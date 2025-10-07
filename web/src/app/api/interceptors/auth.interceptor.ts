import type { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthApiService } from '../services/auth-api.service';

/**
 * HTTP Interceptor for adding authentication tokens to requests
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.includes('/auth/login') || req.url.includes('/auth/register')) {
    return next(req);
  }

  const accessToken = localStorage.getItem('access_token');

  if (accessToken) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401 && !req.url.includes('/auth/refresh')) {
        const refreshToken = localStorage.getItem('refresh_token');

        if (refreshToken) {
          const authApi = inject(AuthApiService);

          return authApi.refreshToken(refreshToken).pipe(
            switchMap((response) => {
              localStorage.setItem('access_token', response.token);
              localStorage.setItem('refresh_token', response.refresh_token);

              // Retry original request with new token
              const retryReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${response.token}`,
                },
              });

              return next(retryReq);
            }),
            catchError((refreshError) => {
              localStorage.removeItem('access_token');
              localStorage.removeItem('refresh_token');
              // TODO: Navigate to login page
              return throwError(() => refreshError);
            }),
          );
        }
      }

      return throwError(() => error);
    }),
  );
};
