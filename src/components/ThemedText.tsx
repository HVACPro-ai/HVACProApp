import React from 'react';
import { Text, TextProps, useColorScheme } from 'react-native';

interface ThemedTextProps extends TextProps {
  children: React.ReactNode;
}

export const ThemedText: React.FC<ThemedTextProps> = ({ style, children, ...props }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Text
      style={[
        { color: isDark ? '#fff' : '#000' },
        style
      ]}
      {...props}
    >
      {children}
    </Text>
  );
}; 