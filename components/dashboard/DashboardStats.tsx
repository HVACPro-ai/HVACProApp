import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '../ThemedText';
import { DashboardStat } from '@/src/hooks/useDashboardData';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  stats: DashboardStat[];
}

export function DashboardStats({ stats }: Props) {
  return (
    <View style={styles.container}>
      {stats.map((stat, index) => (
        <View key={stat.label} style={styles.statCard}>
          <ThemedText style={styles.label}>{stat.label}</ThemedText>
          <ThemedText style={styles.value}>
            {stat.label === 'Revenue' ? '$' : ''}{stat.value}
          </ThemedText>
          <View style={styles.trendContainer}>
            <Ionicons
              name={
                stat.trend === 'up'
                  ? 'arrow-up'
                  : stat.trend === 'down'
                  ? 'arrow-down'
                  : 'remove'
              }
              size={16}
              color={
                stat.trend === 'up'
                  ? '#34C759'
                  : stat.trend === 'down'
                  ? '#FF3B30'
                  : '#8E8E93'
              }
            />
            <ThemedText
              style={[
                styles.change,
                {
                  color:
                    stat.trend === 'up'
                      ? '#34C759'
                      : stat.trend === 'down'
                      ? '#FF3B30'
                      : '#8E8E93',
                },
              ]}
            >
              {stat.change}%
            </ThemedText>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  statCard: {
    width: '45%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    margin: '2.5%',
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  change: {
    marginLeft: 5,
    fontSize: 14,
  },
}); 