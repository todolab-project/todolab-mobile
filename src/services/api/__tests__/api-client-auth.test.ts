import { request } from '../api-client';
import { subscribeSessionExpired } from '../auth-session';
import { clearAccessToken, getAccessToken, setAccessToken } from '../auth-token-store';

jest.mock('@/config', () => ({
  env: { apiMode: 'real', apiUrl: 'https://api.example.com' },
  requireApiUrl: () => 'https://api.example.com',
}));

describe('api client authorization', () => {
  beforeEach(() => {
    installLocalStorage();
    localStorage.clear();
    clearAccessToken();
  });

  it('저장된 access token을 Authorization 헤더로 첨부한다', async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: async () =>
        JSON.stringify({
          status: 'success',
          data: { ok: true },
          error: null,
          timestamp: '2026-07-14T10:00:00',
        }),
    });
    globalThis.fetch = fetchMock;

    setAccessToken('access-token');

    await request('/api/v1/auth/me');

    const headers = fetchMock.mock.calls[0][1].headers as Headers;
    expect(headers.get('Authorization')).toBe('Bearer access-token');
  });

  it('401 응답을 받으면 access token을 삭제하고 세션 만료를 알린다', async () => {
    globalThis.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 401,
      text: async () =>
        JSON.stringify({
          status: 'fail',
          data: null,
          error: { code: 401, message: '로그인이 필요해요.' },
          timestamp: '2026-07-14T10:00:00',
        }),
    });

    const listener = jest.fn();
    const unsubscribe = subscribeSessionExpired(listener);
    setAccessToken('expired-token');

    await expect(request('/api/v1/auth/me')).rejects.toThrow('로그인이 필요해요.');

    expect(getAccessToken()).toBeNull();
    expect(listener).toHaveBeenCalledTimes(1);
    unsubscribe();
  });
});

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
