import React from 'react';
import { View, ViewProps, useColorScheme } from 'react-native';

interface ThemedViewProps extends ViewProps {
  children: React.ReactNode;
}

export const ThemedView: React.FC<ThemedViewProps> = ({ style, children, ...props }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View
      style={[
        { backgroundColor: isDark ? '#000' : '#fff' },
        style
      ]}
      {...props}
    >
      {children}
    </View>
  );
}; 