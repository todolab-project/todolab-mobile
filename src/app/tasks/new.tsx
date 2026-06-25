import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppText, Button, Screen } from '@/components/ui';
import { TaskForm, useCreateInboxTask } from '@/features/tasks';
import { spacing } from '@/theme';
import type { TaskUpsertRequest } from '@/types';

export default function NewTaskScreen() {
  const router = useRouter();
  const createTask = useCreateInboxTask();

  const handleSubmit = (request: TaskUpsertRequest) => {
    createTask.mutate(request, {
      onSuccess: (task) => {
        router.replace({ pathname: '/tasks/[taskId]', params: { taskId: String(task.id) } });
      },
    });
  };

  return (
    <Screen scroll contentContainerStyle={styles.screen}>
      <View style={styles.header}>
        <Button
          accessibilityLabel="이전 화면으로 돌아가기"
          variant="ghost"
          onPress={() => router.back()}
        >
          ← 돌아가기
        </Button>
        <View style={styles.titleBlock}>
          <AppText variant="title" weight="heavy">
            새 할 일
          </AppText>
          <AppText tone="secondary" variant="label">
            제목부터 적고, 필요한 맥락만 가볍게 더해요.
          </AppText>
        </View>
      </View>

      <TaskForm
        errorMessage={createTask.error?.message}
        isSubmitting={createTask.isPending}
        submitLabel="저장하기"
        onCancel={() => router.back()}
        onSubmit={handleSubmit}
      />
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
    gap: spacing[1],
  },
});
