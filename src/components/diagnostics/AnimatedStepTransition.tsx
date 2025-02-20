import React from 'react';
import { Animated, StyleSheet, Dimensions } from 'react-native';

interface Props {
  children: React.ReactNode;
  visible: boolean;
  direction?: 'left' | 'right';
}

export function AnimatedStepTransition({ children, visible, direction = 'right' }: Props) {
  const translateX = React.useRef(new Animated.Value(direction === 'right' ? 100 : -100)).current;
  const opacity = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: direction === 'right' ? 100 : -100,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, direction]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateX }],
          opacity,
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    position: 'absolute',
    left: 0,
    right: 0,
  },
}); 