// Types for inventory items
export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  partNumber: string;
  location?: string;
  minQuantity?: number;
  notes?: string;
}

// Function to fetch inventory items
export const fetchInventoryItems = async (): Promise<InventoryItem[]> => {
  try {
    // Here you would typically make an API call to your backend
    // For now, return mock data
    return [
      {
        id: '1',
        name: 'Air Filter',
        quantity: 10,
        partNumber: 'AF-101',
        location: 'Shelf A1',
        minQuantity: 5,
      },
      {
        id: '2',
        name: 'Thermostat',
        quantity: 5,
        partNumber: 'TH-202',
        location: 'Shelf B2',
        minQuantity: 3,
      }
    ];
  } catch (error) {
    console.error('Error fetching inventory:', error);
    throw error;
  }
};

// Function to save a new inventory item
export const saveInventoryItem = async (item: Omit<InventoryItem, 'id'>): Promise<InventoryItem> => {
  try {
    // Here you would typically make an API call to your backend
    // For now, return mock data with a random ID
    return {
      id: Math.random().toString(),
      ...item
    };
  } catch (error) {
    console.error('Error saving inventory item:', error);
    throw error;
  }
};

// Function to update an existing inventory item
export const updateInventoryItem = async (item: InventoryItem): Promise<InventoryItem> => {
  try {
    // Here you would typically make an API call to your backend
    return item;
  } catch (error) {
    console.error('Error updating inventory item:', error);
    throw error;
  }
};

// Function to delete an inventory item
export const deleteInventoryItem = async (id: string): Promise<void> => {
  try {
    // Here you would typically make an API call to your backend
    console.log(`Deleted item with id: ${id}`);
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    throw error;
  }
}; 