import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Href } from 'expo-router';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { AppText, Button, IconButton, InlineNotice, PageHeader, Screen } from '@/components/ui';
import { authApi, getUserFacingApiErrorMessage } from '@/services/api';
import { radii, spacing, typography, useAppTheme } from '@/theme';

export function LoginOverview() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string; expired?: string; registered?: string }>();
  const queryClient = useQueryClient();
  const theme = useAppTheme();
  const passwordInputRef = useRef<TextInput>(null);
  const [email, setEmail] = useState(() => params.email ?? '');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
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
              editable={!login.isPending}
              inputMode="email"
              onChangeText={setEmail}
              onSubmitEditing={() => passwordInputRef.current?.focus()}
              placeholder="you@example.com"
              placeholderTextColor={theme.colors.textMuted}
              returnKeyType="next"
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
            <View
              style={[
                styles.passwordField,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              <TextInput
                ref={passwordInputRef}
                accessibilityLabel="비밀번호"
                autoCapitalize="none"
                autoComplete="password"
                editable={!login.isPending}
                onChangeText={setPassword}
                onSubmitEditing={submit}
                placeholder="비밀번호"
                placeholderTextColor={theme.colors.textMuted}
                returnKeyType="done"
                secureTextEntry={!passwordVisible}
                style={[styles.passwordInput, { color: theme.colors.text }]}
                textContentType="password"
                value={password}
              />
              <Pressable
                accessibilityLabel={passwordVisible ? '비밀번호 숨기기' : '비밀번호 보기'}
                accessibilityRole="button"
                disabled={login.isPending}
                onPress={() => setPasswordVisible((visible) => !visible)}
                style={styles.passwordToggle}
              >
                <AppText tone="secondary" variant="caption" weight="bold">
                  {passwordVisible ? '숨김' : '보기'}
                </AppText>
              </Pressable>
            </View>
          </View>
        </View>

        {params.registered === '1' ? (
          <InlineNotice tone="success" message="회원가입이 완료됐어요. 로그인해 주세요." />
        ) : null}
        {params.expired === '1' ? (
          <InlineNotice tone="warning" message="세션이 만료됐어요. 다시 로그인해 주세요." />
        ) : null}
        {errorMessage ? <InlineNotice tone="danger" message={errorMessage} /> : null}

        <Button fullWidth loading={login.isPending} onPress={submit} size="large">
          로그인
        </Button>
        <Button
          fullWidth
          disabled={login.isPending}
          onPress={() => router.push('/register' as Href)}
          variant="ghost"
        >
          계정 만들기
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
  passwordField: {
    alignItems: 'center',
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 48,
    paddingLeft: spacing[3],
    paddingRight: spacing[2],
  },
  passwordInput: {
    flex: 1,
    fontSize: typography.size.body,
    paddingVertical: spacing[2],
  },
  passwordToggle: {
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: spacing[2],
  },
});
