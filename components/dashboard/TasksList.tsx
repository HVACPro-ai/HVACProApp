import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '../ThemedText';
import { Task } from '@/src/hooks/useDashboardData';
import { Ionicons } from '@expo/vector-icons';
import { TaskDetailsModal } from './TaskDetailsModal';
import { updateTaskStatus } from '@/src/api/tasksApi';

interface Props {
  tasks: Task[];
  onTaskUpdate?: (updatedTask: Task) => void;
}

export function TasksList({ tasks, onTaskUpdate }: Props) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleTaskPress = (task: Task) => {
    setSelectedTask(task);
    setModalVisible(true);
  };

  const handleUpdateStatus = async (taskId: string, newStatus: Task['status']) => {
    try {
      const updatedTask = await updateTaskStatus(taskId, newStatus);
      onTaskUpdate?.(updatedTask);
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Today's Tasks</ThemedText>
      {tasks.map(task => (
        <TouchableOpacity 
          key={task.id} 
          style={styles.taskCard}
          onPress={() => handleTaskPress(task)}
        >
          <View style={styles.taskHeader}>
            <View style={[styles.priorityDot, { 
              backgroundColor: 
                task.priority === 'high' ? '#FF3B30' :
                task.priority === 'medium' ? '#FF9500' :
                '#34C759'
            }]} />
            <ThemedText style={styles.taskTitle}>{task.title}</ThemedText>
          </View>
          <View style={styles.taskInfo}>
            <ThemedText style={styles.taskTime}>{task.dueTime}</ThemedText>
            <View style={styles.taskStatus}>
              <Ionicons
                name={
                  task.status === 'completed' ? 'checkmark-circle' :
                  task.status === 'in_progress' ? 'time' :
                  'hourglass'
                }
                size={16}
                color={
                  task.status === 'completed' ? '#34C759' :
                  task.status === 'in_progress' ? '#FF9500' :
                  '#8E8E93'
                }
              />
              <ThemedText style={styles.statusText}>
                {task.status.replace('_', ' ')}
              </ThemedText>
            </View>
          </View>
        </TouchableOpacity>
      ))}

      <TaskDetailsModal
        task={selectedTask}
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setSelectedTask(null);
        }}
        onUpdateStatus={handleUpdateStatus}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  taskCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  taskInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskTime: {
    color: '#666',
  },
  taskStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    marginLeft: 5,
    color: '#666',
    fontSize: 14,
    textTransform: 'capitalize',
  },
}); 