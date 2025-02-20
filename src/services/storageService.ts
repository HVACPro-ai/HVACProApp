import AsyncStorage from '@react-native-async-storage/async-storage';
import type { DiagnosticState } from '../types';

const STORAGE_KEYS = {
  DIAGNOSTIC_DATA: 'diagnostic_data',
  PENDING_ORDERS: 'pending_orders',
  DIAGNOSTIC_HISTORY: 'diagnostic_history',
};

export class StorageService {
  static async saveDiagnosticData(data: DiagnosticState): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.DIAGNOSTIC_DATA,
        JSON.stringify(data)
      );
    } catch (error) {
      console.error('Error saving diagnostic data:', error);
      throw new Error('Failed to save diagnostic data');
    }
  }

  static async getDiagnosticData(): Promise<DiagnosticState | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.DIAGNOSTIC_DATA);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting diagnostic data:', error);
      return null;
    }
  }

  static async clearDiagnosticData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.DIAGNOSTIC_DATA);
    } catch (error) {
      console.error('Error clearing diagnostic data:', error);
    }
  }

  static async savePendingOrder(orderId: string, orderDetails: any): Promise<void> {
    try {
      const pendingOrders = await this.getPendingOrders();
      pendingOrders[orderId] = {
        ...orderDetails,
        timestamp: Date.now(),
      };
      await AsyncStorage.setItem(
        STORAGE_KEYS.PENDING_ORDERS,
        JSON.stringify(pendingOrders)
      );
    } catch (error) {
      console.error('Error saving pending order:', error);
    }
  }

  static async getPendingOrders(): Promise<Record<string, any>> {
    try {
      const orders = await AsyncStorage.getItem(STORAGE_KEYS.PENDING_ORDERS);
      return orders ? JSON.parse(orders) : {};
    } catch (error) {
      console.error('Error getting pending orders:', error);
      return {};
    }
  }

  static async addToDiagnosticHistory(diagnostic: DiagnosticState): Promise<void> {
    try {
      const history = await this.getDiagnosticHistory();
      history.unshift({
        ...diagnostic,
        timestamp: Date.now(),
      });
      // Keep only last 10 diagnostics
      const trimmedHistory = history.slice(0, 10);
      await AsyncStorage.setItem(
        STORAGE_KEYS.DIAGNOSTIC_HISTORY,
        JSON.stringify(trimmedHistory)
      );
    } catch (error) {
      console.error('Error saving to diagnostic history:', error);
    }
  }

  static async getDiagnosticHistory(): Promise<Array<DiagnosticState & { timestamp: number }>> {
    try {
      const history = await AsyncStorage.getItem(STORAGE_KEYS.DIAGNOSTIC_HISTORY);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Error getting diagnostic history:', error);
      return [];
    }
  }
} 