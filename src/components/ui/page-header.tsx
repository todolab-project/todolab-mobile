import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { spacing } from '@/theme';

import { AppText } from './app-text';

type PageHeaderProps = {
  title: string;
  description?: string;
  leading?: ReactNode;
  action?: ReactNode;
};

export function PageHeader({ title, description, leading, action }: PageHeaderProps) {
  return (
    <View style={styles.container}>
      {leading}
      <View style={styles.copy}>
        <AppText accessibilityRole="header" variant="title" weight="bold">
          {title}
        </AppText>
        {description ? (
          <AppText tone="secondary" variant="label">
            {description}
          </AppText>
        ) : null}
      </View>
      {action ? <View style={styles.action}>{action}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing[3],
  },
  copy: {
    flex: 1,
    gap: spacing[1],
    minWidth: 0,
  },
  action: {
    flexShrink: 0,
  },
});
