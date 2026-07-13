import type {
  AuthenticatedUserResponse,
  LoginRequest,
  RegisterRequest,
  TokenResponse,
  UserResponse,
} from '@/types';

import { apiClient } from './api-client';
import { clearAccessToken, setAccessToken } from './auth-token-store';

const AUTH_PATH = '/api/v1/auth';

export const authApi = {
  register(request: RegisterRequest, signal?: AbortSignal) {
    return apiClient.post<UserResponse>(`${AUTH_PATH}/register`, request, { signal });
  },

  async login(request: LoginRequest, signal?: AbortSignal) {
    const response = await apiClient.post<TokenResponse>(`${AUTH_PATH}/login`, request, { signal });
    setAccessToken(response.accessToken);
    return response;
  },

  me(signal?: AbortSignal) {
    return apiClient.get<AuthenticatedUserResponse>(`${AUTH_PATH}/me`, { signal });
  },

  logout() {
    clearAccessToken();
  },
};
