import { z } from 'zod';

// Auth Schemas
export const loginRequestSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  remember_me: z.boolean().optional(),
});

export const loginResponseSchema = z.object({
  message: z.string(),
  token: z.string(),
  refresh_token: z.string(),
  user: z.object({
    id: z.number(),
    email: z.string().email(),
    name: z.string(),
    role: z.string(),
    last_login_at: z.string(),
  }),
});

export const registerRequestSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const registerResponseSchema = z.object({
  message: z.string(),
  token: z.string(),
  refresh_token: z.string(),
  user: z.object({
    id: z.number(),
    email: z.string().email(),
    name: z.string(),
    role: z.string(),
    last_login_at: z.string().optional(),
  }),
});

export const refreshTokenRequestSchema = z.object({
  refresh_token: z.string(),
});

export const refreshTokenResponseSchema = z.object({
  token: z.string(),
  refresh_token: z.string(),
});

export const errorResponseSchema = z.object({
  error: z.string(),
  message: z.string().optional(),
  details: z.record(z.any()).optional(),
});

export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type RegisterRequest = z.infer<typeof registerRequestSchema>;
export type RegisterResponse = z.infer<typeof registerResponseSchema>;
export type RefreshTokenRequest = z.infer<typeof refreshTokenRequestSchema>;
export type RefreshTokenResponse = z.infer<typeof refreshTokenResponseSchema>;
export type ErrorResponse = z.infer<typeof errorResponseSchema>;
