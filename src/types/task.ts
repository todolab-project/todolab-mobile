import type { LocalDateString, LocalDateTimeString } from './date-time';

export type TaskType = 'SCHEDULE' | 'TODO' | 'IDEA';
export type TaskStatus = 'INBOX' | 'TODAY' | 'DONE';
export type TaskQueryType = 'DAY' | 'WEEK' | 'MONTH';
export type TaskSearchDateField = 'RELEVANT' | 'PLANNED' | 'SCHEDULED' | 'COMPLETED' | 'CREATED';
export type TaskSearchSort =
  | 'RELEVANCE'
  | 'DATE_DESC'
  | 'DATE_ASC'
  | 'UPDATED_DESC'
  | 'CREATED_DESC';
export type TaskSearchDateSource = 'PLANNED' | 'SCHEDULED' | 'COMPLETED' | 'CREATED';
export type TodayOrderDirection = 'UP' | 'DOWN';
export type RecurrenceEditScope = 'THIS' | 'THIS_AND_FUTURE' | 'ALL';
export type RecurrenceException = 'SKIPPED' | 'MOVED' | 'MODIFIED';
export type DeferReason =
  | 'TOO_BIG'
  | 'NOT_IMPORTANT'
  | 'NEED_INFO'
  | 'NO_TIME'
  | 'ETC';

export const deferReasonLabels: Record<DeferReason, string> = {
  TOO_BIG: '너무 큼',
  NOT_IMPORTANT: '중요하지 않음',
  NEED_INFO: '정보 필요',
  NO_TIME: '시간 부족',
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
  recurrenceRule?: string | null;
  recurrenceTimeZone?: string | null;
  recurrenceStartAt?: LocalDateTimeString | null;
  recurrenceUntil?: LocalDateString | null;
  recurrenceCount?: number | null;
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
  recurrenceSeriesId?: number | null;
  recurrenceRule?: string | null;
  recurrenceTimeZone?: string | null;
  recurrenceStartAt?: LocalDateTimeString | null;
  recurrenceUntil?: LocalDateString | null;
  recurrenceCount?: number | null;
  occurrenceDate?: LocalDateString | null;
  originalOccurrenceDate?: LocalDateString | null;
  recurrenceException?: RecurrenceException | null;
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

export type TaskSearchQuery = {
  q?: string;
  statuses?: TaskStatus[];
  taskTypes?: TaskType[];
  category?: string;
  ddayGoalId?: number;
  hasDday?: boolean;
  allDay?: boolean;
  dateField?: TaskSearchDateField;
  dateFrom?: LocalDateString;
  dateTo?: LocalDateString;
  sort?: TaskSearchSort;
  cursor?: string;
  limit?: number;
};

export type TaskSearchItem = {
  task: TaskResponse;
  relevantDate: LocalDateString;
  dateSource: TaskSearchDateSource;
};

export type TaskSearchPage = {
  items: TaskSearchItem[];
  nextCursor: string | null;
  hasNext: boolean;
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
