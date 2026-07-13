describe('api client authorization', () => {
  beforeEach(() => {
    jest.resetModules();
    installLocalStorage();
    localStorage.clear();
  });

  it('저장된 access token을 Authorization 헤더로 첨부한다', async () => {
    jest.doMock('@/config', () => ({
      env: { apiMode: 'real', apiUrl: 'https://api.example.com' },
      requireApiUrl: () => 'https://api.example.com',
    }));

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

    const { request } = require('../api-client') as typeof import('../api-client');
    const { setAccessToken } = require('../auth-token-store') as typeof import('../auth-token-store');
    setAccessToken('access-token');

    await request('/api/v1/auth/me');

    const headers = fetchMock.mock.calls[0][1].headers as Headers;
    expect(headers.get('Authorization')).toBe('Bearer access-token');
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
