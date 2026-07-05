import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { useState } from 'react';

import { AppText } from '@/components/ui';
import { radii, sizes, spacing, useAppTheme } from '@/theme';
import type { LocalDateString, TaskResponse } from '@/types';

import { getSchedulePresentation } from './schedule-presentation';

type ScheduleCardProps = {
  task: TaskResponse;
  onOpen?: () => void;
  onComplete?: () => void;
  completionDisabled?: boolean;
  isCompleting?: boolean;
  referenceDate: LocalDateString;
};

export function ScheduleCard({
  task,
  onOpen,
  onComplete,
  completionDisabled = false,
  isCompleting = false,
  referenceDate,
}: ScheduleCardProps) {
  const theme = useAppTheme();
  const [focusedControl, setFocusedControl] = useState<'checkbox' | 'content' | null>(null);
  const presentation = getSchedulePresentation(task, referenceDate);
  const secondaryMetadata = [presentation.rangeLabel, task.category, task.ddayGoalTitle]
    .filter((value): value is string => Boolean(value))
    .join(' · ');

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: focusedControl ? theme.colors.primary : theme.colors.border,
          borderBottomWidth: focusedControl ? 0 : StyleSheet.hairlineWidth,
          borderRadius: focusedControl ? radii.md : radii.none,
          borderWidth: focusedControl ? 1 : 0,
        },
      ]}
    >
      {onComplete ? (
        <Pressable
          accessibilityHint="일정을 완료합니다."
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
        accessibilityHint={onOpen ? '일정 상세 화면을 엽니다.' : undefined}
        accessibilityLabel={`${task.title}, 일정, ${presentation.primaryLabel}${
          presentation.rangeLabel ? `, ${presentation.rangeLabel}` : ''
        }, 상세 보기`}
        accessibilityRole="button"
        accessibilityState={{ disabled: !onOpen }}
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
              일정 · {presentation.primaryLabel}
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

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    flexDirection: 'row',
    minHeight: 60,
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
