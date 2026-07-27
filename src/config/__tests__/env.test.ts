describe('env', () => {
  const originalEnv = process.env;

  function loadEnv() {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('../env') as typeof import('../env');
  }

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    delete process.env.EXPO_PUBLIC_API_MODE;
    delete process.env.EXPO_PUBLIC_API_MODE_OVERRIDE;
    delete process.env.EXPO_PUBLIC_API_URL;
    delete process.env.EXPO_PUBLIC_API_URL_OVERRIDE;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('API mode는 기본값으로 mock을 사용한다', () => {
    const { env } = loadEnv();

    expect(env.apiMode).toBe('mock');
  });

  it('override 값이 일반 환경 값보다 우선한다', () => {
    process.env.EXPO_PUBLIC_API_MODE = 'mock';
    process.env.EXPO_PUBLIC_API_MODE_OVERRIDE = 'real';
    process.env.EXPO_PUBLIC_API_URL = 'http://localhost:8080';
    process.env.EXPO_PUBLIC_API_URL_OVERRIDE = 'http://127.0.0.1:8080';

    const { env, requireApiUrl } = loadEnv();

    expect(env.apiMode).toBe('real');
    expect(requireApiUrl()).toBe('http://127.0.0.1:8080');
  });

  it('API URL 끝의 slash를 제거한다', () => {
    process.env.EXPO_PUBLIC_API_URL = 'http://localhost:8080///';

    const { requireApiUrl } = loadEnv();

    expect(requireApiUrl()).toBe('http://localhost:8080');
  });
});
