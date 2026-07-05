import { useRouter } from 'expo-router';
import type { SymbolViewProps } from 'expo-symbols';
import { SymbolView } from 'expo-symbols';
import { StyleSheet, View } from 'react-native';

import { EmptyState, IconButton, PageHeader, Screen } from '@/components/ui';
import { radii, spacing, useAppTheme } from '@/theme';

type MoreDestinationScreenProps = {
  title: string;
  description: string;
  icon: SymbolViewProps['name'];
};

export function MoreDestinationScreen({ title, description, icon }: MoreDestinationScreenProps) {
  const router = useRouter();
  const theme = useAppTheme();

  return (
    <Screen contentContainerStyle={styles.screen}>
      <PageHeader
        title={title}
        leading={
          <IconButton accessibilityLabel="프로필 화면으로 돌아가기" onPress={router.back}>
            <SymbolView
              name={{ ios: 'chevron.left', android: 'arrow_back', web: 'arrow_back' }}
              size={20}
              tintColor={theme.colors.text}
            />
          </IconButton>
        }
      />
      <EmptyState
        icon={
          <View style={[styles.icon, { backgroundColor: theme.colors.primarySoft }]}>
            <SymbolView
              name={icon}
              size={20}
              tintColor={theme.colors.primary}
              type="hierarchical"
            />
          </View>
        }
        title="설정은 준비 중이에요"
        description={description}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    gap: spacing[5],
    paddingTop: spacing[3],
  },
  icon: {
    alignItems: 'center',
    borderRadius: radii.md,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
});
