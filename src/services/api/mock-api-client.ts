import { ApiClientError } from './api-error';

import type {
  DdayGoalRequest,
  DdayGoalResponse,
  DeferReason,
  LocalDateString,
  TaskRecommendationResponse,
  TaskQueryType,
  TaskResponse,
  TaskStatus,
  TaskUpsertRequest,
  TodayOrderDirection,
} from '@/types';
import { deferReasonLabels } from '@/types';
import { doesScheduleOverlapDate, shiftLocalDate, toApiLocalDate } from '@/utils';

type MockQueryValue = string | number | boolean | null | undefined;
type MockQueryParams = Record<string, MockQueryValue>;
type MockApiOptions = {
  query?: MockQueryParams;
  signal?: AbortSignal;
};

const now = '2026-06-30T09:00:00';
const today = toApiLocalDate();

let nextTaskId = 100;
let nextGoalId = 10;

const ddayGoals: DdayGoalResponse[] = [
  {
    id: 1,
    title: 'MVP 데모',
    targetDate: '2026-07-15',
    daysLeft: 15,
    createdAt: now,
  },
  {
    id: 2,
    title: '앱스토어 제출',
    targetDate: '2026-08-01',
    daysLeft: 32,
    createdAt: now,
  },
];

const tasks: TaskResponse[] = [
  createTask({
    id: 1,
    title: 'Today 화면 첫 viewport 확인',
    description: 'compact header 적용 뒤 실행 목록이 바로 보이는지 확인',
    status: 'TODAY',
    plannedDate: today,
    todayOrder: 1,
    ddayGoalId: 1,
    ddayGoalTitle: 'MVP 데모',
    ddayGoalTargetDate: '2026-07-15',
    ddayDaysLeft: 15,
  }),
  createTask({
    id: 2,
    title: '빠른 기록 composer 축소안 정리',
    category: 'UI/UX',
    status: 'TODAY',
    plannedDate: today,
    todayOrder: 2,
  }),
  createTask({
    id: 3,
    title: '백엔드 연동 smoke test 체크리스트',
    category: 'API',
    status: 'TODAY',
    plannedDate: today,
    todayOrder: 3,
  }),
  createTask({
    id: 4,
    type: 'SCHEDULE',
    title: '백엔드 계약 확인 미팅',
    category: '일정',
    status: 'TODAY',
    plannedDate: today,
    startAt: `${today}T14:00:00`,
    endAt: `${today}T14:30:00`,
    todayOrder: null,
  }),
  createTask({
    id: 11,
    type: 'SCHEDULE',
    title: '여러 날에 걸친 일정 UX 점검',
    category: '일정',
    status: 'TODAY',
    plannedDate: shiftLocalDate(today, -1) ?? today,
    startAt: `${shiftLocalDate(today, -1) ?? today}T09:00:00`,
    endAt: `${shiftLocalDate(today, 1) ?? today}T18:00:00`,
    todayOrder: null,
  }),
  createTask({
    id: 5,
    title: '지난주 미완료 정리',
    category: '정리',
    status: 'INBOX',
    plannedDate: '2026-06-28',
    carryOverCount: 2,
    staleCarryOver: true,
    deferReason: 'TOO_BIG',
    deferReasonLabel: deferReasonLabels.TOO_BIG,
  }),
  createTask({
    id: 6,
    title: '검색 필터 UX 문구 다듬기',
    category: '검색',
    status: 'INBOX',
    plannedDate: null,
  }),
  createTask({
    id: 7,
    title: 'D-Day 연결 Task 흐름 검증',
    category: 'D-Day',
    status: 'DONE',
    plannedDate: today,
    completedAt: `${today}T10:30:00`,
    ddayGoalId: 1,
    ddayGoalTitle: 'MVP 데모',
    ddayGoalTargetDate: '2026-07-15',
    ddayDaysLeft: 15,
  }),
  createTask({
    id: 8,
    title: '설정 화면 항목 우선순위 스케치',
    category: 'More',
    status: 'DONE',
    plannedDate: today,
    completedAt: `${today}T11:10:00`,
  }),
];

