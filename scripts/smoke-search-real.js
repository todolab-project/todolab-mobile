#!/usr/bin/env node

const apiUrl = (process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080').replace(/\/$/, '');
const runId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const email = `mobile-search-smoke-${runId}@example.com`;
const password = `M-search-${runId}`;
const displayName = `모바일 검색 스모크 ${runId.slice(-6)}`;
const keyword = `검색${runId.slice(-6)}`;
const createdTaskIds = [];
let authHeaders = null;

async function request(path, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10_000);

  const response = await fetch(`${apiUrl}${path}`, {
    ...options,
    signal: controller.signal,
    headers: {
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  }).finally(() => clearTimeout(timeoutId));
  const body = await readJsonBody(response);

  if (!response.ok || body?.status === 'fail') {
    const message = body?.error?.message ?? `HTTP ${response.status}`;
    const error = new Error(`${path} failed: ${message}`);
    error.status = response.status;
    error.code = body?.error?.code;
    throw error;
  }

  return body?.data ?? null;
}

async function readJsonBody(response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Invalid JSON response from ${apiUrl}. HTTP ${response.status}`);
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertSearchPage(page, message) {
  assert(page && Array.isArray(page.items), `${message}: items must be an array`);
  assert('nextCursor' in page, `${message}: nextCursor key missing`);
}

async function createTask(payload) {
  const created = await request('/api/v1/tasks', {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify(payload),
  });

  createdTaskIds.push(created.id);

  return created;
}

async function main() {
  console.log(`Search smoke target: ${apiUrl}`);
  console.log(`Search smoke account: ${email}`);

  const user = await request('/api/v1/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, displayName }),
  });
  assert(user.email === email, 'register response email mismatch');
  console.log('✓ register');

  const token = await request('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  assert(token.tokenType === 'Bearer' && token.accessToken, 'login token contract mismatch');
  authHeaders = { Authorization: `Bearer ${token.accessToken}` };
  console.log('✓ login');

  const todo = await createTask({
    title: `${keyword} TODO`,
    description: '검색 pagination smoke',
    type: 'TODO',
    category: 'Smoke',
    allDay: false,
  });
  const schedule = await createTask({
    title: `${keyword} 일정`,
    description: '검색 일정 filter smoke',
    type: 'SCHEDULE',
    startAt: '2026-08-05T09:00:00',
    endAt: '2026-08-05T10:00:00',
    category: 'Smoke',
    allDay: false,
  });
  const done = await createTask({
    title: `${keyword} 완료`,
    description: '검색 완료 filter smoke',
    type: 'TODO',
    category: 'Smoke',
    allDay: false,
  });

  await request(`/api/v1/tasks/${done.id}/done`, {
    method: 'PATCH',
    headers: authHeaders,
  });
  console.log('✓ create searchable tasks');

  const firstPage = await request(`/api/v1/tasks/search?q=${encodeURIComponent(keyword)}&limit=2`, {
    headers: authHeaders,
  });
  assertSearchPage(firstPage, 'first search page');
  assert(firstPage.items.length === 2, `first page size mismatch: ${firstPage.items.length}`);
  assert(firstPage.nextCursor, 'first page must include nextCursor');
  console.log('✓ search first page');

  const secondPage = await request(
    `/api/v1/tasks/search?q=${encodeURIComponent(keyword)}&limit=2&cursor=${encodeURIComponent(
      firstPage.nextCursor,
    )}`,
    { headers: authHeaders },
  );
  assertSearchPage(secondPage, 'second search page');
  assert(secondPage.items.length >= 1, 'second page should include remaining search result');
  console.log('✓ search next page');

  const scheduleOnly = await request(
    `/api/v1/tasks/search?q=${encodeURIComponent(keyword)}&taskTypes=SCHEDULE&dateField=START&dateFrom=2026-08-01&dateTo=2026-08-31&limit=10`,
    { headers: authHeaders },
  );
  assertSearchPage(scheduleOnly, 'schedule filtered search');
  assert(
    scheduleOnly.items.some((item) => item.task.id === schedule.id),
    'schedule filter should include created schedule',
  );
  assert(
    scheduleOnly.items.every((item) => item.task.type === 'SCHEDULE'),
    'schedule filter should only include schedules',
  );
  console.log('✓ task type and date filter');

  const doneOnly = await request(
    `/api/v1/tasks/search?q=${encodeURIComponent(keyword)}&statuses=DONE&limit=10`,
    { headers: authHeaders },
  );
  assertSearchPage(doneOnly, 'done filtered search');
  assert(
    doneOnly.items.some((item) => item.task.id === done.id),
    'done filter missing task',
  );
  assert(
    doneOnly.items.every((item) => item.task.status === 'DONE'),
    'done filter mismatch',
  );
  console.log('✓ status filter');

  const empty = await request(
    `/api/v1/tasks/search?q=${encodeURIComponent(`${keyword}-없는결과`)}&limit=10`,
    { headers: authHeaders },
  );
  assertSearchPage(empty, 'empty search');
  assert(empty.items.length === 0, 'empty search should return no items');
  assert(empty.nextCursor === null, 'empty search nextCursor should be null');
  console.log('✓ empty search');

  assert(createdTaskIds.includes(todo.id), 'created TODO tracking mismatch');
  await cleanup();
  console.log('✓ cleanup tasks');
  console.log('Search smoke passed. Token and password were not printed.');
}

async function cleanup() {
  if (!authHeaders) {
    return;
  }

  for (const taskId of createdTaskIds.reverse()) {
    try {
      await request(`/api/v1/tasks/${taskId}`, {
        method: 'DELETE',
        headers: authHeaders,
      });
    } catch {
      console.warn(`! cleanup skipped: task ${taskId} could not be deleted`);
    }
  }
}

main().catch((error) => {
  if (error?.name === 'AbortError') {
    console.error(`Search smoke timed out while connecting to ${apiUrl}`);
  } else {
    console.error(error instanceof Error ? error.message : error);
    const causeDetail = formatErrorCause(error?.cause);

    if (causeDetail) {
      console.error(`Failure cause: ${causeDetail}`);
    }

    if (error?.status || error?.code) {
      console.error(`Failure detail: status=${error.status ?? 'n/a'}, code=${error.code ?? 'n/a'}`);
    }
  }
  cleanup().finally(() => {
    process.exitCode = 1;
  });
});

function formatErrorCause(cause) {
  if (!cause || typeof cause !== 'object') {
    return null;
  }

  return [cause.code, cause.address, cause.port, cause.message].filter(Boolean).join(', ');
}
