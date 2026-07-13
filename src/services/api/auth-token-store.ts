const ACCESS_TOKEN_STORAGE_KEY = 'todolab.accessToken';

let memoryAccessToken: string | null = null;

function normalizeToken(token: string | null | undefined) {
  const normalized = token?.trim();
  return normalized ? normalized : null;
}

function getLocalStorage() {
  try {
    if (typeof globalThis === 'undefined' || !('localStorage' in globalThis)) {
      return null;
    }

    return globalThis.localStorage;
  } catch {
    return null;
  }
}

export function getAccessToken() {
  if (memoryAccessToken) {
    return memoryAccessToken;
  }

  const token = normalizeToken(getLocalStorage()?.getItem(ACCESS_TOKEN_STORAGE_KEY));
  memoryAccessToken = token;
  return token;
}

export function setAccessToken(token: string | null | undefined) {
  memoryAccessToken = normalizeToken(token);
  const storage = getLocalStorage();

  if (!storage) {
    return;
  }

  if (memoryAccessToken) {
    storage.setItem(ACCESS_TOKEN_STORAGE_KEY, memoryAccessToken);
  } else {
    storage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  }
}

export function clearAccessToken() {
  setAccessToken(null);
}
