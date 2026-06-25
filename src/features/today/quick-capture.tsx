import { useRef, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';

import { AppText, Button, Card } from '@/components/ui';
import { useCreateInboxTask } from '@/features/tasks';
import { radii, spacing, useAppTheme } from '@/theme';
import { taskLimits } from '@/types';

export function QuickCapture() {
  const router = useRouter();
  const theme = useAppTheme();
  const inputRef = useRef<TextInput>(null);
  const createTask = useCreateInboxTask();
  const [title, setTitle] = useState('');
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const [didSave, setDidSave] = useState(false);

  const handleChange = (value: string) => {
    setTitle(value);
    setValidationMessage(null);
    setDidSave(false);
    createTask.reset();
  };

  const handleSubmit = () => {
    const normalizedTitle = title.trim();

    if (!normalizedTitle) {
      setValidationMessage('기록할 내용을 입력해 주세요.');
      inputRef.current?.focus();
      return;
    }

    createTask.mutate(
      {
        title: normalizedTitle,
        description: null,
        category: null,
        type: 'TODO',
        allDay: false,
        startAt: null,
        endAt: null,
      },
      {
        onSuccess: () => {
          setTitle('');
          setDidSave(true);
          inputRef.current?.focus();
        },
      },
    );
  };

  const message = validationMessage ?? createTask.error?.message;

  return (
    <View style={styles.container}>
      <Card style={styles.formCard}>
        <View style={styles.formRow}>
          <TextInput
            ref={inputRef}
            accessibilityLabel="빠르게 할 일 기록"
            editable={!createTask.isPending}
            enterKeyHint="done"
            maxLength={taskLimits.title}
            onChangeText={handleChange}
            onSubmitEditing={handleSubmit}
            placeholder="생각난 할 일을 바로 기록"
            placeholderTextColor={theme.colors.textMuted}
            returnKeyType="done"
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.surfaceMuted,
                borderColor: message ? theme.colors.danger : theme.colors.border,
                color: theme.colors.text,
              },
            ]}
            value={title}
          />
          <Button loading={createTask.isPending} onPress={handleSubmit} style={styles.submitButton}>
            기록
          </Button>
        </View>

        {message ? (
          <AppText accessibilityLiveRegion="polite" tone="danger" variant="caption">
            {message}
          </AppText>
        ) : didSave ? (
          <AppText accessibilityLiveRegion="polite" tone="success" variant="caption">
            기록함에 추가했어요.
          </AppText>
        ) : (
          <AppText tone="secondary" variant="caption">
            날짜는 나중에 정해도 괜찮아요.
          </AppText>
        )}
      </Card>
      <Button variant="ghost" onPress={() => router.push('/tasks/new')}>
        자세히 작성하기
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing[2],
  },
  formCard: {
    gap: spacing[2],
    padding: spacing[3],
  },
  formRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing[2],
  },
  input: {
    borderRadius: radii.md,
    borderWidth: 1,
    flex: 1,
    fontSize: 15,
    minHeight: 44,
    minWidth: 0,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
  },
  submitButton: {
    minWidth: 64,
  },
});
