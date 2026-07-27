#!/usr/bin/env node

const apiUrl = (process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080').replace(/\/$/, '');
const runId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const email = `mobile-auth-smoke-${runId}@example.com`;
const password = `M-auth-${runId}`;
const displayName = `모바일 인증 스모크 ${runId.slice(-6)}`;

async function request(path, options = {}) {
  const response = await fetch(`${apiUrl}${path}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  });
  const text = await response.text();
  const body = text ? JSON.parse(text) : null;

  if (!response.ok || body?.status === 'fail') {
    const message = body?.error?.message ?? `HTTP ${response.status}`;
    throw new Error(`${path} failed: ${message}`);
  }

  return body?.data ?? null;
}

async function main() {
  console.log(`Auth smoke target: ${apiUrl}`);
  console.log(`Auth smoke account: ${email}`);

  const user = await request('/api/v1/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, displayName }),
  });
  if (user.email !== email) {
    throw new Error('register response email mismatch');
  }
  console.log('✓ register');

  const token = await request('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (token.tokenType !== 'Bearer' || !token.accessToken || !token.expiresAt) {
    throw new Error('login response token contract mismatch');
  }
  console.log('✓ login');

  const me = await request('/api/v1/auth/me', {
    headers: { Authorization: `Bearer ${token.accessToken}` },
  });
  if (me.email !== email) {
    throw new Error('me response email mismatch');
  }
  console.log('✓ me');

  try {
    await request('/api/v1/auth/me');
    throw new Error('unauthorized me unexpectedly succeeded');
  } catch (error) {
    if (!String(error.message).includes('/api/v1/auth/me failed')) {
      throw error;
    }
  }
  console.log('✓ unauthenticated me rejected');
  console.log('Auth smoke passed. Token and password were not printed.');
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
