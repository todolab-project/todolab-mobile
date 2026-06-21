import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.eyebrow}>TODOLAB</Text>
        <Text style={styles.title}>오늘 해야 할 일에 집중하세요.</Text>
        <Text style={styles.description}>
          ToDoLab 모바일 애플리케이션의 새로운 시작입니다.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
    gap: 16,
  },
  eyebrow: {
    color: '#2563EB',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 2,
  },
  title: {
    color: '#111827',
    fontSize: 34,
    fontWeight: '700',
    lineHeight: 44,
  },
  description: {
    color: '#6B7280',
    fontSize: 16,
    lineHeight: 24,
  },
});
