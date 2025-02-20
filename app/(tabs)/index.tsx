import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useDashboardData } from '@/src/hooks/useDashboardData';
import { WeatherCard } from '@/components/dashboard/WeatherCard';
import { TodaysTasks } from '@/components/dashboard/TodaysTasks';
import { RecentActivities } from '@/components/dashboard/RecentActivities';
import { ThemedText } from '@/components/ThemedText';

export default function TabOneScreen() {
  const { tasks, weather, loading, error, refreshData } = useDashboardData();

  return (
    <ScrollView style={styles.container}>
      <WeatherCard />
      
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Today's Tasks</ThemedText>
        <TodaysTasks tasks={tasks} />
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Recent Activity</ThemedText>
        <RecentActivities />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    marginHorizontal: 15,
  },
}); 