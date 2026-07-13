import type { LocalDateTimeString } from './date-time';

export type UserRole = 'USER' | 'ADMIN';

export type UserResponse = {
  id: number;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: LocalDateTimeString;
};

export type RegisterRequest = {
  email: string;
  password: string;
  displayName: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type TokenResponse = {
  tokenType: 'Bearer';
  accessToken: string;
  expiresAt: LocalDateTimeString;
  user: UserResponse;
};

export type AuthenticatedUserResponse = {
  id: number;
  email: string;
  role: UserRole;
};
