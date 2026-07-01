import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { radii, spacing, useAppTheme } from '@/theme';
import type { TaskResponse } from '@/types';
import { formatTimeLabel } from '@/utils';

type ScheduleCardProps = {
  task: TaskResponse;
  onOpen?: () => void;
};

export function ScheduleCard({ task, onOpen }: ScheduleCardProps) {
  const theme = useAppTheme();
  const timeLabel = getScheduleTimeLabel(task);
  const metadata = task.description ?? task.category;

  return (
    <Pressable
      accessibilityLabel={`${task.title}, ${timeLabel}, 상세 보기`}
      accessibilityRole="button"
      disabled={!onOpen}
      onPress={onOpen}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: pressed ? theme.colors.surfaceMuted : theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}
    >
      <View style={styles.time}>
        <AppText tone="primary" variant="caption" weight="bold">
          {timeLabel}
        </AppText>
      </View>
      <View style={styles.copy}>
        <AppText numberOfLines={2} weight="medium">
          {task.title}
        </AppText>
        {metadata ? (
          <AppText numberOfLines={1} tone="secondary" variant="caption">
            {metadata}
          </AppText>
        ) : null}
      </View>
      <AppText tone="muted" variant="bodyLarge">
        ›
      </AppText>
    </Pressable>
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
    gap: spacing[3],
    minHeight: 60,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
  },
  time: {
    minWidth: 68,
  },
  copy: {
    flex: 1,
    gap: spacing[1],
    minWidth: 0,
  },
});
