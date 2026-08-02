#!/usr/bin/env node

const apiUrl = (process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080').replace(/\/$/, '');
const runId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const email = `mobile-recurrence-actions-${runId}@example.com`;
const password = `M-recur-act-${runId}`;
const displayName = `반복 동작 스모크 ${runId.slice(-6)}`;
const firstDate = '2026-08-04';
const secondDate = '2026-08-11';
const thirdDate = '2026-08-18';
const fourthDate = '2026-08-25';
const title = `반복동작${runId.slice(-6)}`;
const completedDate = formatLocalDate(new Date());
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

function findOccurrence(tasks, occurrenceDate) {
  return tasks.find((task) => task.title === title && task.occurrenceDate === occurrenceDate);
}

function findNotificationCandidate(candidates, occurrenceDate) {
  return candidates.find(
    (candidate) => candidate.task?.title === title && candidate.occurrenceDate === occurrenceDate,
  );
}

function formatLocalDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

async function main() {
  console.log(`Recurrence action smoke target: ${apiUrl}`);
  console.log(`Recurrence action smoke account: ${email}`);

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
      description: '반복 occurrence action smoke',
      type: 'SCHEDULE',
      startAt: `${firstDate}T09:00:00`,
      endAt: `${firstDate}T10:00:00`,
      category: 'Smoke',
      allDay: false,
      recurrence: {
        frequency: 'WEEKLY',
        interval: 1,
        byDays: ['TU'],
        recurrenceCount: 4,
      },
    }),
  });
  createdTaskId = created.id;
  assert(created.title === title, 'created title mismatch');
  console.log('✓ create weekly recurrence');

  const firstToday = await request(`/api/v1/tasks/today?date=${firstDate}`, {
    headers: authHeaders,
  });
  const firstOccurrence = findOccurrence(firstToday, firstDate);
  assert(firstOccurrence, 'first occurrence missing from Today');
  console.log('✓ first occurrence in Today');

  const secondToday = await request(`/api/v1/tasks/today?date=${secondDate}`, {
    headers: authHeaders,
  });
  const secondOccurrence = findOccurrence(secondToday, secondDate);
  assert(secondOccurrence, 'second occurrence missing from Today');
  assert(secondOccurrence.id !== firstOccurrence.id, 'second occurrence should use a distinct row');
  console.log('✓ next occurrence materialized in Today');

  const thirdToday = await request(`/api/v1/tasks/today?date=${thirdDate}`, {
    headers: authHeaders,
  });
  const thirdOccurrence = findOccurrence(thirdToday, thirdDate);
  assert(thirdOccurrence, 'third occurrence missing from Today');
  assert(thirdOccurrence.id !== secondOccurrence.id, 'third occurrence should use a distinct row');
  console.log('✓ third occurrence materialized in Today');

  const deferred = await request(
    `/api/v1/tasks/${secondOccurrence.id}/defer-reason?reason=WAITING_OTHER`,
    {
      method: 'PATCH',
      headers: authHeaders,
    },
  );
  assert(deferred.deferReason === 'WAITING_OTHER', 'defer reason mismatch');
  console.log('✓ defer one occurrence');

  const secondAfterDefer = await request(`/api/v1/tasks/today?date=${secondDate}`, {
    headers: authHeaders,
  });
  const deferredSecond = findOccurrence(secondAfterDefer, secondDate);
  assert(deferredSecond?.deferReason === 'WAITING_OTHER', 'defer reason was not persisted');
  console.log('✓ deferred occurrence persists in Today');

  const completed = await request(`/api/v1/tasks/${firstOccurrence.id}/done`, {
    method: 'PATCH',
    headers: authHeaders,
  });
  assert(completed.status === 'DONE', 'first occurrence was not completed');
  assert(
    completed.occurrenceDate === firstDate || completed.originalOccurrenceDate === firstDate,
    'completed occurrence date mismatch',
  );
  console.log('✓ complete one occurrence');

  const doneTasks = await request(`/api/v1/tasks/done?date=${completedDate}`, {
    headers: authHeaders,
  });
  assert(
    doneTasks.some((task) => task.id === firstOccurrence.id && task.status === 'DONE'),
    'completed occurrence missing from done list',
  );
  console.log('✓ completed occurrence in done list');

  const secondAfterComplete = await request(`/api/v1/tasks/today?date=${secondDate}`, {
    headers: authHeaders,
  });
  const unaffectedSecond = findOccurrence(secondAfterComplete, secondDate);
  assert(unaffectedSecond, 'second occurrence should remain available after first is done');
  assert(unaffectedSecond.status !== 'DONE', 'second occurrence should not be completed together');
  assert(
    unaffectedSecond.deferReason === 'WAITING_OTHER',
    'second occurrence defer reason changed',
  );
  console.log('✓ completing one occurrence does not complete the next one');

  await request(`/api/v1/tasks/${thirdOccurrence.id}?recurrenceScope=THIS`, {
    method: 'DELETE',
    headers: authHeaders,
  });
  console.log('✓ skip one occurrence with THIS scope');

  const thirdAfterSkip = await request(`/api/v1/tasks/today?date=${thirdDate}`, {
    headers: authHeaders,
  });
  assert(!findOccurrence(thirdAfterSkip, thirdDate), 'skipped occurrence should be hidden');
  console.log('✓ skipped occurrence hidden from Today');

  const fourthToday = await request(`/api/v1/tasks/today?date=${fourthDate}`, {
    headers: authHeaders,
  });
  assert(findOccurrence(fourthToday, fourthDate), 'future occurrence should remain after skip');
  console.log('✓ future occurrence remains visible after skip');

  const monthTasks = await request('/api/v1/tasks?type=MONTH&taskType=SCHEDULE&date=2026-08', {
    headers: authHeaders,
  });
  assert(!findOccurrence(monthTasks, thirdDate), 'skipped occurrence should be hidden from month');
  assert(findOccurrence(monthTasks, fourthDate), 'future occurrence should remain in month');
  console.log('✓ skipped occurrence hidden from month list');

  const notificationCandidates = await request(
    '/api/v1/tasks/notification-candidates?from=2026-08-01&to=2026-08-31',
    {
      headers: authHeaders,
    },
  );
  assert(
    !findNotificationCandidate(notificationCandidates, firstDate),
    'completed occurrence should be excluded from notification candidates',
  );
  assert(
    !findNotificationCandidate(notificationCandidates, thirdDate),
    'skipped occurrence should be excluded from notification candidates',
  );
  assert(
    findNotificationCandidate(notificationCandidates, fourthDate),
    'future occurrence should remain in notification candidates',
  );
  console.log('✓ notification candidates exclude completed and skipped occurrences');

  await request(`/api/v1/tasks/${created.id}?recurrenceScope=ALL`, {
    method: 'DELETE',
    headers: authHeaders,
  });
  console.log('✓ delete recurrence with ALL scope');

  console.log('Recurrence action smoke passed. Token and password were not printed.');
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
    console.error(`Recurrence action smoke timed out while connecting to ${apiUrl}`);
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
