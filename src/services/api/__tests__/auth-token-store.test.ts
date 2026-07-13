import { clearAccessToken, getAccessToken, setAccessToken } from '../auth-token-store';

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

describe('auth token store', () => {
  beforeEach(() => {
    installLocalStorage();
    clearAccessToken();
    localStorage.clear();
  });

  it('access token을 메모리와 localStorage에 저장한다', () => {
    setAccessToken(' token-value ');

    expect(getAccessToken()).toBe('token-value');
    expect(localStorage.getItem('todolab.accessToken')).toBe('token-value');
  });

  it('access token을 삭제한다', () => {
    setAccessToken('token-value');

    clearAccessToken();

    expect(getAccessToken()).toBeNull();
    expect(localStorage.getItem('todolab.accessToken')).toBeNull();
  });
});
