import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { StyleSheet } from 'react-native';

import { IconButton, PageHeader, Screen } from '@/components/ui';
import { TaskForm, useCreateInboxTask } from '@/features/tasks';
import { spacing, useAppTheme } from '@/theme';
import type { TaskUpsertRequest } from '@/types';

export default function NewTaskScreen() {
  const router = useRouter();
  const theme = useAppTheme();
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
      <PageHeader
        title="새 할 일"
        leading={
          <IconButton accessibilityLabel="이전 화면으로 돌아가기" onPress={router.back}>
            <SymbolView
              name={{ ios: 'chevron.left', android: 'arrow_back', web: 'arrow_back' }}
              size={20}
              tintColor={theme.colors.text}
            />
          </IconButton>
        }
      />

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
});
