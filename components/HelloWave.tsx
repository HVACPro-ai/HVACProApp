import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from './ThemedText';

export function HelloWave() {
  return (
    <View style={styles.container}>
      <ThemedText type="title">👋 Hello!</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
}); 