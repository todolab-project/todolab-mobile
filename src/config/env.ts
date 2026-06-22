const rawApiUrl = process.env.EXPO_PUBLIC_API_URL?.trim();

export const env = Object.freeze({
  apiUrl: rawApiUrl ? rawApiUrl.replace(/\/+$/, '') : undefined,
});

export function requireApiUrl() {
  if (!env.apiUrl) {
    throw new Error(
      'EXPO_PUBLIC_API_URL이 설정되지 않았습니다. .env.example을 참고해 로컬 환경 파일을 만들어 주세요.',
    );
  }

  return env.apiUrl;
}
