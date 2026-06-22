import type { SymbolViewProps } from 'expo-symbols';
import { SymbolView } from 'expo-symbols';
import type { ColorValue } from 'react-native';

type TabBarIconProps = {
  color: ColorValue;
  name: SymbolViewProps['name'];
  size: number;
};

export function TabBarIcon({ color, name, size }: TabBarIconProps) {
  return (
    <SymbolView
      name={name}
      size={size}
      tintColor={color}
      type="hierarchical"
      weight="semibold"
    />
  );
}
