import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { ThemedText } from '../ThemedText';
import { ThemedButton } from '../ThemedButton';
import { Ionicons } from '@expo/vector-icons';
import { PartOrderService } from '../../services/partOrderService';

interface Props {
  orderId: string;
  onClose: () => void;
}

export function OrderTracking({ orderId, onClose }: Props) {
  const [status, setStatus] = useState<{
    status: 'pending' | 'processing' | 'shipped' | 'delivered';
    estimatedDelivery?: Date;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const progressAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const checkStatus = async () => {
    try {
      const orderStatus = await PartOrderService.checkOrderStatus(orderId);
      setStatus(orderStatus);
      
      // Animate progress based on status
      const progressValue = 
        orderStatus.status === 'delivered' ? 1 :
        orderStatus.status === 'shipped' ? 0.75 :
        orderStatus.status === 'processing' ? 0.5 :
        0.25;

      Animated.timing(progressAnim, {
        toValue: progressValue,
        duration: 500,
        useNativeDriver: false,
      }).start();
    } catch (error) {
      console.error('Failed to check order status:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Order Status</ThemedText>
        <ThemedText style={styles.orderId}>Order ID: {orderId}</ThemedText>
      </View>

      <View style={styles.progressContainer}>
        <Animated.View 
          style={[
            styles.progressBar,
            {
              width: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]} 
        />
        
        <View style={styles.statusIcons}>
          {['pending', 'processing', 'shipped', 'delivered'].map((step, index) => (
            <View key={step} style={styles.statusIcon}>
              <Ionicons
                name={status?.status === step ? 'checkmark-circle' : 'ellipse-outline'}
                size={24}
                color={status?.status === step ? '#4CAF50' : '#666'}
              />
              <ThemedText style={styles.statusText}>
                {step.charAt(0).toUpperCase() + step.slice(1)}
              </ThemedText>
            </View>
          ))}
        </View>
      </View>

      {status?.estimatedDelivery && (
        <ThemedText style={styles.delivery}>
          Estimated Delivery: {status.estimatedDelivery.toLocaleDateString()}
        </ThemedText>
      )}

      <ThemedButton
        title="Close"
        onPress={onClose}
        style={styles.closeButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  orderId: {
    color: '#666',
    marginTop: 4,
  },
  progressContainer: {
    height: 80,
    marginBottom: 24,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#4CAF50',
    position: 'absolute',
    top: 12,
    left: 0,
  },
  statusIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
  },
  statusIcon: {
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    marginTop: 4,
  },
  delivery: {
    textAlign: 'center',
    marginBottom: 16,
    color: '#666',
  },
  closeButton: {
    marginTop: 16,
  },
}); 