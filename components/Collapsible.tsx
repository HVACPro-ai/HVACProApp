import React, { useState } from 'react';
import { StyleSheet, Pressable, View, Animated } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { IconSymbol } from './ui/IconSymbol';

type CollapsibleProps = {
  title: string;
  children: React.ReactNode;
};

export function Collapsible({ title, children }: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ThemedView style={styles.container}>
      <Pressable 
        style={styles.header} 
        onPress={() => setIsOpen(!isOpen)}
      >
        <ThemedText type="subtitle">{title}</ThemedText>
        <IconSymbol 
          name={isOpen ? "chevron.up" : "chevron.down"} 
          size={20} 
        />
      </Pressable>
      {isOpen && (
        <View style={styles.content}>
          {children}
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  content: {
    padding: 16,
    paddingTop: 0,
  },
}); 