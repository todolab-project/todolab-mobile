import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText, Button, Card } from '@/components/ui';
import { spacing, useAppTheme, useMobileLayout } from '@/theme';
import type { LocalDateString, TaskResponse } from '@/types';
import { formatDateLabel, shiftLocalDate, toApiLocalDate } from '@/utils';

import { useChangeTaskDate } from './use-change-task-date';

type TaskDateQuickActionsProps = {
  task: TaskResponse;
};

export function TaskDateQuickActions({ task }: TaskDateQuickActionsProps) {
  const theme = useAppTheme();
  const { isCompact } = useMobileLayout();
  const changeTaskDate = useChangeTaskDate();
  const [feedback, setFeedback] = useState<string | null>(null);
  const today = toApiLocalDate();
  const tomorrow = shiftLocalDate(today, 1);
  const nextWeek = shiftLocalDate(today, 7);
  const dateActions = [
    { label: '오늘', date: today },
    { label: '내일', date: tomorrow },
    { label: '7일 후', date: nextWeek },
  ].filter((action): action is { label: string; date: LocalDateString } => action.date !== null);

  if (task.status === 'DONE') {
    return null;
  }

  const changeDate = (targetDate: LocalDateString | null) => {
    setFeedback(null);
    changeTaskDate.mutate(
      { taskId: task.id, targetDate },
      {
        onSuccess: () => {
          setFeedback(
            targetDate
              ? `${formatDateLabel(targetDate)}로 옮겼어요.`
              : '날짜를 비우고 기록함으로 옮겼어요.',
          );
        },
      },
    );
  };

  return (
    <Card variant="sheet" style={styles.card}>
      <View style={styles.heading}>
        <AppText variant="bodyLarge" weight="bold">
          날짜 빠른 변경
        </AppText>
        <AppText tone="secondary" variant="caption">
          현재 {task.plannedDate ? formatDateLabel(task.plannedDate) : '날짜 없음'}
        </AppText>
      </View>

      <View style={styles.actions}>
        {dateActions.map((action) => {
          const selected = task.plannedDate === action.date && task.status === 'TODAY';
          const loading =
            changeTaskDate.isPending && changeTaskDate.variables?.targetDate === action.date;

          return (
            <Button
              accessibilityState={{ selected }}
              disabled={changeTaskDate.isPending || selected}
              key={action.date}
              loading={loading}
              variant={selected ? 'secondary' : 'ghost'}
              onPress={() => changeDate(action.date)}
              style={isCompact ? styles.compactActionButton : styles.actionButton}
            >
              {action.label}
            </Button>
          );
        })}
        <Button
          disabled={changeTaskDate.isPending || task.status === 'INBOX'}
          loading={changeTaskDate.isPending && changeTaskDate.variables?.targetDate === null}
          variant={task.status === 'INBOX' ? 'secondary' : 'ghost'}
          onPress={() => changeDate(null)}
          style={isCompact ? styles.compactActionButton : styles.actionButton}
        >
          기록함
        </Button>
      </View>

      {changeTaskDate.error ? (
        <AppText accessibilityLiveRegion="polite" tone="danger" variant="caption">
          {changeTaskDate.error.message}
        </AppText>
      ) : feedback ? (
        <View
          accessibilityLiveRegion="polite"
          style={[styles.feedback, { backgroundColor: theme.colors.successSoft }]}
        >
          <AppText tone="success" variant="caption" weight="semibold">
            {feedback}
          </AppText>
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing[3],
  },
  heading: {
    gap: spacing[1],
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  actionButton: {
    flexGrow: 1,
    minWidth: 88,
  },
  compactActionButton: {
    flexGrow: 1,
    minWidth: 72,
  },
  feedback: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
  },
});
