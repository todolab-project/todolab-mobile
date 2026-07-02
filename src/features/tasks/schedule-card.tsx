import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { useState } from 'react';

import { AppText } from '@/components/ui';
import { radii, sizes, spacing, useAppTheme } from '@/theme';
import type { TaskResponse } from '@/types';
import { formatTimeLabel } from '@/utils';

type ScheduleCardProps = {
  task: TaskResponse;
  onOpen?: () => void;
  onComplete?: () => void;
  completionDisabled?: boolean;
  isCompleting?: boolean;
};

export function ScheduleCard({
  task,
  onOpen,
  onComplete,
  completionDisabled = false,
  isCompleting = false,
}: ScheduleCardProps) {
  const theme = useAppTheme();
  const [focusedControl, setFocusedControl] = useState<'checkbox' | 'content' | null>(null);
  const timeLabel = getScheduleTimeLabel(task);
  const secondaryMetadata = [task.category, task.ddayGoalTitle]
    .filter((value): value is string => Boolean(value))
    .join(' · ');

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: focusedControl ? theme.colors.primary : theme.colors.border,
        },
      ]}
    >
      {onComplete ? (
        <Pressable
          accessibilityLabel={`${task.title} 일정 완료`}
          accessibilityRole="checkbox"
          accessibilityState={{ busy: isCompleting, checked: false, disabled: completionDisabled }}
          disabled={completionDisabled}
          hitSlop={2}
          onBlur={() => setFocusedControl(null)}
          onFocus={() => setFocusedControl('checkbox')}
          onPress={onComplete}
          style={({ pressed }) => [
            styles.completionHitArea,
            pressed && { backgroundColor: theme.colors.primarySoft },
          ]}
        >
          <View style={[styles.checkbox, { borderColor: theme.colors.borderStrong }]}>
            {isCompleting ? <ActivityIndicator color={theme.colors.primary} size="small" /> : null}
          </View>
        </Pressable>
      ) : null}
      <Pressable
        accessibilityLabel={`${task.title}, ${timeLabel}, 상세 보기`}
        accessibilityRole="button"
        disabled={!onOpen}
        onBlur={() => setFocusedControl(null)}
        onFocus={() => setFocusedControl('content')}
        onPress={onOpen}
        style={({ pressed }) => [
          styles.content,
          pressed && { backgroundColor: theme.colors.surfaceMuted },
        ]}
      >
        <View style={styles.copy}>
          <AppText numberOfLines={2} weight="medium">
            {task.title}
          </AppText>
          <View style={styles.metadata}>
            <AppText tone="primary" variant="caption" weight="bold">
              {timeLabel}
            </AppText>
            {secondaryMetadata ? (
              <AppText
                numberOfLines={1}
                style={styles.secondaryMetadata}
                tone="secondary"
                variant="caption"
              >
                · {secondaryMetadata}
              </AppText>
            ) : null}
          </View>
        </View>
        <AppText tone="muted" variant="bodyLarge">
          ›
        </AppText>
      </Pressable>
    </View>
  );
}

function getScheduleTimeLabel(task: TaskResponse) {
  if (task.allDay || !task.startAt) {
    return '종일';
  }

  const start = formatTimeLabel(task.startAt);

  return task.endAt ? `${start}–${formatTimeLabel(task.endAt)}` : start;
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 60,
    overflow: 'hidden',
  },
  completionHitArea: {
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'center',
    width: sizes.touchTarget,
  },
  checkbox: {
    alignItems: 'center',
    borderRadius: radii.sm,
    borderWidth: 1.5,
    height: 20,
    justifyContent: 'center',
    width: 20,
  },
  content: {
    alignItems: 'center',
    alignSelf: 'stretch',
    flex: 1,
    flexDirection: 'row',
    gap: spacing[3],
    minWidth: 0,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
  },
  copy: {
    flex: 1,
    gap: spacing[1],
    minWidth: 0,
  },
  metadata: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing[1],
    minWidth: 0,
  },
  secondaryMetadata: {
    flex: 1,
  },
});
