import React from 'react';
import { Animated, StyleSheet, ViewStyle } from 'react-native';

interface Props {
  children: React.ReactNode;
  direction: 'left' | 'right';
  style?: ViewStyle | Animated.AnimatedProps<ViewStyle>;
}

export function AnimatedStepTransition({ children, direction, style }: Props) {
  const slideAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: direction === 'right' ? 1 : -1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [direction]);

  const animatedStyle = {
    transform: [
      {
        translateX: slideAnim.interpolate({
          inputRange: [-1, 0, 1],
          outputRange: [-300, 0, 300],
        }),
      },
    ],
  };

  return (
    <Animated.View style={[styles.container, style, animatedStyle]}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
}); 