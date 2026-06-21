import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, View } from 'react-native';

import { spacing, typography, useAppTheme } from '@/theme';

export default function HomeScreen() {
  const theme = useAppTheme();

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.container}>
        <Text style={[styles.eyebrow, { color: theme.colors.primary }]}>TODOLAB</Text>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          오늘 해야 할 일에 집중하세요.
        </Text>
        <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
          ToDoLab 모바일 애플리케이션의 새로운 시작입니다.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing[7],
    gap: spacing[4],
  },
  eyebrow: {
    fontSize: typography.size.label,
    fontWeight: typography.weight.bold,
    letterSpacing: typography.letterSpacing.wide,
  },
  title: {
    fontSize: typography.size.display,
    fontWeight: typography.weight.bold,
    lineHeight: typography.lineHeight.display,
    letterSpacing: typography.letterSpacing.tight,
  },
  description: {
    fontSize: typography.size.body,
    lineHeight: typography.lineHeight.body,
  },
});
