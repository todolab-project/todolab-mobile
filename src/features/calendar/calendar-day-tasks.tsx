import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { AppText, Button, Card, EmptyState, InlineNotice, ListSkeleton } from '@/components/ui';
import { ScheduleCard, TaskCard, useCompleteTask } from '@/features/tasks';
import { radii, sizes, spacing, useAppTheme } from '@/theme';
import type { LocalDateString, TaskResponse } from '@/types';
import { formatDateLabel } from '@/utils';

import {
  calendarTaskFilterLabels,
  countCalendarTaskFilters,
  filterCalendarTasks,
  type CalendarTaskFilter,
} from './calendar-task-filter';
import { useCalendarDayTasks } from './use-calendar-day-tasks';

type CalendarDayTasksProps = {
  date: LocalDateString;
};

export function CalendarDayTasks({ date }: CalendarDayTasksProps) {
  const router = useRouter();
  const theme = useAppTheme();
  const completeTask = useCompleteTask(date);
  const [activeFilters, setActiveFilters] = useState<CalendarTaskFilter[]>([]);
  const query = useCalendarDayTasks(date);
  const { scheduledTasks, doneTasks } = query;
  const tasks = [...scheduledTasks, ...doneTasks];
  const filterCounts = countCalendarTaskFilters(tasks);
  const filteredTasks = filterCalendarTasks(tasks, activeFilters);
  const filteredScheduledTasks = filteredTasks.filter((task) => task.status !== 'DONE');
  const filteredDoneTasks = filteredTasks.filter((task) => task.status === 'DONE');
  const hasTasks = tasks.length > 0;
  const hasFilteredTasks = filteredTasks.length > 0;
  const dateLabel = formatDateLabel(date, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });
  const openTask = (taskId: number) => {
    router.push({ pathname: '/tasks/[taskId]', params: { taskId: String(taskId) } });
  };
  const toggleFilter = (filter: CalendarTaskFilter) => {
    setActiveFilters((current) =>
      current.includes(filter)
        ? current.filter((activeFilter) => activeFilter !== filter)
        : [...current, filter],
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <View style={styles.headingCopy}>
          <AppText variant="label" weight="bold">
            {dateLabel}
          </AppText>
        </View>
        {query.isFetching && !query.isPending ? (
          <ActivityIndicator color={theme.colors.primary} size="small" />
        ) : null}
      </View>

      {!query.isPending && !query.error && hasTasks ? (
        <CalendarTaskFilters
          activeFilters={activeFilters}
          counts={filterCounts}
          onToggle={toggleFilter}
        />
      ) : null}

      {completeTask.error ? (
        <InlineNotice message={completeTask.error.message} tone="danger" />
      ) : null}

      {query.isPending ? (
        <ListSkeleton accessibilityLabel={`${dateLabel} Task를 불러오는 중`} count={2} />
      ) : query.error ? (
        <InlineNotice
          action={
            <Button size="compact" variant="ghost" onPress={() => void query.refetch()}>
              다시 시도
            </Button>
          }
          message={query.error.message}
          title="이 날짜의 Task를 불러오지 못했어요"
          tone="danger"
        />
      ) : !hasTasks ? (
        <EmptyState title="예정된 항목이 없어요" description="다른 날짜를 선택해 보세요." />
      ) : !hasFilteredTasks ? (
        <EmptyState
          title="조건에 맞는 항목이 없어요"
          description="필터를 초기화하면 전체 항목을 볼 수 있어요."
          action={
            <Button variant="secondary" onPress={() => setActiveFilters([])}>
              필터 초기화
            </Button>
          }
        />
      ) : (
        <>
          {filteredScheduledTasks.length > 0 ? (
            <TaskSection
              completingTaskId={completeTask.isPending ? completeTask.variables : undefined}
              referenceDate={date}
              title="예정"
              tasks={filteredScheduledTasks}
              onComplete={(taskId) => completeTask.mutate(taskId)}
              onOpen={(taskId) => openTask(taskId)}
            />
          ) : null}
          {filteredDoneTasks.length > 0 ? (
            <TaskSection
              referenceDate={date}
              title="완료"
              tasks={filteredDoneTasks}
              onOpen={(taskId) => openTask(taskId)}
            />
          ) : null}
        </>
      )}
    </View>
  );
}

