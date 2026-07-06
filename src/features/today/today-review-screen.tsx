import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import type { ReactNode } from 'react';
import type { ColorValue } from 'react-native';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import {
  AppText,
  Button,
  EmptyState,
  IconButton,
  InlineNotice,
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
        <InlineNotice message={moveToToday.error.message} tone="danger" />
      ) : feedback ? (
        <InlineNotice message={feedback} tone="success" />
      ) : null}

      {overview.isPending ? (
        <ListSkeleton accessibilityLabel="정리할 항목을 불러오는 중" count={4} />
      ) : overview.error ? (
        <InlineNotice
          message={overview.error.message}
          title="정리할 항목을 불러오지 못했어요"
          tone="danger"
          action={
            <Button size="compact" variant="ghost" onPress={() => void overview.refetch()}>
              다시 시도
            </Button>
          }
        />
      ) : reviewCount === 0 ? (
        <EmptyState title="정리가 끝났어요" description="지금 다시 판단할 항목이 없습니다." />
      ) : (
        <View style={styles.sections}>
          {overview.staleTasks.length > 0 ? (
            <ReviewSection
              title="지난 미완료"
              count={overview.staleTasks.length}
              markerColor={theme.colors.warning}
            >
              {overview.staleTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  showCompletionControl={false}
                  onOpen={() => openTask(task.id)}
                  trailing={
                    <ReviewMoveAction
                      disabled={moveToToday.isPending}
                      loading={moveToToday.isPending && moveToToday.variables === task.id}
                      label={`${task.title}, 오늘 할 일로 이동`}
                      onPress={() => moveTask(task.id, '지난 미완료를 오늘 할 일로 옮겼어요.')}
                    />
                  }
                />
              ))}
            </ReviewSection>
          ) : null}

          {overview.recommendations.length > 0 ? (
            <ReviewSection
              title="추천"
              count={overview.recommendations.length}
              markerColor={theme.colors.primary}
            >
              {overview.recommendations.map(({ task }) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  showCompletionControl={false}
                  onOpen={() => openTask(task.id)}
                  trailing={
                    <ReviewMoveAction
                      disabled={moveToToday.isPending}
                      loading={moveToToday.isPending && moveToToday.variables === task.id}
                      label={`${task.title}, 오늘 할 일에 추가`}
                      onPress={() => moveTask(task.id, '추천 항목을 오늘 할 일에 추가했어요.')}
                    />
                  }
                />
              ))}
            </ReviewSection>
          ) : null}

          {overview.inboxTasks.length > 0 ? (
            <ReviewSection
              title="기록함"
              count={overview.inboxTasks.length}
              markerColor={theme.colors.textMuted}
            >
              {overview.inboxTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  showCompletionControl={false}
                  onOpen={() => openTask(task.id)}
                  trailing={
                    <ReviewMoveAction
                      disabled={moveToToday.isPending}
                      loading={moveToToday.isPending && moveToToday.variables === task.id}
                      label={`${task.title}, 오늘 할 일에 추가`}
                      onPress={() => moveTask(task.id, '기록을 오늘 할 일에 추가했어요.')}
                    />
                  }
                />
              ))}
            </ReviewSection>
          ) : null}
        </View>
      )}
    </Screen>
  );
}

type ReviewSectionProps = {
  title: string;
  count: number;
  children: ReactNode;
  markerColor: ColorValue;
};

function ReviewSection({ title, count, children, markerColor }: ReviewSectionProps) {
  return (
    <View style={styles.section}>
      <SectionHeader title={title} count={count} markerColor={markerColor} />
      <View style={styles.list}>{children}</View>
    </View>
  );
}

type ReviewMoveActionProps = {
  disabled: boolean;
  loading: boolean;
  label: string;
  onPress: () => void;
};

function ReviewMoveAction({ disabled, loading, label, onPress }: ReviewMoveActionProps) {
  const theme = useAppTheme();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ busy: loading, disabled }}
      disabled={disabled}
      hitSlop={4}
      onBlur={() => setIsFocused(false)}
      onFocus={() => setIsFocused(true)}
      onPress={onPress}
      style={({ pressed }) => [
        styles.moveAction,
        {
          backgroundColor: pressed ? theme.colors.highlightBlue : 'transparent',
          borderColor: isFocused ? theme.colors.primary : 'transparent',
          borderWidth: isFocused ? 2 : 1,
          opacity: disabled && !loading ? 0.45 : 1,
        },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={theme.colors.primary} size="small" />
      ) : (
        <AppText tone="primary" variant="caption" weight="bold">
          + 오늘
        </AppText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    gap: spacing[4],
    paddingTop: spacing[4],
  },
  backButton: {
    backgroundColor: 'transparent',
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
  moveAction: {
    alignItems: 'center',
    alignSelf: 'stretch',
    borderRadius: radii.sm,
    justifyContent: 'center',
    minWidth: 64,
    paddingHorizontal: spacing[2],
  },
});
