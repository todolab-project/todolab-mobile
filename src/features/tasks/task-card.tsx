import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import type { ReactNode } from 'react';

import { AppText } from '@/components/ui';
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
  showCompletionControl?: boolean;
  trailing?: ReactNode;
  action?: ReactNode;
};

export function TaskCard({
  task,
  onOpen,
  onComplete,
  onReopen,
  isCompleting = false,
  completionDisabled = false,
  showCompletionControl = true,
  trailing,
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
  const metadata = [
    timeLabel,
    task.allDay ? '종일' : null,
    task.category,
    task.ddayGoalTitle,
  ].filter((value): value is string => Boolean(value));

  return (
    <View
      style={[
        styles.row,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
      ]}
    >
      <View style={styles.content}>
        {showCompletionControl ? (
          <Pressable
            accessibilityLabel={toggleLabel}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: isDone, busy: isCompleting, disabled: toggleDisabled }}
            disabled={toggleDisabled}
            hitSlop={4}
            onPress={onToggle}
            style={({ pressed }) => [
              styles.checkboxHitArea,
              pressed && { backgroundColor: theme.colors.primarySoft },
              { opacity: completionDisabled && !isCompleting ? 0.45 : 1 },
            ]}
          >
            <View
              style={[
                styles.checkbox,
                {
                  backgroundColor: isDone ? theme.colors.success : theme.colors.surface,
                  borderColor: isDone ? theme.colors.success : theme.colors.borderStrong,
                },
              ]}
            >
              {isCompleting ? (
                <ActivityIndicator color={theme.colors.primary} size="small" />
              ) : isDone ? (
                <AppText
                  variant="caption"
                  style={{ color: theme.colors.textOnPrimary }}
                  weight="bold"
                >
                  ✓
                </AppText>
              ) : null}
            </View>
          </Pressable>
        ) : null}

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
              weight="medium"
              style={isDone ? styles.doneTitle : undefined}
            >
              {task.title}
            </AppText>

            {task.description ? (
              <AppText numberOfLines={1} tone="secondary" variant="label">
                {task.description}
              </AppText>
            ) : null}

            {metadata.length > 0 ? (
              <AppText numberOfLines={1} tone="secondary" variant="caption">
                {metadata.join(' · ')}
              </AppText>
            ) : null}
          </View>
        </Pressable>
        {trailing}
      </View>
      {action ? <View style={styles.actionRow}>{action}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    borderRadius: radii.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing[1],
    minHeight: 60,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
  },
  checkboxHitArea: {
    alignItems: 'center',
    borderRadius: radii.sm,
    height: sizes.touchTarget,
    justifyContent: 'center',
    width: sizes.touchTarget,
  },
  checkbox: {
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 1.5,
    height: 20,
    justifyContent: 'center',
    overflow: 'hidden',
    width: 20,
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
    minWidth: 0,
    paddingHorizontal: spacing[1],
    paddingVertical: spacing[2],
  },
  actionRow: {
    alignItems: 'flex-end',
    paddingBottom: spacing[2],
    paddingHorizontal: spacing[2],
  },
  doneTitle: {
    textDecorationLine: 'line-through',
  },
});
