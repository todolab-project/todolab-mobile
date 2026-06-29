import { useRouter } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { AppText, Button, Card, EmptyState, Screen } from '@/components/ui';
import { TaskCard } from '@/features/tasks';
import { spacing, useAppTheme } from '@/theme';

import { groupInboxTasks } from './inbox-groups';
import { useInboxTasks } from './use-inbox-tasks';

export function InboxOverview() {
  const router = useRouter();
  const theme = useAppTheme();
  const query = useInboxTasks();
  const groups = groupInboxTasks(query.data ?? []);

  return (
    <Screen scroll contentContainerStyle={styles.screen}>
      <View style={styles.header}>
        <Button accessibilityLabel="More 화면으로 돌아가기" variant="ghost" onPress={router.back}>
          ← 돌아가기
        </Button>
        <View style={styles.titleBlock}>
          <AppText tone="primary" variant="caption" weight="bold">
            INBOX
          </AppText>
          <AppText variant="title" weight="heavy">
            기록함
          </AppText>
          <AppText tone="secondary">
            아직 날짜를 정하지 않은 기록을 카테고리별로 살펴보세요.
          </AppText>
        </View>
      </View>

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
  header: {
    alignItems: 'flex-start',
    gap: spacing[3],
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
});
