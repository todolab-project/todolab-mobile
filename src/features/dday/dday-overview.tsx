import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { AppText, Button, Card, EmptyState, Screen } from '@/components/ui';
import { radii, spacing, useAppTheme } from '@/theme';
import type { DdayGoalResponse } from '@/types';
import { formatDateLabel } from '@/utils';

import { getDdayLabel } from './dday-label';
import { useDdayGoals } from './use-dday-goals';

export function DdayOverview() {
  const theme = useAppTheme();
  const query = useDdayGoals();
  const goals = [...(query.data ?? [])].sort((left, right) =>
    left.targetDate.localeCompare(right.targetDate),
  );

  return (
    <Screen scroll contentContainerStyle={styles.screen}>
      <View style={styles.header}>
        <AppText tone="primary" variant="caption" weight="bold">
          D-DAY
        </AppText>
        <AppText variant="title" weight="heavy">
          목표까지 한 걸음씩
        </AppText>
        <AppText tone="secondary">중요한 날짜와 오늘 남은 거리를 확인해 보세요.</AppText>
      </View>

      {query.isPending ? (
        <Card accessibilityLabel="D-Day 목표를 불러오는 중" style={styles.stateCard}>
          <ActivityIndicator color={theme.colors.primary} />
          <AppText tone="secondary" variant="label">
            목표를 불러오고 있어요.
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
            <AppText tone="danger" variant="bodyLarge" weight="bold">
              D-Day를 불러오지 못했어요
            </AppText>
            <AppText tone="secondary" variant="label">
              {query.error.message}
            </AppText>
          </View>
          <Button variant="secondary" onPress={() => void query.refetch()}>
            다시 시도
          </Button>
        </Card>
      ) : goals.length === 0 ? (
        <Card>
          <EmptyState
            title="아직 D-Day가 없어요"
            description="중요한 목표 날짜를 만들면 남은 날을 이곳에서 확인할 수 있어요."
          />
        </Card>
      ) : (
        <View style={styles.goalList}>
          <View style={styles.listHeading}>
            <AppText variant="bodyLarge" weight="bold">
              나의 D-Day
            </AppText>
            <AppText tone="secondary" variant="label" weight="semibold">
              {goals.length}개
            </AppText>
          </View>
          {goals.map((goal) => (
            <DdayGoalCard goal={goal} key={goal.id} />
          ))}
        </View>
      )}
    </Screen>
  );
}

function DdayGoalCard({ goal }: { goal: DdayGoalResponse }) {
  const theme = useAppTheme();
  const dayLabel = getDdayLabel(goal.daysLeft);
  const isToday = goal.daysLeft === 0;
  const isPast = goal.daysLeft < 0;
  const tone = isToday ? 'warning' : isPast ? 'secondary' : 'primary';
  const badgeBackground = isToday
    ? theme.colors.warningSoft
    : isPast
      ? theme.colors.surfaceMuted
      : theme.colors.primarySoft;

  return (
    <Card
      accessible
      accessibilityLabel={`${goal.title}, ${dayLabel}, 목표일 ${formatDateLabel(goal.targetDate)}`}
      style={styles.goalCard}
    >
      <View style={styles.goalCopy}>
        <AppText numberOfLines={2} variant="bodyLarge" weight="bold">
          {goal.title}
        </AppText>
        <AppText tone="secondary" variant="label">
          {formatDateLabel(goal.targetDate, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'short',
          })}
        </AppText>
      </View>
      <View style={[styles.dayBadge, { backgroundColor: badgeBackground }]}>
        <AppText tone={tone} variant="bodyLarge" weight="heavy">
          {dayLabel}
        </AppText>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  screen: {
    gap: spacing[6],
    paddingTop: spacing[6],
  },
  header: {
    gap: spacing[2],
  },
  stateCard: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing[3],
    justifyContent: 'center',
    minHeight: 120,
  },
  errorCard: {
    gap: spacing[4],
  },
  errorCopy: {
    gap: spacing[1],
  },
  goalList: {
    gap: spacing[3],
  },
  listHeading: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  goalCard: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing[4],
  },
  goalCopy: {
    flex: 1,
    gap: spacing[1],
    minWidth: 0,
  },
  dayBadge: {
    borderRadius: radii.full,
    minWidth: 72,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
  },
});
