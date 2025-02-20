import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';

export function OfflineBanner() {
  return (
    <ThemedView style={styles.banner}>
      <ThemedText style={styles.text}>You are offline</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#ff3b30',
    padding: 8,
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 14,
  },
}); 