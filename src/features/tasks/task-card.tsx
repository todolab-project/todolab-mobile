import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import type { ReactNode } from 'react';

import { AppText, Card } from '@/components/ui';
import { radii, sizes, spacing, useAppTheme } from '@/theme';
import type { TaskResponse } from '@/types';
import { formatTimeLabel } from '@/utils';

type TaskCardProps = {
  task: TaskResponse;
  onOpen?: () => void;
  onComplete?: () => void;
  onReopen?: () => void;
  isCompleting?: boolean;
  completionDisabled?: boolean;
  action?: ReactNode;
};

export function TaskCard({
  task,
  onOpen,
  onComplete,
  onReopen,
  isCompleting = false,
  completionDisabled = false,
  action,
}: TaskCardProps) {
  const theme = useAppTheme();
  const isDone = task.status === 'DONE';
  const onToggle = isDone ? onReopen : onComplete;
  const toggleDisabled = completionDisabled || !onToggle;
  const toggleLabel = onToggle
    ? isDone
      ? `${task.title}, 다시 열기`
      : `${task.title} 완료하기`
    : `${task.title}, ${isDone ? '완료됨' : '미완료'}`;
  const timeLabel = isDone
    ? task.completedAt
      ? `완료 ${formatTimeLabel(task.completedAt)}`
      : '완료'
    : !task.allDay && task.startAt
      ? formatTimeLabel(task.startAt)
      : null;

  return (
    <Card padded={false} style={styles.card}>
      <View style={styles.content}>
        <View
          style={[
            styles.accent,
            { backgroundColor: isDone ? theme.colors.success : theme.colors.primary },
          ]}
        />

        <Pressable
          accessibilityLabel={toggleLabel}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: isDone, busy: isCompleting, disabled: toggleDisabled }}
          disabled={toggleDisabled}
          hitSlop={4}
          onPress={onToggle}
          style={({ pressed }) => [
            styles.checkbox,
            {
              backgroundColor: isDone
                ? theme.colors.success
                : pressed
                  ? theme.colors.primarySoft
                  : theme.colors.surface,
              borderColor: isDone ? theme.colors.success : theme.colors.borderStrong,
              opacity: completionDisabled && !isCompleting ? 0.45 : 1,
            },
          ]}
        >
          {isCompleting ? (
            <ActivityIndicator color={theme.colors.primary} size="small" />
          ) : isDone ? (
            <AppText style={{ color: theme.colors.textOnPrimary }} weight="heavy">
              ✓
            </AppText>
          ) : null}
        </Pressable>

        <Pressable
          accessibilityLabel={`${task.title} 상세 보기`}
          accessibilityRole="button"
          disabled={!onOpen}
          onPress={onOpen}
          style={({ pressed }) => [
            styles.copyPressable,
            {
              backgroundColor: pressed ? theme.colors.surfaceMuted : 'transparent',
            },
          ]}
        >
          <View style={styles.copy}>
            <AppText
              numberOfLines={2}
              tone={isDone ? 'secondary' : 'default'}
              variant="bodyLarge"
              weight="bold"
              style={isDone ? styles.doneTitle : undefined}
            >
              {task.title}
            </AppText>

            {task.description ? (
              <AppText numberOfLines={1} tone="secondary" variant="label">
                {task.description}
              </AppText>
            ) : null}

            <View style={styles.metadata}>
              {task.allDay ? <MetaBadge label="종일" /> : null}
              {task.category ? <MetaBadge label={task.category} /> : null}
              {task.ddayGoalTitle ? <MetaBadge label={task.ddayGoalTitle} tone="primary" /> : null}
            </View>
          </View>

          {timeLabel ? (
            <AppText tone="secondary" variant="label" weight="bold">
              {timeLabel}
            </AppText>
          ) : null}
        </Pressable>
      </View>
      {action ? <View style={styles.actionRow}>{action}</View> : null}
    </Card>
  );
}

type MetaBadgeProps = {
  label: string;
  tone?: 'neutral' | 'primary';
};

function MetaBadge({ label, tone = 'neutral' }: MetaBadgeProps) {
  const theme = useAppTheme();
  const isPrimary = tone === 'primary';

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: isPrimary ? theme.colors.primarySoft : theme.colors.surfaceMuted },
      ]}
    >
      <AppText tone={isPrimary ? 'primary' : 'secondary'} variant="caption" weight="semibold">
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing[3],
    minHeight: 76,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  accent: {
    alignSelf: 'stretch',
    borderRadius: radii.full,
    width: 4,
  },
  checkbox: {
    alignItems: 'center',
    borderRadius: radii.full,
    borderWidth: 1.5,
    height: sizes.touchTarget,
    justifyContent: 'center',
    width: sizes.touchTarget,
  },
  copy: {
    flex: 1,
    gap: spacing[1],
    minWidth: 0,
  },
  copyPressable: {
    alignItems: 'center',
    borderRadius: radii.md,
    flex: 1,
    flexDirection: 'row',
    gap: spacing[2],
    marginVertical: -spacing[1],
    minWidth: 0,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
  },
  metadata: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[1],
  },
  badge: {
    borderRadius: radii.full,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
  },
  actionRow: {
    alignItems: 'flex-end',
    paddingBottom: spacing[3],
    paddingHorizontal: spacing[4],
  },
  doneTitle: {
    textDecorationLine: 'line-through',
  },
});
