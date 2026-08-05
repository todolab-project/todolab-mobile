import type { LocalDateTimeString } from './date-time';

export type UserRole = 'USER' | 'ADMIN';

export type UserResponse = {
  id: number;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: LocalDateTimeString;
  updatedAt: LocalDateTimeString | null;
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

export type PasswordResetRequest = {
  email: string;
};

export type PasswordResetRequestResponse = {
  accepted: boolean;
};

export type PasswordResetVerifyRequest = {
  token: string;
};

export type PasswordResetVerifyResponse = {
  valid: boolean;
  emailHint: string | null;
};

export type PasswordResetConfirmRequest = {
  token: string;
  newPassword: string;
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
