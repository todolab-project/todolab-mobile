import { Platform, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  ReduceMotion,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { AppText } from '@/components/ui';
import { TaskCard } from '@/features/tasks';
import { radii, spacing, useAppTheme } from '@/theme';
import type { TaskResponse } from '@/types';

const TASK_ROW_HEIGHT = 68;

type WebKeyDownEvent = {
  nativeEvent: { key: string };
  preventDefault: () => void;
};

type DraggableTodayTaskListProps = {
  tasks: TaskResponse[];
  disabled: boolean;
  completingTaskId?: number;
  onComplete: (taskId: number) => void;
  onOpen: (taskId: number) => void;
  onMove: (taskId: number, fromIndex: number, toIndex: number) => void;
  onMoveOneStep: (taskId: number, direction: 'UP' | 'DOWN') => void;
};

export function DraggableTodayTaskList({
  tasks,
  disabled,
  completingTaskId,
  onComplete,
  onOpen,
  onMove,
  onMoveOneStep,
}: DraggableTodayTaskListProps) {
  return (
    <View style={styles.list}>
      {tasks.map((task, index) => (
        <DraggableTodayTask
          key={task.id}
          task={task}
          index={index}
          taskCount={tasks.length}
          disabled={disabled}
          isCompleting={completingTaskId === task.id}
          onComplete={() => onComplete(task.id)}
          onOpen={() => onOpen(task.id)}
          onMove={(toIndex) => onMove(task.id, index, toIndex)}
          onMoveOneStep={(direction) => onMoveOneStep(task.id, direction)}
        />
      ))}
    </View>
  );
}

type DraggableTodayTaskProps = {
  task: TaskResponse;
  index: number;
  taskCount: number;
  disabled: boolean;
  isCompleting: boolean;
  onComplete: () => void;
  onOpen: () => void;
  onMove: (toIndex: number) => void;
  onMoveOneStep: (direction: 'UP' | 'DOWN') => void;
};

function DraggableTodayTask({
  task,
  index,
  taskCount,
  disabled,
  isCompleting,
  onComplete,
  onOpen,
  onMove,
  onMoveOneStep,
}: DraggableTodayTaskProps) {
  const theme = useAppTheme();
  const translationY = useSharedValue(0);
  const isDragging = useSharedValue(false);

  const finishDrag = (offset: number) => {
    const targetIndex = clamp(index + Math.round(offset / TASK_ROW_HEIGHT), 0, taskCount - 1);
    if (targetIndex !== index) onMove(targetIndex);
  };

  const pan = Gesture.Pan()
    .enabled(!disabled && taskCount > 1)
    .activateAfterLongPress(250)
    .onBegin(() => {
      isDragging.value = true;
    })
    .onUpdate((event) => {
      translationY.value = event.translationY;
    })
    .onEnd((event) => {
      runOnJS(finishDrag)(event.translationY);
    })
    .onFinalize(() => {
      translationY.value = withSpring(0, {
        damping: 18,
        reduceMotion: ReduceMotion.System,
        stiffness: 220,
      });
      isDragging.value = false;
    });

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: isDragging.value ? 0.94 : 1,
    transform: [{ translateY: translationY.value }, { scale: isDragging.value ? 1.01 : 1 }],
    zIndex: isDragging.value ? 2 : 0,
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        style={[styles.item, { backgroundColor: theme.colors.surface }, animatedStyle]}
      >
        <TaskCard
          task={task}
          onOpen={onOpen}
          completionDisabled={disabled}
          isCompleting={isCompleting}
          onComplete={onComplete}
          trailing={
            taskCount > 1 ? (
              <View
                accessible
                accessibilityActions={[
                  ...(index > 0 ? [{ name: 'moveUp', label: '위로 이동' }] : []),
                  ...(index < taskCount - 1 ? [{ name: 'moveDown', label: '아래로 이동' }] : []),
                ]}
                accessibilityHint="접근성 동작에서 위로 또는 아래로 이동할 수 있습니다."
                accessibilityLabel={`${task.title}, 실행 순서 ${index + 1}번째`}
                focusable={Platform.OS === 'web'}
                {...(Platform.OS === 'web'
                  ? {
                      onKeyDown: (event: WebKeyDownEvent) => {
                        if (event.nativeEvent.key === 'ArrowUp' && index > 0) {
                          event.preventDefault();
                          onMoveOneStep('UP');
                        }
                        if (event.nativeEvent.key === 'ArrowDown' && index < taskCount - 1) {
                          event.preventDefault();
                          onMoveOneStep('DOWN');
                        }
                      },
                    }
                  : {})}
                onAccessibilityAction={(event) => {
                  if (event.nativeEvent.actionName === 'moveUp' && index > 0) {
                    onMoveOneStep('UP');
                  }
                  if (event.nativeEvent.actionName === 'moveDown' && index < taskCount - 1) {
                    onMoveOneStep('DOWN');
                  }
                }}
                style={
                  Platform.OS === 'web' ? styles.webReorderControl : styles.nativeReorderControl
                }
                tabIndex={Platform.OS === 'web' ? 0 : undefined}
              >
                {Platform.OS === 'web' ? (
                  <AppText tone="muted" variant="bodyLarge">
                    ⠿
                  </AppText>
                ) : null}
              </View>
            ) : null
          }
        />
      </Animated.View>
    </GestureDetector>
  );
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
}

const styles = StyleSheet.create({
  list: {
    gap: spacing[0],
  },
  item: {
    borderRadius: radii.none,
  },
  nativeReorderControl: {
    height: 1,
    opacity: 0,
    position: 'absolute',
    width: 1,
  },
  webReorderControl: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
});
