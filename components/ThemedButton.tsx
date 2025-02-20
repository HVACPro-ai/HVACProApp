import React from 'react';
import { Pressable, Text, StyleSheet, PressableProps, StyleProp, ViewStyle } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedButtonProps = Omit<PressableProps, 'style'> & {
  title: string;
  lightColor?: string;
  darkColor?: string;
  style?: StyleProp<ViewStyle>;
};

export function ThemedButton(props: ThemedButtonProps) {
  const { style, lightColor, darkColor, title, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'primary');
  const color = useThemeColor({ light: '#fff', dark: '#fff' }, 'text');

  return (
    <Pressable 
      {...otherProps}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: pressed ? `${backgroundColor}80` : backgroundColor },
        style
      ]}
    >
      <Text style={[styles.text, { color }]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 