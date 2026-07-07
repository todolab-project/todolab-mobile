import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { AppText, Button, Card, InlineNotice } from '@/components/ui';
import { radii, spacing, useAppTheme } from '@/theme';
import { ddayGoalLimits } from '@/types';
import type { DdayGoalRequest } from '@/types';

import { useCreateDdayGoal } from './use-create-dday-goal';
import { type DdayGoalFormValues, validateDdayGoal } from './dday-validation';

type DdayCreateFormProps = {
  onCancel: () => void;
  onCreated: () => void;
};

type DdayFormField = 'title' | 'targetDate';

const initialValues: DdayGoalFormValues = {
  title: '',
  targetDate: '',
};

export function DdayCreateForm({ onCancel, onCreated }: DdayCreateFormProps) {
  const theme = useAppTheme();
  const createGoal = useCreateDdayGoal();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<ReturnType<typeof validateDdayGoal>>({});
  const [focusedField, setFocusedField] = useState<DdayFormField | null>(null);

  const updateField = (field: keyof DdayGoalFormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    createGoal.reset();
  };

  const handleSubmit = () => {
    const nextErrors = validateDdayGoal(values);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const request: DdayGoalRequest = {
      title: values.title.trim(),
      targetDate: values.targetDate.trim() as DdayGoalRequest['targetDate'],
    };

    createGoal.mutate(request, {
      onSuccess: () => {
        setValues(initialValues);
        onCreated();
      },
    });
  };

  return (
    <Card style={styles.card}>
      <View style={styles.heading}>
        <AppText variant="bodyLarge" weight="bold">
          새 D-Day
        </AppText>
        <AppText tone="secondary" variant="caption">
          지난 날짜도 기록할 수 있어요.
        </AppText>
      </View>

      <View style={styles.field}>
        <View style={styles.labelRow}>
          <AppText variant="label" weight="bold">
            목표 이름
          </AppText>
          <AppText tone="muted" variant="caption">
            {values.title.length}/{ddayGoalLimits.title}
          </AppText>
        </View>
        <TextInput
          accessibilityLabel="D-Day 목표 이름"
          editable={!createGoal.isPending}
          maxLength={ddayGoalLimits.title}
          onBlur={() => setFocusedField(null)}
          onChangeText={(value) => updateField('title', value)}
          onFocus={() => setFocusedField('title')}
          placeholder="예: 앱 정식 출시"
          placeholderTextColor={theme.colors.textMuted}
          returnKeyType="next"
          style={[
            styles.input,
            {
              backgroundColor: theme.colors.surfaceMuted,
              borderColor: errors.title
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
        {errors.title ? (
          <AppText tone="danger" variant="caption">
            {errors.title}
          </AppText>
        ) : null}
      </View>

      <View style={styles.field}>
        <AppText variant="label" weight="bold">
          목표 날짜
        </AppText>
        <TextInput
          accessibilityLabel="D-Day 목표 날짜"
          autoCapitalize="none"
          editable={!createGoal.isPending}
          maxLength={10}
          onBlur={() => setFocusedField(null)}
          onChangeText={(value) => updateField('targetDate', value)}
          onFocus={() => setFocusedField('targetDate')}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={theme.colors.textMuted}
          style={[
            styles.input,
            {
              backgroundColor: theme.colors.surfaceMuted,
              borderColor: errors.targetDate
                ? theme.colors.danger
                : focusedField === 'targetDate'
                  ? theme.colors.primary
                  : theme.colors.border,
              borderWidth: focusedField === 'targetDate' ? 2 : 1,
              color: theme.colors.text,
            },
          ]}
          value={values.targetDate}
        />
        {errors.targetDate ? (
          <AppText tone="danger" variant="caption">
            {errors.targetDate}
          </AppText>
        ) : (
          <AppText tone="secondary" variant="caption">
            예: 2026-12-31
          </AppText>
        )}
      </View>

      {createGoal.error ? <InlineNotice message={createGoal.error.message} tone="danger" /> : null}

      <View style={styles.actions}>
        <Button disabled={createGoal.isPending} fullWidth variant="secondary" onPress={onCancel}>
          취소
        </Button>
        <Button fullWidth loading={createGoal.isPending} onPress={handleSubmit}>
          목표 만들기
        </Button>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing[4],
  },
  heading: {
    gap: spacing[1],
  },
  field: {
    gap: spacing[2],
  },
  labelRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
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
