import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { AppText, Card } from '@/components/ui';
import { radii, sizes, spacing, useAppTheme } from '@/theme';
import type { TaskResponse } from '@/types';
import { formatTimeLabel } from '@/utils';

type TaskCardProps = {
  task: TaskResponse;
  onComplete?: () => void;
  isCompleting?: boolean;
  completionDisabled?: boolean;
};

export function TaskCard({
  task,
  onComplete,
  isCompleting = false,
  completionDisabled = false,
}: TaskCardProps) {
  const theme = useAppTheme();
  const isDone = task.status === 'DONE';
  const timeLabel = !task.allDay && task.startAt ? formatTimeLabel(task.startAt) : null;

  return (
    <Card padded={false} style={styles.card}>
      <View style={styles.content}>
        <View style={[styles.accent, { backgroundColor: theme.colors.primary }]} />

        <Pressable
          accessibilityLabel={isDone ? `${task.title}, 완료됨` : `${task.title} 완료하기`}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: isDone, busy: isCompleting, disabled: completionDisabled }}
          disabled={completionDisabled || isDone || !onComplete}
          hitSlop={4}
          onPress={onComplete}
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

        <View style={styles.copy}>
          <AppText numberOfLines={2} variant="bodyLarge" weight="bold">
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
      </View>
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
});
