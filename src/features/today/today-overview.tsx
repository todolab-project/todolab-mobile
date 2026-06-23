import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { AppText, Button, Card } from '@/components/ui';
import { radii, spacing, useAppTheme } from '@/theme';
import type { LocalDateString } from '@/types';

import { useTodayOverview } from './use-today-overview';

type TodayOverviewProps = {
  date: LocalDateString;
};

export function TodayOverview({ date }: TodayOverviewProps) {
  const theme = useAppTheme();
  const { todayTasks, doneTasks, inboxTasks, isPending, error, refetch } = useTodayOverview(date);

  if (isPending) {
    return (
      <Card accessibilityLabel="Today 정보를 불러오는 중" style={styles.loadingCard}>
        <ActivityIndicator color={theme.colors.primary} />
        <AppText tone="secondary" variant="label">
          오늘의 계획을 불러오고 있어요.
        </AppText>
      </Card>
    );
  }

  if (error) {
    return (
      <Card
        style={[
          styles.errorCard,
          {
            backgroundColor: theme.colors.dangerSoft,
            borderColor: theme.colors.danger,
          },
        ]}
      >
        <View style={styles.errorCopy}>
          <AppText tone="danger" variant="bodyLarge" weight="bold">
            정보를 불러오지 못했어요
          </AppText>
          <AppText tone="secondary" variant="label">
            {error.message}
          </AppText>
        </View>
        <Button variant="secondary" onPress={() => void refetch()}>
          다시 시도
        </Button>
      </Card>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <AppText variant="bodyLarge" weight="bold">
          오늘의 흐름
        </AppText>
        <AppText tone="secondary" variant="label">
          해야 할 일과 기록을 한눈에 확인해요.
        </AppText>
      </View>

      <Card style={styles.summaryCard}>
        <SummaryItem label="오늘 할 일" value={todayTasks.length} />
        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
        <SummaryItem label="기록함" value={inboxTasks.length} />
        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
        <SummaryItem label="완료" value={doneTasks.length} tone="success" />
      </Card>
    </View>
  );
}

type SummaryItemProps = {
  label: string;
  value: number;
  tone?: 'default' | 'success';
};

function SummaryItem({ label, value, tone = 'default' }: SummaryItemProps) {
  return (
    <View accessible accessibilityLabel={`${label} ${value}개`} style={styles.summaryItem}>
      <AppText tone={tone} variant="title" weight="heavy">
        {value}
      </AppText>
      <AppText tone="secondary" variant="caption" weight="semibold">
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing[3],
  },
  heading: {
    gap: spacing[1],
  },
  loadingCard: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing[3],
    justifyContent: 'center',
    minHeight: 96,
  },
  errorCard: {
    gap: spacing[4],
  },
  errorCopy: {
    gap: spacing[1],
  },
  summaryCard: {
    alignItems: 'center',
    borderRadius: radii.lg,
    flexDirection: 'row',
    paddingHorizontal: spacing[2],
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
    gap: spacing[1],
    paddingHorizontal: spacing[1],
    paddingVertical: spacing[2],
  },
  divider: {
    height: 40,
    width: 1,
  },
});
