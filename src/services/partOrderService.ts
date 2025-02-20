import type { OrderDetails, EquipmentTypeInfo } from '../types';

export class PartOrderService {
  static async submitOrder(orderDetails: OrderDetails, equipment: EquipmentTypeInfo): Promise<void> {
    try {
      const response = await fetch('/api/orders/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...orderDetails,
          equipment,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit order');
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      throw error;
    }
  }

  static async checkOrderStatus(orderId: string): Promise<{
    status: 'pending' | 'processing' | 'shipped' | 'delivered';
    estimatedDelivery?: Date;
  }> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      status: 'processing',
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    };
  }
} 