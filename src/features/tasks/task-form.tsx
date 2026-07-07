import { useState } from 'react';
import { Pressable, StyleSheet, Switch, TextInput, View } from 'react-native';

import { AppText, Button, Card, InlineNotice } from '@/components/ui';
import { radii, spacing, useAppTheme } from '@/theme';
import type { TaskResponse, TaskType, TaskUpsertRequest } from '@/types';
import { taskLimits } from '@/types';

type TaskFormValues = {
  title: string;
  description: string;
  category: string;
  type: TaskType;
  allDay: boolean;
};

type TaskFormField = 'title' | 'description' | 'category';

type TaskFormProps = {
  initialTask?: TaskResponse;
  submitLabel: string;
  isSubmitting?: boolean;
  errorMessage?: string | null;
  onCancel?: () => void;
  onSubmit: (request: TaskUpsertRequest) => void;
};

const taskTypes: { value: TaskType; label: string }[] = [
  { value: 'TODO', label: '할 일' },
  { value: 'SCHEDULE', label: '일정' },
  { value: 'IDEA', label: '아이디어' },
];

export function TaskForm({
  initialTask,
  submitLabel,
  isSubmitting = false,
  errorMessage,
  onCancel,
  onSubmit,
}: TaskFormProps) {
  const theme = useAppTheme();
  const [values, setValues] = useState<TaskFormValues>(() => ({
    title: initialTask?.title ?? '',
    description: initialTask?.description ?? '',
    category: initialTask?.category ?? '',
    type: initialTask?.type ?? 'TODO',
    allDay: initialTask?.allDay ?? false,
  }));
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<TaskFormField | null>(null);
  const [focusedType, setFocusedType] = useState<TaskType | null>(null);
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(
    initialTask
      ? Boolean(
          initialTask.description ||
          initialTask.category ||
          initialTask.type !== 'TODO' ||
          initialTask.allDay,
        )
      : false,
  );
  const titleLength = values.title.trim().length;
  const canSubmit = titleLength > 0 && !isSubmitting;
  const canSetAllDay = Boolean(initialTask?.startAt);

  const updateField = <Key extends keyof TaskFormValues>(key: Key, value: TaskFormValues[Key]) => {
    setValues((current) => ({ ...current, [key]: value }));
    setValidationMessage(null);
  };

  const handleSubmit = () => {
    const title = values.title.trim();
    const description = values.description.trim();
    const category = values.category.trim();

    if (!title) {
      setValidationMessage('제목을 입력해 주세요.');
      return;
    }

    onSubmit({
      title,
      description: description || null,
      category: category || null,
      type: values.type,
      allDay: canSetAllDay && values.allDay,
      startAt: initialTask?.startAt ?? null,
      endAt: initialTask?.endAt ?? null,
    });
  };

  return (
    <View style={styles.container}>
      <Card variant="sheet" style={styles.formCard}>
        <View style={styles.field}>
          <View style={styles.labelRow}>
            <AppText variant="label" weight="bold">
              제목
            </AppText>
            <AppText
              tone={titleLength > taskLimits.title - 5 ? 'danger' : 'muted'}
              variant="caption"
            >
              {values.title.length}/{taskLimits.title}
            </AppText>
          </View>
          <TextInput
            accessibilityLabel="Task 제목"
            editable={!isSubmitting}
            maxLength={taskLimits.title}
            onBlur={() => setFocusedField(null)}
            onChangeText={(value) => updateField('title', value)}
            onFocus={() => setFocusedField('title')}
            placeholder="예: 은행 앱 이체 확인"
            placeholderTextColor={theme.colors.textMuted}
            returnKeyType="next"
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.surface,
                borderColor: validationMessage
                  ? theme.colors.danger
                  : focusedField === 'title'
                    ? theme.colors.primary
                    : theme.colors.border,
                borderWidth: focusedField === 'title' ? 2 : 1,
                color: theme.colors.text,
              },
            ]}
            value={values.title}
          />
        </View>

        <View style={styles.field}>
          <AppText variant="label" weight="bold">
            유형
          </AppText>
          <View style={styles.typeGrid}>
            {taskTypes.map((type) => {
              const selected = type.value === values.type;

              return (
                <Pressable
                  accessibilityLabel={`${type.label} 유형 선택`}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: selected, disabled: isSubmitting }}
                  disabled={isSubmitting}
                  key={type.value}
                  onBlur={() => setFocusedType(null)}
                  onFocus={() => setFocusedType(type.value)}
                  onPress={() => updateField('type', type.value)}
                  style={[
                    styles.typeOption,
                    {
                      backgroundColor: selected ? theme.colors.highlightBlue : 'transparent',
                      borderColor:
                        focusedType === type.value || selected
                          ? theme.colors.primary
                          : theme.colors.border,
                      borderWidth: focusedType === type.value ? 2 : 1,
                    },
                  ]}
                >
                  <AppText tone={selected ? 'primary' : 'default'} variant="label" weight="bold">
                    {type.label}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
        </View>

        <Button
          accessibilityState={{ expanded: isDetailsExpanded }}
          size="compact"
          variant="ghost"
          onPress={() => setIsDetailsExpanded((current) => !current)}
          style={styles.detailsToggle}
        >
          {isDetailsExpanded ? '추가 정보 접기' : '설명·카테고리 추가'}
        </Button>

        {isDetailsExpanded ? (
          <View style={styles.field}>
            <View style={styles.labelRow}>
              <AppText variant="label" weight="bold">
                설명
              </AppText>
              <AppText tone="muted" variant="caption">
                선택
              </AppText>
            </View>
            <TextInput
              accessibilityLabel="Task 설명"
              editable={!isSubmitting}
              maxLength={taskLimits.description}
              multiline
              onBlur={() => setFocusedField(null)}
              onChangeText={(value) => updateField('description', value)}
              onFocus={() => setFocusedField('description')}
              placeholder="필요한 맥락이나 다음 행동"
              placeholderTextColor={theme.colors.textMuted}
              style={[
                styles.input,
                styles.textArea,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor:
                    focusedField === 'description' ? theme.colors.primary : theme.colors.border,
                  borderWidth: focusedField === 'description' ? 2 : 1,
                  color: theme.colors.text,
                },
              ]}
              textAlignVertical="top"
              value={values.description}
            />
          </View>
        ) : null}

        {isDetailsExpanded && canSetAllDay ? (
          <View style={styles.switchRow}>
            <View style={styles.switchCopy}>
              <AppText variant="label" weight="bold">
                종일 항목
              </AppText>
              <AppText tone="secondary" variant="caption">
                시간 선택 없이 하루 단위로 관리해요.
              </AppText>
            </View>
            <Switch
              accessibilityLabel="종일 항목 여부"
              disabled={isSubmitting}
              onValueChange={(value) => updateField('allDay', value)}
              thumbColor={values.allDay ? theme.colors.primary : theme.colors.surface}
              trackColor={{ false: theme.colors.borderStrong, true: theme.colors.primarySoft }}
              value={values.allDay}
            />
          </View>
        ) : null}

        {isDetailsExpanded ? (
          <View style={styles.field}>
            <View style={styles.labelRow}>
              <AppText variant="label" weight="bold">
                카테고리
              </AppText>
              <AppText tone="muted" variant="caption">
                선택
              </AppText>
            </View>
            <TextInput
              accessibilityLabel="Task 카테고리"
              editable={!isSubmitting}
              maxLength={taskLimits.category}
              onBlur={() => setFocusedField(null)}
              onChangeText={(value) => updateField('category', value)}
              onFocus={() => setFocusedField('category')}
              placeholder="예: 업무, 집, 건강"
              placeholderTextColor={theme.colors.textMuted}
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor:
                    focusedField === 'category' ? theme.colors.primary : theme.colors.border,
                  borderWidth: focusedField === 'category' ? 2 : 1,
                  color: theme.colors.text,
                },
              ]}
              value={values.category}
            />
          </View>
        ) : null}

        {validationMessage ? (
          <AppText accessibilityLiveRegion="polite" tone="danger" variant="caption">
            {validationMessage}
          </AppText>
        ) : null}

        {errorMessage ? <InlineNotice message={errorMessage} tone="danger" /> : null}
      </Card>

      <View style={styles.actions}>
        {onCancel ? (
          <Button disabled={isSubmitting} fullWidth variant="ghost" onPress={onCancel}>
            취소
          </Button>
        ) : null}
        <Button
          disabled={!canSubmit}
          fullWidth
          loading={isSubmitting}
          size="large"
          onPress={handleSubmit}
        >
          {submitLabel}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing[4],
  },
  formCard: {
    gap: spacing[4],
    paddingHorizontal: spacing[1],
    paddingVertical: spacing[2],
  },
  field: {
    gap: spacing[2],
  },
  labelRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing[2],
    justifyContent: 'space-between',
  },
  input: {
    borderRadius: radii.md,
    borderWidth: 1,
    fontSize: 16,
    minHeight: 44,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
  },
  textArea: {
    minHeight: 88,
  },
  typeGrid: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  typeOption: {
    alignItems: 'center',
    borderRadius: radii.md,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: spacing[2],
  },
  switchRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing[3],
    justifyContent: 'space-between',
  },
  switchCopy: {
    flex: 1,
    gap: spacing[1],
  },
  detailsToggle: {
    alignSelf: 'flex-start',
  },
  actions: {
    gap: spacing[2],
  },
});
