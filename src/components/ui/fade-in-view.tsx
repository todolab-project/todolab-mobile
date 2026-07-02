import { useEffect, useState, type ComponentProps } from 'react';
import { AccessibilityInfo, Animated } from 'react-native';

type FadeInViewProps = ComponentProps<typeof Animated.View> & {
  duration: number;
};

export function FadeInView({ duration, style, ...props }: FadeInViewProps) {
  const [opacity] = useState(() => new Animated.Value(duration > 0 ? 0 : 1));

  useEffect(() => {
    if (duration <= 0) {
      opacity.setValue(1);
      return;
    }

    let active = true;
    let animation: Animated.CompositeAnimation | null = null;

    void AccessibilityInfo.isReduceMotionEnabled().then((reduceMotion) => {
      if (!active || reduceMotion) {
        opacity.setValue(1);
        return;
      }

      animation = Animated.timing(opacity, {
        duration,
        toValue: 1,
        useNativeDriver: true,
      });
      animation.start();
    });

    return () => {
      active = false;
      animation?.stop();
    };
  }, [duration, opacity]);

  return <Animated.View {...props} style={[{ opacity }, style]} />;
}
