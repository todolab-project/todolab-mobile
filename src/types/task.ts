import type { LocalDateString, LocalDateTimeString } from './date-time';

export type TaskType = 'SCHEDULE' | 'TODO' | 'IDEA';
export type TaskStatus = 'INBOX' | 'TODAY' | 'DONE';
export type TaskQueryType = 'DAY' | 'WEEK' | 'MONTH';
export type TodayOrderDirection = 'UP' | 'DOWN';
export type DeferReason =
  | 'TOO_BIG'
  | 'NOT_NEEDED_NOW'
  | 'AVOIDING'
  | 'NO_DEADLINE'
  | 'WAITING_OTHER'
  | 'ETC';

export const deferReasonLabels: Record<DeferReason, string> = {
  TOO_BIG: '너무 큼',
  NOT_NEEDED_NOW: '지금 필요 없음',
  AVOIDING: '회피 중',
  NO_DEADLINE: '마감 없음',
  WAITING_OTHER: '대기 중',
  ETC: '기타',
};

export const taskLimits = {
  title: 30,
  description: 300,
  category: 30,
} as const;

export type TaskUpsertRequest = {
  title: string;
  description?: string | null;
  type?: TaskType | null;
  startAt?: LocalDateTimeString | null;
  endAt?: LocalDateTimeString | null;
  category?: string | null;
  allDay: boolean;
};

export type TaskResponse = {
  id: number;
  type: TaskType;
  title: string;
  description: string | null;
  startAt: LocalDateTimeString | null;
  endAt: LocalDateTimeString | null;
  allDay: boolean;
  unscheduled: boolean;
  category: string | null;
  status: TaskStatus;
  plannedDate: LocalDateString | null;
  targetDate: LocalDateString | null;
  todayOrder: number | null;
  completedAt: LocalDateTimeString | null;
  carryOverCount: number;
  staleCarryOver: boolean;
  deferReason: DeferReason | null;
  deferReasonLabel: string | null;
  ddayGoalId: number | null;
  ddayGoalTitle: string | null;
  ddayGoalTargetDate: LocalDateString | null;
  ddayDaysLeft: number | null;
  createdAt: LocalDateTimeString;
  updatedAt: LocalDateTimeString | null;
};

export type TaskRecommendationResponse = {
  task: TaskResponse;
  reason: string;
};

export type TaskCategoryGroupResponse = {
  category: string;
  tasks: TaskResponse[];
};

export type TaskListQuery = {
  type: TaskQueryType;
  taskType?: TaskType;
  date: LocalDateString;
};

export type TaskDateQuery = {
  date: LocalDateString;
};

export type CompleteTaskQuery = {
  completedAt?: LocalDateTimeString;
};

export type ReorderTodayQuery = TaskDateQuery & {
  direction: TodayOrderDirection;
};

export type SetDeferReasonQuery = {
  reason: DeferReason;
};

export type ConnectDdayGoalQuery = {
  ddayGoalId: number;
};
