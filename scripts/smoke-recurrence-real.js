#!/usr/bin/env node

const apiUrl = (process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080').replace(/\/$/, '');
const runId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const email = `mobile-recurrence-smoke-${runId}@example.com`;
const password = `M-recur-${runId}`;
const displayName = `모바일 반복 스모크 ${runId.slice(-6)}`;
const firstDate = '2026-08-04';
const secondDate = '2026-08-11';
const title = `반복 smoke ${runId}`;
let authHeaders = null;
let createdTaskId = null;

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

function assertRecurringTask(task, expectedDate) {
  assert(task.recurrenceSeriesId, 'recurring task must include recurrenceSeriesId');
  assert(task.occurrenceDate === expectedDate, `occurrenceDate mismatch: ${task.occurrenceDate}`);
  assert(
    task.originalOccurrenceDate === expectedDate,
    `originalOccurrenceDate mismatch: ${task.originalOccurrenceDate}`,
  );
  assert(task.recurrence?.frequency === 'WEEKLY', 'recurrence frequency mismatch');
  assert(task.recurrence?.recurrenceRule?.includes('FREQ=WEEKLY'), 'RRULE frequency missing');
  assert(task.recurrence?.recurrenceRule?.includes('BYDAY=TU'), 'RRULE BYDAY missing');
}

async function main() {
  console.log(`Recurrence smoke target: ${apiUrl}`);
  console.log(`Recurrence smoke account: ${email}`);

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

  const created = await request('/api/v1/tasks', {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      title,
      description: '반복 생성 smoke',
      type: 'SCHEDULE',
      startAt: `${firstDate}T09:00:00`,
      endAt: `${firstDate}T10:00:00`,
      category: 'Smoke',
      allDay: false,
      recurrence: {
        frequency: 'WEEKLY',
        interval: 1,
        byDays: ['TU'],
        recurrenceCount: 3,
      },
    }),
  });
  createdTaskId = created.id;
  assert(created.title === title, 'created title mismatch');
  assertRecurringTask(created, firstDate);
  console.log('✓ create weekly recurrence');

  const firstToday = await request(`/api/v1/tasks/today?date=${firstDate}`, {
    headers: authHeaders,
  });
  const firstOccurrence = firstToday.find((task) => task.id === created.id);
  assert(firstOccurrence, 'first occurrence missing from Today');
  assertRecurringTask(firstOccurrence, firstDate);
  console.log('✓ first occurrence in Today');

  const secondToday = await request(`/api/v1/tasks/today?date=${secondDate}`, {
    headers: authHeaders,
  });
  const secondOccurrence = secondToday.find(
    (task) => task.title === title && task.occurrenceDate === secondDate,
  );
  assert(secondOccurrence, 'second occurrence was not materialized in Today');
  assert(secondOccurrence.id !== created.id, 'second occurrence should be a distinct task row');
  assertRecurringTask(secondOccurrence, secondDate);
  console.log('✓ next occurrence materialized in Today');

  const monthTasks = await request('/api/v1/tasks?type=MONTH&taskType=SCHEDULE&date=2026-08', {
    headers: authHeaders,
  });
  const monthOccurrences = monthTasks.filter((task) => task.title === title);
  assert(monthOccurrences.length >= 2, 'monthly range should include recurring occurrences');
  console.log('✓ monthly range includes occurrences');

  await request(`/api/v1/tasks/${created.id}?recurrenceScope=ALL`, {
    method: 'DELETE',
    headers: authHeaders,
  });
  console.log('✓ delete recurrence with ALL scope');

  console.log('Recurrence smoke passed. Token and password were not printed.');
}

async function cleanup() {
  if (!authHeaders || !createdTaskId) {
    return;
  }

  try {
    await request(`/api/v1/tasks/${createdTaskId}?recurrenceScope=ALL`, {
      method: 'DELETE',
      headers: authHeaders,
    });
    console.log('✓ cleanup recurrence with ALL scope');
  } catch {
    console.warn('! cleanup skipped: recurrence task could not be deleted');
  }
}

main().catch((error) => {
  if (error?.name === 'AbortError') {
    console.error(`Recurrence smoke timed out while connecting to ${apiUrl}`);
  } else {
    console.error(error instanceof Error ? error.message : error);
    if (error?.status || error?.code) {
      console.error(`Failure detail: status=${error.status ?? 'n/a'}, code=${error.code ?? 'n/a'}`);
    }
  }
  cleanup().finally(() => {
    process.exitCode = 1;
  });
});
