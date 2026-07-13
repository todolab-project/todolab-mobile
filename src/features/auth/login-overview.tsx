import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Href } from 'expo-router';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, TextInput, View } from 'react-native';

import { AppText, Button, IconButton, InlineNotice, PageHeader, Screen } from '@/components/ui';
import { authApi, getUserFacingApiErrorMessage } from '@/services/api';
import { radii, spacing, typography, useAppTheme } from '@/theme';

export function LoginOverview() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const theme = useAppTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const login = useMutation({
    mutationFn: () => authApi.login({ email: email.trim(), password }),
    onSuccess: async () => {
      setValidationMessage(null);
      await queryClient.invalidateQueries();
      router.replace('/' as Href);
    },
  });
  const errorMessage =
    validationMessage ?? (login.error ? getUserFacingApiErrorMessage(login.error) : null);

  const submit = () => {
    const normalizedEmail = email.trim();
    if (!normalizedEmail || !password) {
      setValidationMessage('이메일과 비밀번호를 입력해 주세요.');
      return;
    }

    setValidationMessage(null);
    login.mutate();
  };

  return (
    <Screen contentContainerStyle={styles.screen}>
      <PageHeader
        title="로그인"
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

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.form}
      >
        <View style={styles.fields}>
          <View style={styles.field}>
            <AppText variant="label" weight="bold">
              이메일
            </AppText>
            <TextInput
              accessibilityLabel="이메일"
              autoCapitalize="none"
              autoComplete="email"
              inputMode="email"
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor={theme.colors.textMuted}
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                  color: theme.colors.text,
                },
              ]}
              textContentType="username"
              value={email}
            />
          </View>

          <View style={styles.field}>
            <AppText variant="label" weight="bold">
              비밀번호
            </AppText>
            <TextInput
              accessibilityLabel="비밀번호"
              autoCapitalize="none"
              autoComplete="password"
              onChangeText={setPassword}
              placeholder="비밀번호"
              placeholderTextColor={theme.colors.textMuted}
              secureTextEntry
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                  color: theme.colors.text,
                },
              ]}
              textContentType="password"
              value={password}
            />
          </View>
        </View>

        {errorMessage ? <InlineNotice tone="danger" message={errorMessage} /> : null}

        <Button fullWidth loading={login.isPending} onPress={submit} size="large">
          로그인
        </Button>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    gap: spacing[6],
    paddingTop: spacing[4],
  },
  form: {
    gap: spacing[4],
  },
  fields: {
    gap: spacing[4],
  },
  field: {
    gap: spacing[2],
  },
  input: {
    borderRadius: radii.md,
    borderWidth: 1,
    fontSize: typography.size.body,
    minHeight: 48,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
  },
});
