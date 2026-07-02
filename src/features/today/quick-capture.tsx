import { useRef, useState } from 'react';
import { Keyboard, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText, Button, Card, IconButton } from '@/components/ui';
import { useCreateInboxTask } from '@/features/tasks';
import { radii, sizes, spacing, useAppTheme, useMobileLayout } from '@/theme';
import { taskLimits } from '@/types';

export function QuickCapture() {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const { screenPadding } = useMobileLayout();
  const containerInsets = {
    paddingBottom: screenPadding,
    paddingLeft: Math.max(screenPadding, insets.left),
    paddingRight: Math.max(screenPadding, insets.right),
    paddingTop: screenPadding,
  };
  const inputRef = useRef<TextInput>(null);
  const createTask = useCreateInboxTask();
  const [isExpanded, setIsExpanded] = useState(false);
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
  const openComposer = () => {
    setIsExpanded(true);
    requestAnimationFrame(() => inputRef.current?.focus());
  };
  const closeComposer = () => {
    setIsExpanded(false);
    setValidationMessage(null);
    setDidSave(false);
    Keyboard.dismiss();
  };

  return (
    <View style={[styles.container, containerInsets]}>
      {isExpanded ? (
        <Card style={styles.composerCard}>
          <View style={styles.composerRow}>
            <IconButton accessibilityLabel="빠른 기록 닫기" onPress={closeComposer}>
              <AppText tone="secondary" variant="bodyLarge">
                ×
              </AppText>
            </IconButton>
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
              style={[styles.input, { color: theme.colors.text }]}
              value={title}
            />
            <Button
              loading={createTask.isPending}
              size="compact"
              onPress={handleSubmit}
              style={styles.submitButton}
            >
              추가
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
          ) : null}
        </Card>
      ) : (
        <Button accessibilityLabel="빠르게 기록 열기" onPress={openComposer} style={styles.fab}>
          <AppText style={{ color: theme.colors.textOnPrimary }} variant="title" weight="medium">
            +
          </AppText>
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
    alignSelf: 'center',
    maxWidth: sizes.contentMaxWidth,
    width: '100%',
  },
  composerCard: {
    gap: spacing[1],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    width: '100%',
  },
  composerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing[2],
  },
  input: {
    flex: 1,
    fontSize: 16,
    minHeight: 44,
    minWidth: 0,
    padding: 0,
  },
  submitButton: {
    borderRadius: radii.full,
    minWidth: 56,
  },
  fab: {
    borderRadius: radii.full,
    height: 48,
    paddingHorizontal: 0,
    width: 48,
  },
});
