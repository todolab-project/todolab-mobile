import { authApi, getAccessToken } from '@/services/api';
import { apiClient } from '@/services/api/api-client';

jest.mock('@/services/api/api-client', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

const getMock = apiClient.get as jest.Mock;
const postMock = apiClient.post as jest.Mock;

function installLocalStorage() {
  let storage: Record<string, string> = {};

  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      clear: () => {
        storage = {};
      },
      getItem: (key: string) => storage[key] ?? null,
      removeItem: (key: string) => {
        delete storage[key];
      },
      setItem: (key: string, value: string) => {
        storage[key] = value;
      },
    },
  });
}

describe('Auth API', () => {
  beforeEach(() => {
    installLocalStorage();
    getMock.mockReset();
    postMock.mockReset();
    localStorage.clear();
  });

  it('회원가입 API를 호출한다', async () => {
    postMock.mockResolvedValue({ id: 1 });
    const request = {
      email: 'user@example.com',
      password: 'password123',
      displayName: 'User',
    };

    await authApi.register(request);

    expect(postMock).toHaveBeenCalledWith('/api/v1/auth/register', request, {
      signal: undefined,
    });
  });

  it('로그인 성공 시 access token을 저장한다', async () => {
    postMock.mockResolvedValue({
      tokenType: 'Bearer',
      accessToken: 'access-token',
      expiresAt: '2026-07-14T10:00:00',
      user: {
        id: 1,
        email: 'user@example.com',
        displayName: 'User',
        role: 'USER',
        createdAt: '2026-07-14T09:00:00',
      },
    });
    const request = { email: 'user@example.com', password: 'password123' };

    await authApi.login(request);

    expect(postMock).toHaveBeenCalledWith('/api/v1/auth/login', request, {
      signal: undefined,
    });
    expect(getAccessToken()).toBe('access-token');
  });

  it('내 정보 API를 호출한다', async () => {
    getMock.mockResolvedValue({ id: 1, email: 'user@example.com', role: 'USER' });

    await authApi.me();

    expect(getMock).toHaveBeenCalledWith('/api/v1/auth/me', { signal: undefined });
  });
});
