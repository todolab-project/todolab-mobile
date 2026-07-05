import type { TaskResponse, TaskType } from '@/types';

import {
  getTodayLoadGuidance,
  getTodaySchedulePreview,
  reorderTodayTasks,
  splitTodayTasks,
} from '../today-task-sections';

function createTask(id: number, type: TaskType): TaskResponse {
  return {
    id,
    type,
    title: `Task ${id}`,
    description: null,
    startAt: null,
    endAt: null,
    allDay: false,
    unscheduled: false,
    category: null,
    status: 'TODAY',
    plannedDate: '2026-06-28',
    targetDate: null,
    todayOrder: id,
    completedAt: null,
    carryOverCount: 0,
    staleCarryOver: false,
    deferReason: null,
    deferReasonLabel: null,
    ddayGoalId: null,
    ddayGoalTitle: null,
    ddayGoalTargetDate: null,
    ddayDaysLeft: null,
    createdAt: '2026-06-28T09:00:00',
    updatedAt: null,
  };
}

describe('splitTodayTasks', () => {
  it('일정과 실행 항목을 원래 순서를 유지해 분리한다', () => {
    const schedule = createTask(1, 'SCHEDULE');
    const todo = createTask(2, 'TODO');
    const idea = createTask(3, 'IDEA');

    expect(splitTodayTasks([schedule, todo, idea])).toEqual({
      scheduleTasks: [schedule],
      executionTasks: [todo, idea],
    });
  });

  it('범위 조회에서 같은 일정 ID가 반복되어도 한 번만 표시한다', () => {
    const schedule = createTask(1, 'SCHEDULE');
    const duplicate = { ...schedule, title: '중복 응답' };

    expect(splitTodayTasks([schedule, duplicate])).toEqual({
      scheduleTasks: [schedule],
      executionTasks: [],
    });
  });
});

describe('reorderTodayTasks', () => {
  it('일정을 건드리지 않고 실행 항목을 위로 한 칸 이동한다', () => {
    const first = createTask(1, 'TODO');
    const schedule = createTask(2, 'SCHEDULE');
    const second = createTask(3, 'IDEA');

    expect(reorderTodayTasks([first, schedule, second], second.id, 'UP')).toEqual([
      second,
      schedule,
      first,
    ]);
  });

  it('일정 ID로 재정렬을 요청해도 목록을 변경하지 않는다', () => {
    const first = createTask(1, 'TODO');
    const schedule = createTask(2, 'SCHEDULE');
    const tasks = [first, schedule];

    expect(reorderTodayTasks(tasks, schedule.id, 'UP')).toBe(tasks);
  });

  it('목록 경계를 벗어나는 이동은 기존 목록을 유지한다', () => {
    const first = createTask(1, 'TODO');
    const second = createTask(2, 'TODO');
    const tasks = [first, second];

    expect(reorderTodayTasks(tasks, first.id, 'UP')).toBe(tasks);
    expect(reorderTodayTasks(tasks, second.id, 'DOWN')).toBe(tasks);
  });
});

describe('getTodaySchedulePreview', () => {
  it('일정이 많아도 첫 두 개만 Today 상단에 표시한다', () => {
    const schedules = [1, 2, 3].map((id) => createTask(id, 'SCHEDULE'));

    expect(getTodaySchedulePreview(schedules)).toEqual(schedules.slice(0, 2));
  });
});

describe('getTodayLoadGuidance', () => {
  it('실행 항목이 권장 개수 이하면 안내하지 않는다', () => {
    expect(getTodayLoadGuidance(5, 2)).toBeNull();
  });

  it('일정은 제외하고 초과한 실행 항목 개수를 안내한다', () => {
    expect(getTodayLoadGuidance(7, 2)).toEqual({
      excessCount: 2,
      title: '오늘 실행할 일이 7개예요',
      description:
        '권장 개수보다 2개 많아요. 꼭 끝낼 일 5개만 먼저 남겨보세요. 시간 일정 2개는 이 개수에서 제외했어요.',
    });
  });
});
