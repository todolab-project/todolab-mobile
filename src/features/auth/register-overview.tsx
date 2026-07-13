import { useMutation } from '@tanstack/react-query';
import type { Href } from 'expo-router';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, TextInput, View } from 'react-native';

import { AppText, Button, IconButton, InlineNotice, PageHeader, Screen } from '@/components/ui';
import { authApi, getUserFacingApiErrorMessage } from '@/services/api';
import { radii, spacing, typography, useAppTheme } from '@/theme';

export function RegisterOverview() {
  const router = useRouter();
  const theme = useAppTheme();
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const register = useMutation({
    mutationFn: () =>
      authApi.register({
        email: email.trim(),
        displayName: displayName.trim(),
        password,
      }),
    onSuccess: () => {
      setValidationMessage(null);
      router.replace({
        pathname: '/login',
        params: { email: email.trim(), registered: '1' },
      } as Href);
    },
  });
  const errorMessage =
    validationMessage ?? (register.error ? getUserFacingApiErrorMessage(register.error) : null);

  const submit = () => {
    const normalizedEmail = email.trim();
    const normalizedDisplayName = displayName.trim();
    if (!normalizedEmail || !normalizedDisplayName || !password) {
      setValidationMessage('이메일, 이름, 비밀번호를 입력해 주세요.');
      return;
    }

    if (password.length < 8) {
      setValidationMessage('비밀번호는 8자 이상 입력해 주세요.');
      return;
    }

    setValidationMessage(null);
    register.mutate();
  };

  return (
    <Screen contentContainerStyle={styles.screen}>
      <PageHeader
        title="회원가입"
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
              accessibilityLabel="회원가입 이메일"
              autoCapitalize="none"
              autoComplete="email"
              editable={!register.isPending}
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
              이름
            </AppText>
            <TextInput
              accessibilityLabel="표시 이름"
              autoCapitalize="none"
              autoComplete="name"
              editable={!register.isPending}
              maxLength={50}
              onChangeText={setDisplayName}
              placeholder="나의 플래너"
              placeholderTextColor={theme.colors.textMuted}
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                  color: theme.colors.text,
                },
              ]}
              textContentType="name"
              value={displayName}
            />
          </View>

          <View style={styles.field}>
            <AppText variant="label" weight="bold">
              비밀번호
            </AppText>
            <TextInput
              accessibilityLabel="회원가입 비밀번호"
              autoCapitalize="none"
              autoComplete="password-new"
              editable={!register.isPending}
              onChangeText={setPassword}
              placeholder="8자 이상"
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
              textContentType="newPassword"
              value={password}
            />
          </View>
        </View>

        {errorMessage ? <InlineNotice tone="danger" message={errorMessage} /> : null}

        <Button fullWidth loading={register.isPending} onPress={submit} size="large">
          회원가입
        </Button>
        <Button fullWidth disabled={register.isPending} onPress={router.back} variant="ghost">
          로그인으로 돌아가기
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
