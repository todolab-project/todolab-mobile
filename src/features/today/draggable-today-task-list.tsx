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

type DraggableTodayTaskListProps = {
  tasks: TaskResponse[];
  disabled: boolean;
  completingTaskId?: number;
  onComplete: (taskId: number) => void;
  onOpen: (taskId: number) => void;
  onMove: (taskId: number, fromIndex: number, toIndex: number) => void;
};

export function DraggableTodayTaskList({
  tasks,
  disabled,
  completingTaskId,
  onComplete,
  onOpen,
  onMove,
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
            Platform.OS === 'web' && taskCount > 1 ? (
              <AppText
                accessibilityLabel={`${task.title}, 드래그해서 실행 순서 이동`}
                tone="muted"
                variant="bodyLarge"
                style={styles.dragHandle}
              >
                ⠿
              </AppText>
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
    gap: spacing[2],
  },
  item: {
    borderRadius: radii.sm,
  },
  dragHandle: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[3],
  },
});
