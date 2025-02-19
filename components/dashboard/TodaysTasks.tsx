import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';
import { Task } from '@/src/types/Task';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  tasks: Task[];
}

export function TodaysTasks({ tasks }: Props) {
  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return '#FF3B30';
      case 'medium':
        return '#FF9500';
      case 'low':
        return '#34C759';
      default:
        return '#999';
    }
  };

  if (tasks.length === 0) {
    return (
      <ThemedView style={styles.emptyContainer}>
        <Ionicons name="checkmark-circle" size={48} color="#34C759" />
        <ThemedText style={styles.emptyText}>All caught up!</ThemedText>
        <ThemedText style={styles.emptySubtext}>
          No tasks scheduled for today
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <View style={styles.container}>
      {tasks.map((task) => (
        <TouchableOpacity key={task.id} style={styles.taskItem}>
          <View style={styles.taskContent}>
            <View style={styles.taskHeader}>
              <View style={[
                styles.priorityBadge,
                { backgroundColor: getPriorityColor(task.priority) }
              ]}>
                <ThemedText style={styles.priorityText}>
                  {task.priority}
                </ThemedText>
              </View>
              <ThemedText style={styles.time}>
                {task.dueTime}
              </ThemedText>
            </View>
            
            <ThemedText style={styles.title}>{task.title}</ThemedText>
            <ThemedText style={styles.description} numberOfLines={2}>
              {task.description}
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
  emptyContainer: {
    alignItems: 'center',
    padding: 30,
    margin: 15,
    borderRadius: 12,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 15,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 10,
  },
  taskContent: {
    flex: 1,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  priorityText: {
    color: '#fff',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  time: {
    fontSize: 12,
    color: '#666',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
}); 