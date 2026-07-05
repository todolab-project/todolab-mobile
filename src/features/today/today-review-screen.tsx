import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import {
  AppText,
  Button,
  Card,
  EmptyState,
  IconButton,
  ListSkeleton,
  PageHeader,
  Screen,
  SectionHeader,
} from '@/components/ui';
import { TaskCard, useMoveTaskToToday } from '@/features/tasks';
import { radii, spacing, useAppTheme } from '@/theme';
import { toApiLocalDate } from '@/utils';

import { useTodayOverview } from './use-today-overview';

export function TodayReviewScreen() {
  const router = useRouter();
  const theme = useAppTheme();
  const today = toApiLocalDate();
  const overview = useTodayOverview(today);
  const moveToToday = useMoveTaskToToday(today);
  const [feedback, setFeedback] = useState<string | null>(null);
  const reviewCount =
    overview.staleTasks.length + overview.recommendations.length + overview.inboxTasks.length;

  const openTask = (taskId: number) => {
    router.push({ pathname: '/tasks/[taskId]', params: { taskId: String(taskId) } });
  };
  const moveTask = (taskId: number, message: string) => {
    setFeedback(null);
    moveToToday.mutate(taskId, { onSuccess: () => setFeedback(message) });
  };

  return (
    <Screen scroll contentContainerStyle={styles.screen}>
      <PageHeader
        title="정리할 항목"
        description="미뤄 둔 기록을 오늘의 실행 목록으로 정리해 보세요."
        leading={
          <IconButton
            accessibilityLabel="Today 화면으로 돌아가기"
            onPress={router.back}
            style={styles.backButton}
          >
            <SymbolView
              name={{ ios: 'chevron.left', android: 'arrow_back', web: 'arrow_back' }}
              size={20}
              tintColor={theme.colors.text}
            />
          </IconButton>
        }
      />

      {moveToToday.error ? (
        <AppText accessibilityLiveRegion="polite" tone="danger" variant="caption">
          {moveToToday.error.message}
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

      {overview.isPending ? (
        <ListSkeleton accessibilityLabel="정리할 항목을 불러오는 중" count={4} />
      ) : overview.error ? (
        <Card
          style={[
            styles.errorCard,
            { backgroundColor: theme.colors.dangerSoft, borderColor: theme.colors.danger },
          ]}
        >
          <AppText tone="danger" variant="label" weight="bold">
            정리할 항목을 불러오지 못했어요
          </AppText>
          <Button variant="secondary" onPress={() => void overview.refetch()}>
            다시 시도
          </Button>
        </Card>
      ) : reviewCount === 0 ? (
        <EmptyState title="정리가 끝났어요" description="지금 다시 판단할 항목이 없습니다." />
      ) : (
        <View style={styles.sections}>
          {overview.staleTasks.length > 0 ? (
            <ReviewSection
              title="지난 미완료"
              description="놓친 할 일을 다시 확인해요."
              count={overview.staleTasks.length}
            >
              {overview.staleTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  showCompletionControl={false}
                  onOpen={() => openTask(task.id)}
                  trailing={
                    <Button
                      accessibilityLabel={`${task.title}, 오늘 할 일로 이동`}
                      disabled={moveToToday.isPending}
                      loading={moveToToday.isPending && moveToToday.variables === task.id}
                      size="compact"
                      variant="ghost"
                      onPress={() => moveTask(task.id, '지난 미완료를 오늘 할 일로 옮겼어요.')}
                    >
                      오늘로
                    </Button>
                  }
                />
              ))}
            </ReviewSection>
          ) : null}

          {overview.recommendations.length > 0 ? (
            <ReviewSection
              title="추천"
              description="오늘 처리하기 좋은 항목이에요."
              count={overview.recommendations.length}
            >
              {overview.recommendations.map(({ task }) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  showCompletionControl={false}
                  onOpen={() => openTask(task.id)}
                  trailing={
                    <Button
                      accessibilityLabel={`${task.title}, 오늘 할 일에 추가`}
                      disabled={moveToToday.isPending}
                      loading={moveToToday.isPending && moveToToday.variables === task.id}
                      size="compact"
                      variant="ghost"
                      onPress={() => moveTask(task.id, '추천 항목을 오늘 할 일에 추가했어요.')}
                    >
                      추가
                    </Button>
                  }
                />
              ))}
            </ReviewSection>
          ) : null}

          {overview.inboxTasks.length > 0 ? (
            <ReviewSection
              title="기록함"
              description="날짜를 정하지 않은 기록이에요."
              count={overview.inboxTasks.length}
            >
              <Pressable
                accessibilityHint="기록함 화면을 엽니다."
                accessibilityLabel={`기록함 항목 ${overview.inboxTasks.length}개 정리하기`}
                accessibilityRole="button"
                onPress={() => router.push('/inbox')}
                style={({ pressed }) => [
                  styles.inboxRow,
                  {
                    backgroundColor: pressed ? theme.colors.surfaceMuted : theme.colors.surface,
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                <AppText weight="medium">기록함에서 날짜와 순서를 정리하세요.</AppText>
                <AppText tone="secondary" weight="bold">
                  열기 ›
                </AppText>
              </Pressable>
            </ReviewSection>
          ) : null}
        </View>
      )}
    </Screen>
  );
}

type ReviewSectionProps = {
  title: string;
  description: string;
  count: number;
  children: ReactNode;
};

function ReviewSection({ title, description, count, children }: ReviewSectionProps) {
  return (
    <View style={styles.section}>
      <SectionHeader title={title} description={description} count={count} />
      <View style={styles.list}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    gap: spacing[4],
    paddingTop: spacing[4],
  },
  feedback: {
    borderRadius: radii.md,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
  },
  backButton: {
    backgroundColor: 'transparent',
  },
  errorCard: {
    gap: spacing[3],
  },
  sections: {
    gap: spacing[4],
  },
  section: {
    gap: spacing[2],
  },
  list: {
    gap: spacing[1],
  },
  inboxRow: {
    alignItems: 'center',
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing[3],
    justifyContent: 'space-between',
    minHeight: 60,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
  },
});
