import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
  subscribeAccessToken,
} from '../auth-token-store';

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

  it('access token 변경을 구독자에게 알린다', () => {
    const listener = jest.fn();
    const unsubscribe = subscribeAccessToken(listener);

    setAccessToken('token-value');
    clearAccessToken();
    unsubscribe();
    setAccessToken('ignored-token');

    expect(listener).toHaveBeenNthCalledWith(1, 'token-value');
    expect(listener).toHaveBeenNthCalledWith(2, null);
    expect(listener).toHaveBeenCalledTimes(2);
  });
});
