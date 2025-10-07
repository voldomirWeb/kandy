import { HttpClient, type HttpErrorResponse, type HttpHeaders } from '@angular/common/http';
import { inject } from '@angular/core';
import { type Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { z } from 'zod';
import { type ErrorResponse, errorResponseSchema } from '../schemas/auth.schema';

export interface ApiConfig {
  baseUrl: string;
}

export abstract class BaseApiService {
  protected http = inject(HttpClient);
  protected abstract apiConfig: ApiConfig;

  protected validateRequest<T>(data: unknown, schema: z.ZodSchema<T>): T {
    try {
      return schema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('Request validation failed:', error.errors);
        throw new Error(`Invalid request data: ${error.errors.map((e) => e.message).join(', ')}`);
      }
      throw error;
    }
  }

  protected validateResponse<T>(data: unknown, schema: z.ZodSchema<T>): T {
    try {
      return schema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('Response validation failed:', error.errors);
        throw new Error(`Invalid response data: ${error.errors.map((e) => e.message).join(', ')}`);
      }
      throw error;
    }
  }

  protected post<TRequest, TResponse>(
    endpoint: string,
    data: TRequest,
    requestSchema: z.ZodSchema<TRequest>,
    responseSchema: z.ZodSchema<TResponse>,
    options?: { headers?: HttpHeaders },
  ): Observable<TResponse> {
    // Validate request
    const validatedData = this.validateRequest(data, requestSchema);

    return this.http
      .post<unknown>(`${this.apiConfig.baseUrl}${endpoint}`, validatedData, options)
      .pipe(
        map((response) => this.validateResponse(response, responseSchema)),
        catchError((error) => this.handleError(error)),
      );
  }

  protected get<TResponse>(
    endpoint: string,
    responseSchema: z.ZodSchema<TResponse>,
    options?: { headers?: HttpHeaders },
  ): Observable<TResponse> {
    return this.http.get<unknown>(`${this.apiConfig.baseUrl}${endpoint}`, options).pipe(
      map((response) => this.validateResponse(response, responseSchema)),
      catchError((error) => this.handleError(error)),
    );
  }

  protected put<TRequest, TResponse>(
    endpoint: string,
    data: TRequest,
    requestSchema: z.ZodSchema<TRequest>,
    responseSchema: z.ZodSchema<TResponse>,
    options?: { headers?: HttpHeaders },
  ): Observable<TResponse> {
    const validatedData = this.validateRequest(data, requestSchema);

    return this.http
      .put<unknown>(`${this.apiConfig.baseUrl}${endpoint}`, validatedData, options)
      .pipe(
        map((response) => this.validateResponse(response, responseSchema)),
        catchError((error) => this.handleError(error)),
      );
  }

  protected delete<TResponse>(
    endpoint: string,
    responseSchema: z.ZodSchema<TResponse>,
    options?: { headers?: HttpHeaders },
  ): Observable<TResponse> {
    return this.http.delete<unknown>(`${this.apiConfig.baseUrl}${endpoint}`, options).pipe(
      map((response) => this.validateResponse(response, responseSchema)),
      catchError((error) => this.handleError(error)),
    );
  }

  /**
   * Handles HTTP errors and parses error responses
   */
  protected handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    let errorDetails: ErrorResponse | null = null;

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      try {
        errorDetails = errorResponseSchema.parse(error.error);
        errorMessage = errorDetails.message || errorDetails.error || errorMessage;
      } catch {
        // If error doesn't match schema, use generic message
        errorMessage = `Server error: ${error.status} ${error.statusText}`;
      }
    }

    console.error('API Error:', {
      status: error.status,
      message: errorMessage,
      details: errorDetails,
    });

    return throwError(() => ({
      status: error.status,
      message: errorMessage,
      details: errorDetails,
    }));
  }
}