type CalendarTaskFiltersProps = {
  activeFilters: CalendarTaskFilter[];
  counts: Record<CalendarTaskFilter, number>;
  onToggle: (filter: CalendarTaskFilter) => void;
};

const calendarTaskFilters = Object.keys(calendarTaskFilterLabels) as CalendarTaskFilter[];

function CalendarTaskFilters({ activeFilters, counts, onToggle }: CalendarTaskFiltersProps) {
  const theme = useAppTheme();
  const [focusedFilter, setFocusedFilter] = useState<CalendarTaskFilter | null>(null);
  const appearances = {
    schedule: {
      color: theme.colors.primary,
      backgroundColor: theme.colors.primarySoft,
      tone: 'primary' as const,
    },
    done: {
      color: theme.colors.success,
      backgroundColor: theme.colors.successSoft,
      tone: 'success' as const,
    },
    deferred: {
      color: theme.colors.warning,
      backgroundColor: theme.colors.warningSoft,
      tone: 'warning' as const,
    },
    dday: {
      color: theme.colors.textSecondary,
      backgroundColor: theme.colors.surfaceMuted,
      tone: 'default' as const,
    },
  };

  return (
    <Card variant="muted" style={styles.filterCard}>
      <View style={styles.filterList}>
        {calendarTaskFilters.map((filter) => {
          const selected = activeFilters.includes(filter);
          const appearance = appearances[filter];

          return (
            <Pressable
              accessibilityLabel={`${calendarTaskFilterLabels[filter]} ${counts[filter]}개`}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: selected }}
              key={filter}
              onBlur={() => setFocusedFilter(null)}
              onFocus={() => setFocusedFilter(filter)}
              onPress={() => onToggle(filter)}
              style={({ pressed }) => [
                styles.filterChip,
                {
                  backgroundColor: selected ? appearance.backgroundColor : theme.colors.surface,
                  borderColor:
                    focusedFilter === filter
                      ? theme.colors.primary
                      : selected
                        ? appearance.color
                        : theme.colors.border,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <View style={[styles.filterDot, { backgroundColor: appearance.color }]} />
              <AppText
                tone={selected ? appearance.tone : 'secondary'}
                variant="label"
                weight={selected ? 'bold' : 'semibold'}
              >
                {calendarTaskFilterLabels[filter]}
              </AppText>
              <AppText tone="muted" variant="caption" weight="semibold">
                {counts[filter]}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </Card>
  );
}

type TaskSectionProps = {
  referenceDate: LocalDateString;
  title: string;
  tasks: TaskResponse[];
  completingTaskId?: number;
  onComplete?: (taskId: number) => void;
  onOpen: (taskId: number) => void;
};

function TaskSection({
  referenceDate,
  title,
  tasks,
  completingTaskId,
  onComplete,
  onOpen,
}: TaskSectionProps) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeading}>
        <AppText variant="label" weight="bold">
          {title}
        </AppText>
        <AppText tone="secondary" variant="caption" weight="semibold">
          {tasks.length}개
        </AppText>
      </View>
      <View style={styles.taskList}>
        {tasks.map((task) =>
          task.type === 'SCHEDULE' ? (
            <ScheduleCard
              completionDisabled={completingTaskId !== undefined}
              isCompleting={completingTaskId === task.id}
              key={task.id}
              referenceDate={referenceDate}
              task={task}
              onComplete={onComplete ? () => onComplete(task.id) : undefined}
              onOpen={() => onOpen(task.id)}
            />
          ) : (
            <TaskCard
              completionDisabled={completingTaskId !== undefined}
              isCompleting={completingTaskId === task.id}
              key={task.id}
              task={task}
              onComplete={onComplete ? () => onComplete(task.id) : undefined}
              onOpen={() => onOpen(task.id)}
            />
          ),
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing[4],
  },
  heading: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing[3],
  },
  headingCopy: {
    flex: 1,
    gap: spacing[1],
  },
  filterCard: {
    padding: spacing[2],
  },
  filterList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  filterChip: {
    alignItems: 'center',
    borderRadius: radii.full,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing[2],
    minHeight: sizes.touchTarget,
    paddingHorizontal: spacing[3],
  },
  filterDot: {
    borderRadius: radii.full,
    height: 8,
    width: 8,
  },
  section: {
    gap: spacing[3],
  },
  sectionHeading: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  taskList: {
    gap: spacing[1],
  },
});
