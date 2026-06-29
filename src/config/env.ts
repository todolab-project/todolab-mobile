const rawApiUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
const rawApiMode = process.env.EXPO_PUBLIC_API_MODE?.trim().toLowerCase();

export type ApiMode = 'real' | 'mock';

function parseApiMode(value: string | undefined): ApiMode {
  if (!value) {
    return 'real';
  }

  if (value === 'real' || value === 'mock') {
    return value;
  }

  throw new Error('EXPO_PUBLIC_API_MODE은 real 또는 mock 중 하나여야 합니다.');
}

export const env = Object.freeze({
  apiUrl: rawApiUrl ? rawApiUrl.replace(/\/+$/, '') : undefined,
  apiMode: parseApiMode(rawApiMode),
});

export function requireApiUrl() {
  if (!env.apiUrl) {
    throw new Error(
      'EXPO_PUBLIC_API_URL이 설정되지 않았습니다. .env.example을 참고해 로컬 환경 파일을 만들어 주세요.',
    );
  }

  return env.apiUrl;
}