function createTask(
  overrides: Partial<TaskResponse> & { id: number; title: string },
): TaskResponse {
  return {
    id: overrides.id,
    type: overrides.type ?? 'TODO',
    title: overrides.title,
    description: overrides.description ?? null,
    startAt: overrides.startAt ?? null,
    endAt: overrides.endAt ?? null,
    allDay: overrides.allDay ?? false,
    unscheduled: overrides.plannedDate === null,
    category: overrides.category ?? null,
    status: overrides.status ?? 'INBOX',
    plannedDate: overrides.plannedDate ?? null,
    targetDate: overrides.targetDate ?? null,
    todayOrder: overrides.todayOrder ?? null,
    completedAt: overrides.completedAt ?? null,
    carryOverCount: overrides.carryOverCount ?? 0,
    staleCarryOver: overrides.staleCarryOver ?? false,
    deferReason: overrides.deferReason ?? null,
    deferReasonLabel: overrides.deferReasonLabel ?? null,
    ddayGoalId: overrides.ddayGoalId ?? null,
    ddayGoalTitle: overrides.ddayGoalTitle ?? null,
    ddayGoalTargetDate: overrides.ddayGoalTargetDate ?? null,
    ddayDaysLeft: overrides.ddayDaysLeft ?? null,
    createdAt: overrides.createdAt ?? now,
    updatedAt: overrides.updatedAt ?? null,
  };
}

function cloneTask(task: TaskResponse): TaskResponse {
  return { ...task };
}

function cloneGoal(goal: DdayGoalResponse): DdayGoalResponse {
  return { ...goal, daysLeft: getDaysLeft(goal.targetDate) };
}

function requireNotAborted(signal?: AbortSignal) {
  if (signal?.aborted) {
    throw new ApiClientError('요청이 취소되었습니다.', { kind: 'cancelled' });
  }
}

function getDate(query?: MockQueryParams) {
  return String(query?.date ?? today) as LocalDateString;
}

function getTask(taskId: number) {
  const task = tasks.find((item) => item.id === taskId);

  if (!task) {
    throw new ApiClientError('Mock Task를 찾을 수 없습니다.', { kind: 'http', status: 404 });
  }

  return task;
}

function getGoal(goalId: number) {
  const goal = ddayGoals.find((item) => item.id === goalId);

  if (!goal) {
    throw new ApiClientError('Mock D-Day 목표를 찾을 수 없습니다.', { kind: 'http', status: 404 });
  }

  return goal;
}

function getTaskId(path: string) {
  const match = path.match(/^\/api\/tasks\/(\d+)/);

  return match ? Number(match[1]) : null;
}

function getGoalId(path: string) {
  const match = path.match(/^\/api\/ddays\/(\d+)/);

  return match ? Number(match[1]) : null;
}

function getDaysLeft(targetDate: LocalDateString) {
  const todayTime = new Date(`${today}T00:00:00`).getTime();
  const targetTime = new Date(`${targetDate}T00:00:00`).getTime();

  return Math.ceil((targetTime - todayTime) / 86_400_000);
}

function applyTaskRequest(task: TaskResponse, request: TaskUpsertRequest) {
  task.title = request.title;
  task.description = request.description ?? null;
  task.category = request.category ?? null;
  task.type = request.type ?? 'TODO';
  task.allDay = request.allDay;
  task.startAt = request.startAt ?? null;
  task.endAt = request.endAt ?? null;
  task.updatedAt = now;

  return cloneTask(task);
}

function setTaskStatus(task: TaskResponse, status: TaskStatus, date?: LocalDateString) {
  task.status = status;
  task.plannedDate = status === 'INBOX' ? null : (date ?? task.plannedDate);
  task.unscheduled = task.plannedDate === null;
  task.completedAt = status === 'DONE' ? `${date ?? today}T12:00:00` : null;
  task.todayOrder = status === 'TODAY' ? getNextTodayOrder(date ?? today) : null;
  task.updatedAt = now;

  return cloneTask(task);
}

function getNextTodayOrder(date: LocalDateString) {
  const orders = tasks
    .filter((task) => task.status === 'TODAY' && task.plannedDate === date)
    .map((task) => task.todayOrder ?? 0);

  return Math.max(0, ...orders) + 1;
}

function getTaskRange(type: TaskQueryType, date: LocalDateString) {
  if (type === 'DAY') return [date];

  if (type === 'WEEK') {
    const [year, month, day] = date.split('-').map(Number);
    const weekday = new Date(Date.UTC(year, month - 1, day, 12)).getUTCDay();
    const monday = shiftLocalDate(date, -((weekday + 6) % 7)) ?? date;
    return Array.from({ length: 7 }, (_, index) => shiftLocalDate(monday, index) ?? monday);
  }

  const month = date.slice(0, 7);
  return Array.from({ length: 31 }, (_, index) => `${month}-${String(index + 1).padStart(2, '0')}`)
    .filter((value) => !Number.isNaN(new Date(`${value}T12:00:00Z`).getTime()))
    .map((value) => value as LocalDateString);
}

