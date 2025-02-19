import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';
import { Ionicons } from '@expo/vector-icons';

interface Activity {
  id: string;
  type: 'service_call' | 'installation' | 'maintenance' | 'quote';
  customer: string;
  timestamp: string;
  description: string;
}

const MOCK_ACTIVITIES: Activity[] = [
  {
    id: '1',
    type: 'service_call',
    customer: 'John Smith',
    timestamp: '2 hours ago',
    description: 'AC not cooling - Replaced capacitor',
  },
  {
    id: '2',
    type: 'maintenance',
    customer: 'Sarah Johnson',
    timestamp: '4 hours ago',
    description: 'Annual maintenance check completed',
  },
  {
    id: '3',
    type: 'installation',
    customer: 'Mike Wilson',
    timestamp: 'Yesterday',
    description: 'New heat pump installation',
  },
];

export function RecentActivities() {
  const getActivityIcon = (type: Activity['type']): keyof typeof Ionicons.glyphMap => {
    switch (type) {
      case 'service_call':
        return 'build';
      case 'installation':
        return 'construct';
      case 'maintenance':
        return 'settings';
      case 'quote':
        return 'calculator';
      default:
        return 'help-circle';
    }
  };

  return (
    <View style={styles.container}>
      {MOCK_ACTIVITIES.map((activity) => (
        <TouchableOpacity key={activity.id} style={styles.activityItem}>
          <View style={styles.iconContainer}>
            <Ionicons 
              name={getActivityIcon(activity.type)} 
              size={24} 
              color="#007AFF" 
            />
          </View>
          
          <View style={styles.activityContent}>
            <View style={styles.activityHeader}>
              <ThemedText style={styles.customer}>
                {activity.customer}
              </ThemedText>
              <ThemedText style={styles.timestamp}>
                {activity.timestamp}
              </ThemedText>
            </View>
            
            <ThemedText style={styles.description}>
              {activity.description}
            </ThemedText>
          </View>
          
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 10,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5F1FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  customer: {
    fontSize: 16,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
});