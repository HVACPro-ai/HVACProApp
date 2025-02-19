import React from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ThemedView } from '../ThemedView';
import { ThemedText } from '../ThemedText';
import { ThemedButton } from '../ThemedButton';
import { Task } from '@/src/hooks/useDashboardData';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  task: Task | null;
  visible: boolean;
  onClose: () => void;
  onUpdateStatus: (taskId: string, newStatus: Task['status']) => void;
}

export function TaskDetailsModal({ task, visible, onClose, onUpdateStatus }: Props) {
  if (!task) return null;

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed': return '#34C759';
      case 'in_progress': return '#FF9500';
      default: return '#8E8E93';
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return '#FF3B30';
      case 'medium': return '#FF9500';
      default: return '#34C759';
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <ThemedView style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>

          <ScrollView style={styles.scrollView}>
            <View style={styles.header}>
              <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(task.priority) }]}>
                <ThemedText style={styles.priorityText}>{task.priority}</ThemedText>
              </View>
              <ThemedText style={styles.time}>{task.dueTime}</ThemedText>
            </View>

            <ThemedText style={styles.title}>{task.title}</ThemedText>

            <View style={styles.statusSection}>
              <ThemedText style={styles.sectionTitle}>Status</ThemedText>
              <View style={styles.statusButtons}>
                {(['pending', 'in_progress', 'completed'] as const).map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.statusButton,
                      { 
                        backgroundColor: task.status === status 
                          ? getStatusColor(status) 
                          : '#f0f0f0'
                      }
                    ]}
                    onPress={() => onUpdateStatus(task.id, status)}
                  >
                    <ThemedText style={[
                      styles.statusButtonText,
                      { color: task.status === status ? '#fff' : '#666' }
                    ]}>
                      {status.replace('_', ' ')}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.typeSection}>
              <ThemedText style={styles.sectionTitle}>Type</ThemedText>
              <View style={styles.typeTag}>
                <Ionicons
                  name={
                    task.type === 'service_call' ? 'build' :
                    task.type === 'installation' ? 'hammer' :
                    task.type === 'maintenance' ? 'construct' :
                    'document-text'
                  }
                  size={20}
                  color="#007AFF"
                />
                <ThemedText style={styles.typeText}>
                  {task.type.replace('_', ' ')}
                </ThemedText>
              </View>
            </View>

            <ThemedButton
              title="Start Navigation"
              onPress={() => {/* TODO: Implement navigation */}}
              style={styles.navigationButton}
            />
          </ScrollView>
        </ThemedView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: '80%',
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    top: 20,
    zIndex: 1,
  },
  scrollView: {
    marginTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  priorityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  priorityText: {
    color: '#fff',
    textTransform: 'capitalize',
    fontSize: 14,
  },
  time: {
    fontSize: 16,
    color: '#666',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  statusSection: {
    marginBottom: 20,
  },
  statusButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  statusButtonText: {
    textTransform: 'capitalize',
    fontWeight: '500',
  },
  typeSection: {
    marginBottom: 20,
  },
  typeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
  },
  typeText: {
    marginLeft: 8,
    fontSize: 16,
    textTransform: 'capitalize',
  },
  navigationButton: {
    marginTop: 20,
  },
}); 