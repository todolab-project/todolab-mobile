import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { AppText, Button, Card, EmptyState } from '@/components/ui';
import { TaskCard } from '@/features/tasks';
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
          <AppText tone="primary" variant="caption" weight="bold">
            선택한 날짜
          </AppText>
          <AppText variant="bodyLarge" weight="bold">
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

      {query.isPending ? (
        <Card accessibilityLabel={`${dateLabel} Task를 불러오는 중`} style={styles.stateCard}>
          <ActivityIndicator color={theme.colors.primary} />
          <AppText tone="secondary" variant="label">
            예정과 완료 항목을 불러오고 있어요.
          </AppText>
        </Card>
      ) : query.error ? (
        <Card
          style={[
            styles.errorCard,
            { backgroundColor: theme.colors.dangerSoft, borderColor: theme.colors.danger },
          ]}
        >
          <View style={styles.errorCopy}>
            <AppText tone="danger" variant="label" weight="bold">
              이 날짜의 Task를 불러오지 못했어요
            </AppText>
            <AppText tone="secondary" variant="caption">
              {query.error.message}
            </AppText>
          </View>
          <Button variant="secondary" onPress={() => void query.refetch()}>
            다시 시도
          </Button>
        </Card>
      ) : !hasTasks ? (
        <Card>
          <EmptyState
            title="예정된 항목이 없어요"
            description="다른 날짜를 선택하거나 새 Task의 날짜를 정해보세요."
          />
        </Card>
      ) : !hasFilteredTasks ? (
        <Card>
          <EmptyState
            title="조건에 맞는 항목이 없어요"
            description="다른 필터를 선택하거나 전체 항목을 다시 확인해 보세요."
            action={
              <Button variant="secondary" onPress={() => setActiveFilters([])}>
                필터 초기화
              </Button>
            }
          />
        </Card>
      ) : (
        <>
          {filteredScheduledTasks.length > 0 ? (
            <TaskSection
              title="예정"
              tasks={filteredScheduledTasks}
              onOpen={(taskId) => openTask(taskId)}
            />
          ) : null}
          {filteredDoneTasks.length > 0 ? (
            <TaskSection
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
      <View style={styles.filterHeading}>
        <AppText variant="label" weight="bold">
          범례와 필터
        </AppText>
        {activeFilters.length > 0 ? (
          <AppText tone="primary" variant="caption" weight="semibold">
            {activeFilters.length}개 선택
          </AppText>
        ) : (
          <AppText tone="secondary" variant="caption">
            전체 표시
          </AppText>
        )}
      </View>
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
              onPress={() => onToggle(filter)}
              style={({ pressed }) => [
                styles.filterChip,
                {
                  backgroundColor: selected ? appearance.backgroundColor : theme.colors.surface,
                  borderColor: selected ? appearance.color : theme.colors.border,
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
  title: string;
  tasks: TaskResponse[];
  onOpen: (taskId: number) => void;
};

function TaskSection({ title, tasks, onOpen }: TaskSectionProps) {
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
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onOpen={() => onOpen(task.id)} />
        ))}
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
  stateCard: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing[3],
    justifyContent: 'center',
    minHeight: 96,
  },
  errorCard: {
    gap: spacing[3],
  },
  errorCopy: {
    gap: spacing[1],
  },
  filterCard: {
    gap: spacing[3],
    padding: spacing[3],
  },
  filterHeading: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    gap: 0,
  },
});
