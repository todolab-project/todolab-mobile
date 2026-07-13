import type { AuthenticatedUserResponse, TokenResponse, UserResponse } from '@/types';

import { mockApiClient } from '../mock-api-client';

describe('Mock auth API', () => {
  it('회원가입 응답을 반환한다', async () => {
    const response = await mockApiClient.post<UserResponse>('/api/v1/auth/register', {
      email: 'mock-register@example.com',
      password: 'password123',
      displayName: 'Mock Register',
    });

    expect(response.email).toBe('mock-register@example.com');
    expect(response.displayName).toBe('Mock Register');
    expect(response.role).toBe('USER');
  });

  it('로그인 후 내 정보 응답을 반환한다', async () => {
    const login = await mockApiClient.post<TokenResponse>('/api/v1/auth/login', {
      email: 'mock-login@example.com',
      password: 'password123',
    });
    const me = await mockApiClient.get<AuthenticatedUserResponse>('/api/v1/auth/me');

    expect(login.tokenType).toBe('Bearer');
    expect(login.accessToken).toContain('mock-access-token');
    expect(me.email).toBe('mock-login@example.com');
  });
});
