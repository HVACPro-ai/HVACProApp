import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function ExploreScreen() {
  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        <ThemedView style={styles.headerContent}>
          <IconSymbol name="magnifyingglass" size={60} />
          <ThemedText type="title">Explore</ThemedText>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">About</ThemedText>
          <ThemedText>
            Welcome to the HVAC Pro App! This app helps HVAC professionals manage their work efficiently.
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Features</ThemedText>
          <ThemedText>• Diagnostic tools</ThemedText>
          <ThemedText>• Inventory management</ThemedText>
          <ThemedText>• Job scheduling</ThemedText>
        </ThemedView>

        <ThemedText type="link" style={styles.link}>
          Visit our website
        </ThemedText>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 10,
  },
  section: {
    padding: 20,
    gap: 10,
  },
  link: {
    padding: 20,
  }
}); 