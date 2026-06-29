import { useRef, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { AppText, Button, Card } from '@/components/ui';
import { useCreateInboxTask } from '@/features/tasks';
import { radii, spacing, useAppTheme } from '@/theme';
import { taskLimits } from '@/types';

export function QuickCapture() {
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
      <Card style={styles.composerCard}>
        <TextInput
          ref={inputRef}
          accessibilityLabel="빠르게 할 일 기록"
          editable={!createTask.isPending}
          enterKeyHint="done"
          maxLength={taskLimits.title}
          onChangeText={handleChange}
          onSubmitEditing={handleSubmit}
          placeholder="생각난 할 일 기록"
          placeholderTextColor={theme.colors.textMuted}
          returnKeyType="done"
          style={[
            styles.input,
            {
              color: theme.colors.text,
            },
          ]}
          value={title}
        />
        <Button loading={createTask.isPending} onPress={handleSubmit} style={styles.submitButton}>
          추가
        </Button>
      </Card>

      {message ? (
        <AppText accessibilityLiveRegion="polite" tone="danger" variant="caption">
          {message}
        </AppText>
      ) : didSave ? (
        <AppText accessibilityLiveRegion="polite" tone="success" variant="caption">
          기록함에 추가했어요.
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing[1],
  },
  composerCard: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing[2],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
  },
  input: {
    flex: 1,
    fontSize: 15,
    minHeight: 44,
    minWidth: 0,
    padding: 0,
  },
  submitButton: {
    borderRadius: radii.full,
    minWidth: 56,
    paddingHorizontal: spacing[3],
  },
});
