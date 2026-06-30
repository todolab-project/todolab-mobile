import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { AppText, Button, Card, EmptyState, IconButton, PageHeader, Screen } from '@/components/ui';
import { TaskCard, useMoveTaskToToday } from '@/features/tasks';
import { spacing, useAppTheme } from '@/theme';
import { formatDateLabel, shiftLocalDate, toApiLocalDate } from '@/utils';

import { groupInboxTasks } from './inbox-groups';
import { useInboxTasks } from './use-inbox-tasks';

export function InboxOverview() {
  const router = useRouter();
  const theme = useAppTheme();
  const query = useInboxTasks();
  const groups = groupInboxTasks(query.data ?? []);
  const today = toApiLocalDate();
  const tomorrow = shiftLocalDate(today, 1) ?? today;
  const moveToToday = useMoveTaskToToday(today);
  const moveToTomorrow = useMoveTaskToToday(tomorrow);
  const [feedback, setFeedback] = useState<string | null>(null);
  const moveError = moveToToday.error ?? moveToTomorrow.error;
  const isMoving = moveToToday.isPending || moveToTomorrow.isPending;

  const moveTask = (taskId: number, target: 'today' | 'tomorrow') => {
    setFeedback(null);
    const mutation = target === 'today' ? moveToToday : moveToTomorrow;
    const targetDate = target === 'today' ? today : tomorrow;

    mutation.mutate(taskId, {
      onSuccess: () => {
        setFeedback(`${formatDateLabel(targetDate)} 할 일로 옮겼어요.`);
      },
    });
  };

  return (
    <Screen scroll contentContainerStyle={styles.screen}>
      <PageHeader
        title="기록함"
        description="날짜를 정하지 않은 기록을 정리하세요."
        leading={
          <IconButton accessibilityLabel="More 화면으로 돌아가기" onPress={router.back}>
            <SymbolView
              name={{ ios: 'chevron.left', android: 'arrow_back', web: 'arrow_back' }}
              size={20}
              tintColor={theme.colors.text}
            />
          </IconButton>
        }
      />

      {moveError ? (
        <AppText accessibilityLiveRegion="polite" tone="danger" variant="caption">
          {moveError.message}
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

      {query.isPending ? (
        <Card accessibilityLabel="기록함을 불러오는 중" style={styles.stateCard}>
          <ActivityIndicator color={theme.colors.primary} />
          <AppText tone="secondary" variant="label">
            기록을 불러오고 있어요.
          </AppText>
        </Card>
      ) : query.error ? (
        <Card
          style={[
            styles.errorCard,
            { backgroundColor: theme.colors.dangerSoft, borderColor: theme.colors.danger },
          ]}
        >
          <View style={styles.titleBlock}>
            <AppText tone="danger" variant="bodyLarge" weight="bold">
              기록함을 불러오지 못했어요
            </AppText>
            <AppText tone="secondary" variant="label">
              {query.error.message}
            </AppText>
          </View>
          <Button variant="secondary" onPress={() => void query.refetch()}>
            다시 시도
          </Button>
        </Card>
      ) : groups.length === 0 ? (
        <Card>
          <EmptyState
            title="기록함이 비어 있어요"
            description="날짜 없이 빠르게 추가한 생각과 할 일이 이곳에 모입니다."
          />
        </Card>
      ) : (
        <View style={styles.groups}>
          <View style={styles.summary}>
            <AppText variant="bodyLarge" weight="bold">
              모든 기록
            </AppText>
            <AppText tone="secondary" variant="label" weight="semibold">
              {query.data?.length ?? 0}개 · {groups.length}개 그룹
            </AppText>
          </View>

          {groups.map((group) => (
            <View key={group.category} style={styles.group}>
              <View style={styles.groupHeader}>
                <AppText variant="bodyLarge" weight="bold">
                  {group.category}
                </AppText>
                <AppText tone="secondary" variant="caption" weight="semibold">
                  {group.tasks.length}개
                </AppText>
              </View>
              <View style={styles.tasks}>
                {group.tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    action={
                      <View style={styles.taskActions}>
                        <Button
                          disabled={isMoving}
                          loading={moveToToday.isPending && moveToToday.variables === task.id}
                          variant="secondary"
                          onPress={() => moveTask(task.id, 'today')}
                          style={styles.taskAction}
                        >
                          Today
                        </Button>
                        <Button
                          disabled={isMoving}
                          loading={moveToTomorrow.isPending && moveToTomorrow.variables === task.id}
                          variant="ghost"
                          onPress={() => moveTask(task.id, 'tomorrow')}
                          style={styles.taskAction}
                        >
                          내일
                        </Button>
                      </View>
                    }
                    onOpen={() => router.push(`/tasks/${task.id}`)}
                  />
                ))}
              </View>
            </View>
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    gap: spacing[5],
    paddingTop: spacing[3],
  },
  titleBlock: {
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
  groups: {
    gap: spacing[5],
  },
  summary: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
    justifyContent: 'space-between',
  },
  group: {
    gap: spacing[3],
  },
  groupHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing[2],
    justifyContent: 'space-between',
  },
  tasks: {
    gap: spacing[2],
  },
  taskActions: {
    flexDirection: 'row',
    gap: spacing[2],
    width: '100%',
  },
  taskAction: {
    flex: 1,
  },
  feedback: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
  },
});