function sortTodayTasks(left: TaskResponse, right: TaskResponse) {
  if (left.type === 'SCHEDULE' && right.type !== 'SCHEDULE') {
    return -1;
  }

  if (left.type !== 'SCHEDULE' && right.type === 'SCHEDULE') {
    return 1;
  }

  return (left.todayOrder ?? 999) - (right.todayOrder ?? 999);
}

function reorderToday(taskId: number, date: LocalDateString, direction: TodayOrderDirection) {
  const todayTasks = tasks
    .filter(
      (task) => task.status === 'TODAY' && task.plannedDate === date && task.type !== 'SCHEDULE',
    )
    .sort((left, right) => (left.todayOrder ?? 999) - (right.todayOrder ?? 999));
  const index = todayTasks.findIndex((task) => task.id === taskId);

  if (index < 0) {
    return cloneTask(getTask(taskId));
  }

  const targetIndex = direction === 'UP' ? index - 1 : index + 1;

  if (targetIndex < 0 || targetIndex >= todayTasks.length) {
    return cloneTask(todayTasks[index]);
  }

  const currentOrder = todayTasks[index].todayOrder;
  todayTasks[index].todayOrder = todayTasks[targetIndex].todayOrder;
  todayTasks[targetIndex].todayOrder = currentOrder;

  return cloneTask(todayTasks[targetIndex]);
}

function connectGoal(task: TaskResponse, goalId: number) {
  const goal = getGoal(goalId);

  task.ddayGoalId = goal.id;
  task.ddayGoalTitle = goal.title;
  task.ddayGoalTargetDate = goal.targetDate;
  task.ddayDaysLeft = getDaysLeft(goal.targetDate);
  task.updatedAt = now;

  return cloneTask(task);
}

function disconnectGoal(task: TaskResponse) {
  task.ddayGoalId = null;
  task.ddayGoalTitle = null;
  task.ddayGoalTargetDate = null;
  task.ddayDaysLeft = null;
  task.updatedAt = now;

  return cloneTask(task);
}

