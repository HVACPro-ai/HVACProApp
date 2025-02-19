import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

type ParallaxScrollViewProps = {
  children: React.ReactNode;
  headerImage?: React.ReactNode;
  headerBackgroundColor?: {
    light: string;
    dark: string;
  };
};

export default function ParallaxScrollView({ 
  children, 
  headerImage, 
  headerBackgroundColor 
}: ParallaxScrollViewProps) {
  const backgroundColor = useThemeColor(headerBackgroundColor || {}, 'background');

  return (
    <ScrollView style={styles.container} bounces={false}>
      <View style={[styles.header, { backgroundColor }]}>
        {headerImage}
      </View>
      <View style={styles.content}>
        {children}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 200,
    position: 'relative',
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    padding: 20,
    gap: 20,
  },
}); 