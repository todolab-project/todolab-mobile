import { StyleSheet, View } from 'react-native';

import { AppText, Button, Card, Screen } from '@/components/ui';
import { spacing } from '@/theme';

export default function HomeScreen() {
  return (
    <Screen contentContainerStyle={styles.screen}>
      <View style={styles.intro}>
        <AppText
          tone="primary"
          variant="label"
          weight="bold"
          style={styles.eyebrow}
        >
          TODOLAB
        </AppText>
        <AppText variant="display" weight="bold">
          오늘 해야 할 일에 집중하세요.
        </AppText>
        <AppText tone="secondary">
          ToDoLab 모바일 애플리케이션의 새로운 시작입니다.
        </AppText>
      </View>

      <Card style={styles.card}>
        <AppText variant="bodyLarge" weight="bold">
          오늘의 흐름
        </AppText>
        <AppText tone="secondary">
          빠르게 기록하고, 오늘 할 일을 고른 뒤 하나씩 완료해 보세요.
        </AppText>
        <Button disabled fullWidth>
          곧 시작할 수 있어요
        </Button>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    gap: spacing[8],
    justifyContent: 'center',
  },
  intro: {
    gap: spacing[4],
  },
  eyebrow: {
    letterSpacing: 1.6,
  },
  card: {
    gap: spacing[4],
  },
});