export const mockApiClient = {
  async get<T>(path: string, options: MockApiOptions = {}) {
    requireNotAborted(options.signal);

    if (path === '/api/tasks') {
      const date = getDate(options.query);
      const type = String(options.query?.type ?? 'DAY') as TaskQueryType;
      const range = getTaskRange(type, date);

      return tasks
        .filter(
          (task) =>
            task.type === 'SCHEDULE' &&
            range.some((rangeDate) => doesScheduleOverlapDate(task, rangeDate)),
        )
        .map(cloneTask) as T;
    }

    if (path === '/api/tasks/today') {
      const date = getDate(options.query);

      return tasks
        .filter(
          (task) =>
            task.status === 'TODAY' &&
            (task.plannedDate === date || doesScheduleOverlapDate(task, date)),
        )
        .sort(sortTodayTasks)
        .map(cloneTask) as T;
    }

    if (path === '/api/tasks/today/recommendations') {
      const recommendations: TaskRecommendationResponse[] = tasks
        .filter((task) => task.status === 'INBOX' && !task.staleCarryOver)
        .slice(0, 3)
        .map((task) => ({
          task: cloneTask(task),
          reason: 'Mock mode 추천: 날짜 없이 남아 있어 오늘 가볍게 처리하기 좋아요.',
        }));

      return recommendations as T;
    }

    if (path === '/api/tasks/done') {
      const date = getDate(options.query);

      return tasks
        .filter((task) => task.status === 'DONE' && task.plannedDate === date)
        .map(cloneTask) as T;
    }

    if (path === '/api/tasks/stale') {
      return tasks.filter((task) => task.staleCarryOver).map(cloneTask) as T;
    }

    if (path === '/api/tasks/inbox') {
      return tasks
        .filter((task) => task.status === 'INBOX' && !task.staleCarryOver)
        .map(cloneTask) as T;
    }

    if (path === '/api/ddays') {
      return ddayGoals.map(cloneGoal) as T;
    }

    const taskId = getTaskId(path);
    if (taskId && path === `/api/tasks/${taskId}`) {
      return cloneTask(getTask(taskId)) as T;
    }

    const goalId = getGoalId(path);
    if (goalId && path === `/api/ddays/${goalId}/tasks`) {
      return tasks.filter((task) => task.ddayGoalId === goalId).map(cloneTask) as T;
    }

    throw new ApiClientError(`Mock API가 지원하지 않는 GET 요청입니다. (${path})`, {
      kind: 'configuration',
    });
  },

  async post<T>(path: string, body?: unknown, options: MockApiOptions = {}) {
    requireNotAborted(options.signal);

    if (path === '/api/tasks') {
      const request = body as TaskUpsertRequest;
      const task = createTask({
        id: nextTaskId,
        title: request.title,
        description: request.description ?? null,
        type: request.type ?? 'TODO',
        startAt: request.startAt ?? null,
        endAt: request.endAt ?? null,
        allDay: request.allDay,
        category: request.category ?? null,
        status: 'INBOX',
      });

      nextTaskId += 1;
      tasks.unshift(task);

      return cloneTask(task) as T;
    }

    if (path === '/api/ddays') {
      const request = body as DdayGoalRequest;
      const goal: DdayGoalResponse = {
        id: nextGoalId,
        title: request.title,
        targetDate: request.targetDate,
        daysLeft: getDaysLeft(request.targetDate),
        createdAt: now,
      };

      nextGoalId += 1;
      ddayGoals.unshift(goal);

      return cloneGoal(goal) as T;
    }

    throw new ApiClientError(`Mock API가 지원하지 않는 POST 요청입니다. (${path})`, {
      kind: 'configuration',
    });
  },

  async put<T>(path: string, body?: unknown, options: MockApiOptions = {}) {
    requireNotAborted(options.signal);

    const taskId = getTaskId(path);
    if (taskId && path === `/api/tasks/${taskId}`) {
      return applyTaskRequest(getTask(taskId), body as TaskUpsertRequest) as T;
    }

    throw new ApiClientError(`Mock API가 지원하지 않는 PUT 요청입니다. (${path})`, {
      kind: 'configuration',
    });
  },

  async patch<T>(path: string, _body?: unknown, options: MockApiOptions = {}) {
    requireNotAborted(options.signal);

    const taskId = getTaskId(path);
    if (!taskId) {
      throw new ApiClientError(`Mock API가 지원하지 않는 PATCH 요청입니다. (${path})`, {
        kind: 'configuration',
      });
    }

    const task = getTask(taskId);
    const date = getDate(options.query);

    if (path === `/api/tasks/${taskId}/done`) {
      return setTaskStatus(task, 'DONE', date) as T;
    }

    if (path === `/api/tasks/${taskId}/today`) {
      return setTaskStatus(task, 'TODAY', date) as T;
    }

    if (path === `/api/tasks/${taskId}/inbox`) {
      return setTaskStatus(task, 'INBOX') as T;
    }

    if (path === `/api/tasks/${taskId}/today-order`) {
      return reorderToday(
        taskId,
        date,
        String(options.query?.direction ?? 'DOWN') as TodayOrderDirection,
      ) as T;
    }

    if (path === `/api/tasks/${taskId}/defer-reason`) {
      const reason = String(options.query?.reason) as DeferReason;
      task.deferReason = reason;
      task.deferReasonLabel = deferReasonLabels[reason] ?? null;
      task.updatedAt = now;

      return cloneTask(task) as T;
    }

    if (path === `/api/tasks/${taskId}/dday-goal`) {
      return connectGoal(task, Number(options.query?.ddayGoalId)) as T;
    }

    if (path === `/api/tasks/${taskId}/done/cancel`) {
      return setTaskStatus(task, 'TODAY', date) as T;
    }

    throw new ApiClientError(`Mock API가 지원하지 않는 PATCH 요청입니다. (${path})`, {
      kind: 'configuration',
    });
  },

  async delete<T>(path: string, options: MockApiOptions = {}) {
    requireNotAborted(options.signal);

    const taskId = getTaskId(path);
    if (taskId && path === `/api/tasks/${taskId}`) {
      const index = tasks.findIndex((task) => task.id === taskId);

      if (index >= 0) {
        tasks.splice(index, 1);
      }

      return null as T;
    }

    if (taskId && path === `/api/tasks/${taskId}/defer-reason`) {
      const task = getTask(taskId);

      task.deferReason = null;
      task.deferReasonLabel = null;
      task.updatedAt = now;

      return cloneTask(task) as T;
    }

    if (taskId && path === `/api/tasks/${taskId}/dday-goal`) {
      return disconnectGoal(getTask(taskId)) as T;
    }

    const goalId = getGoalId(path);
    if (goalId && path === `/api/ddays/${goalId}`) {
      const index = ddayGoals.findIndex((goal) => goal.id === goalId);

      if (index >= 0) {
        ddayGoals.splice(index, 1);
      }

      tasks.forEach((task) => {
        if (task.ddayGoalId === goalId) {
          disconnectGoal(task);
        }
      });

      return null as T;
    }

    throw new ApiClientError(`Mock API가 지원하지 않는 DELETE 요청입니다. (${path})`, {
      kind: 'configuration',
    });
  },
};
