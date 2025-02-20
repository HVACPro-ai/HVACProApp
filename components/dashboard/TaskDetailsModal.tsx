import React, { useState, useEffect } from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, ScrollView, Linking, ActivityIndicator, Platform, ActionSheetIOS, Alert } from 'react-native';
import { ThemedView } from '../ThemedView';
import { ThemedText } from '../ThemedText';
import { ThemedButton } from '../ThemedButton';
import { Task } from '@/src/types/Task';
import { Ionicons } from '@expo/vector-icons';
import { getTaskDetails, TaskDetails, getServiceHistory, ServiceHistory, ServiceImage } from '@/src/api/tasksApi';
import { ServiceHistoryView } from './ServiceHistoryView';
import { ImageUploader } from './ImageUploader';
import { uploadImage, updateImageCaption } from '@/src/api/imageApi';
import { ImageGallery } from './ImageGallery';

interface Props {
  task: Task | null;
  visible: boolean;
  onClose: () => void;
  onUpdateStatus: (taskId: string, newStatus: Task['status']) => void;
}

export function TaskDetailsModal({ task, visible, onClose, onUpdateStatus }: Props) {
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState<TaskDetails | null>(null);
  const [history, setHistory] = useState<ServiceHistory[]>([]);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    if (task && visible) {
      loadTaskDetails();
    } else {
      setDetails(null);
      setHistory([]);
    }
  }, [task, visible]);

  const loadTaskDetails = async () => {
    if (!task) return;
    setLoading(true);
    try {
      const [taskDetails, serviceHistory] = await Promise.all([
        getTaskDetails(task.id),
        getServiceHistory(task.id),
      ]);
      setDetails(taskDetails);
      setHistory(serviceHistory);
    } catch (error) {
      console.error('Error loading task details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (taskId: string, newStatus: Task['status']) => {
    setUpdatingStatus(true);
    try {
      await onUpdateStatus(taskId, newStatus);
      if (details) {
        setDetails({ ...details, status: newStatus });
      }
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleNavigation = async () => {
    if (!details) return;
    
    const address = encodeURIComponent(details.customer.address);
    
    // On iOS, we'll show an action sheet to choose the map app
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Apple Maps', 'Google Maps'],
          cancelButtonIndex: 0,
        },
        async (buttonIndex) => {
          if (buttonIndex === 1) {
            // Apple Maps
            const url = `maps://?daddr=${address}`;
            await Linking.openURL(url);
          } else if (buttonIndex === 2) {
            // Google Maps
            const url = `https://www.google.com/maps/dir/?api=1&destination=${address}`;
            await Linking.openURL(url);
          }
        }
      );
    } else {
      // On Android, default to Google Maps
      const url = `https://www.google.com/maps/dir/?api=1&destination=${address}`;
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      }
    }
  };

  const handleCall = async () => {
    if (!details) return;
    const url = `tel:${details.customer.phone}`;
    await Linking.openURL(url);
  };

  const handleEmail = async () => {
    if (!details) return;
    const url = `mailto:${details.customer.email}`;
    await Linking.openURL(url);
  };

  const handleImageCaptured = async (newImage: ServiceImage) => {
    if (!details || !task) return;

    try {
      // Upload the image
      const uploadedImage = await uploadImage(
        newImage.url,
        newImage.type,
        task.id
      );

      // Update the local state with the new image
      setDetails({
        ...details,
        images: [...details.images, uploadedImage],
      });
    } catch (error) {
      console.error('Error handling captured image:', error);
      Alert.alert('Error', 'Failed to process image. Please try again.');
    }
  };

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
        <ThemedView style={[
          styles.modalContent,
          loading ? styles.modalContentLoading : null
        ]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <ThemedText style={styles.loadingText}>Loading details...</ThemedText>
            </View>
          ) : (
            <>
              {details && (
                <View style={styles.quickActions}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={handleCall}
                  >
                    <Ionicons name="call" size={24} color="#007AFF" />
                    <ThemedText style={styles.actionText}>Call</ThemedText>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={handleEmail}
                  >
                    <Ionicons name="mail" size={24} color="#007AFF" />
                    <ThemedText style={styles.actionText}>Email</ThemedText>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={handleNavigation}
                  >
                    <Ionicons name="navigate" size={24} color="#007AFF" />
                    <ThemedText style={styles.actionText}>Navigate</ThemedText>
                  </TouchableOpacity>
                </View>
              )}

              <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={true}
              >
                <View style={styles.header}>
                  <View style={[styles.priorityBadge, { 
                    backgroundColor: getPriorityColor(task.priority) 
                  }]}>
                    <ThemedText style={styles.priorityText}>
                      {task.priority}
                    </ThemedText>
                  </View>
                  <ThemedText style={styles.time}>{task.dueTime}</ThemedText>
                </View>

                <ThemedText style={styles.title}>{task.title}</ThemedText>

                {details && (
                  <>
                    <View style={styles.section}>
                      <ThemedText style={styles.sectionTitle}>Customer</ThemedText>
                      <View style={styles.customerInfo}>
                        <ThemedText style={styles.customerName}>
                          {details.customer.name}
                        </ThemedText>
                      </View>
                      <ThemedText style={styles.address}>
                        {details.customer.address}
                      </ThemedText>
                    </View>

                    <View style={styles.section}>
                      <ThemedText style={styles.sectionTitle}>Equipment</ThemedText>
                      <View style={styles.equipmentInfo}>
                        <ThemedText>Type: {details.equipment.type}</ThemedText>
                        <ThemedText>Model: {details.equipment.model}</ThemedText>
                        <ThemedText>S/N: {details.equipment.serialNumber}</ThemedText>
                        <ThemedText>Last Service: {details.equipment.lastService}</ThemedText>
                      </View>
                    </View>

                    <View style={styles.section}>
                      <ThemedText style={styles.sectionTitle}>Notes</ThemedText>
                      <ThemedText style={styles.notes}>{details.notes}</ThemedText>
                    </View>

                    <View style={styles.section}>
                      <ThemedText style={styles.sectionTitle}>Photos</ThemedText>
                      <ImageUploader onImageCaptured={handleImageCaptured} />
                      <ImageGallery images={details.images} />
                    </View>

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
                            onPress={() => handleStatusUpdate(task.id, status)}
                            disabled={updatingStatus}
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

                    <ServiceHistoryView history={history} />
                  </>
                )}
                
                <View style={styles.bottomPadding} />
              </ScrollView>
            </>
          )}
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
    maxHeight: '90%',
    backgroundColor: '#fff',
  },
  modalContentLoading: {
    height: '30%', // Smaller height when loading
    justifyContent: 'flex-start',
  },
  modalHeader: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  closeButton: {
    padding: 5,
  },
  scrollView: {
    maxHeight: '85%',
  },
  scrollContent: {
    padding: 15,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  actionButton: {
    alignItems: 'center',
    padding: 10,
    minWidth: 80,
  },
  actionText: {
    marginTop: 5,
    fontSize: 12,
    color: '#007AFF',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  bottomPadding: {
    height: 30,
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
  customerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  customerName: {
    fontSize: 18,
    fontWeight: '500',
  },
  address: {
    color: '#666',
  },
  equipmentInfo: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    gap: 5,
  },
  notes: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    color: '#666',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
}); 