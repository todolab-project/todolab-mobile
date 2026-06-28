import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { AppText, Button, Card } from '@/components/ui';
import { radii, spacing, useAppTheme } from '@/theme';
import { taskLimits } from '@/types';
import { toApiLocalDate } from '@/utils';

import { useCreateDdayTodayTask } from './use-create-dday-today-task';

type DdayTodayTaskFormProps = {
  goalId: number;
  goalTitle: string;
  onCancel: () => void;
  onCreated: () => void;
};

export function DdayTodayTaskForm({
  goalId,
  goalTitle,
  onCancel,
  onCreated,
}: DdayTodayTaskFormProps) {
  const theme = useAppTheme();
  const createTask = useCreateDdayTodayTask();
  const [title, setTitle] = useState('');
  const [validationMessage, setValidationMessage] = useState<string | null>(null);

  const handleSubmit = () => {
    const normalizedTitle = title.trim();

    if (!normalizedTitle) {
      setValidationMessage('오늘 할 일의 제목을 입력해 주세요.');
      return;
    }

    createTask.mutate(
      { goalId, title: normalizedTitle, date: toApiLocalDate() },
      { onSuccess: onCreated },
    );
  };

  return (
    <Card variant="muted" style={styles.card}>
      <View style={styles.heading}>
        <AppText variant="label" weight="bold">
          “{goalTitle}”의 오늘 할 일
        </AppText>
        <AppText tone="secondary" variant="caption">
          만든 Task는 이 목표에 연결되어 Today에 추가돼요.
        </AppText>
      </View>

      <TextInput
        accessibilityLabel={`${goalTitle} 목표의 오늘 할 일 제목`}
        editable={!createTask.isPending}
        maxLength={taskLimits.title}
        onChangeText={(value) => {
          setTitle(value);
          setValidationMessage(null);
          createTask.reset();
        }}
        onSubmitEditing={handleSubmit}
        placeholder="오늘 끝낼 작은 행동"
        placeholderTextColor={theme.colors.textMuted}
        returnKeyType="done"
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.surface,
            borderColor:
              validationMessage || createTask.error ? theme.colors.danger : theme.colors.border,
            color: theme.colors.text,
          },
        ]}
        value={title}
      />

      {validationMessage || createTask.error ? (
        <AppText accessibilityLiveRegion="polite" tone="danger" variant="caption">
          {validationMessage ?? createTask.error?.message}
        </AppText>
      ) : null}

      <View style={styles.actions}>
        <Button disabled={createTask.isPending} fullWidth variant="secondary" onPress={onCancel}>
          취소
        </Button>
        <Button fullWidth loading={createTask.isPending} onPress={handleSubmit}>
          Today에 추가
        </Button>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing[3],
  },
  heading: {
    gap: spacing[1],
  },
  input: {
    borderRadius: radii.md,
    borderWidth: 1,
    fontSize: 16,
    minHeight: 48,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[3],
  },
  actions: {
    gap: spacing[2],
  },
});
