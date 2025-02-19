import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedButton } from '@/components/ThemedButton';
import { InventoryItem, fetchInventoryItems, saveInventoryItem } from '@/api/inventoryApi';

export default function Inventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    setLoading(true);
    try {
      const items = await fetchInventoryItems();
      setInventory(items);
    } catch (error) {
      console.error('Error loading inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async () => {
    try {
      const newItem = await saveInventoryItem({
        name: 'New Part',
        quantity: 1,
        partNumber: 'NP-001',
        location: 'Shelf A',
        minQuantity: 1,
      });
      setInventory([...inventory, newItem]);
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const renderItem = ({ item }: { item: InventoryItem }) => (
    <View style={styles.itemContainer}>
      <ThemedText style={styles.itemName}>{item.name}</ThemedText>
      <ThemedText>Part #: {item.partNumber}</ThemedText>
      <ThemedText>Quantity: {item.quantity}</ThemedText>
      <ThemedText>Location: {item.location}</ThemedText>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Inventory</ThemedText>
        <ThemedButton title="Add Item" onPress={addItem} />
      </View>

      <FlatList
        data={inventory}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
  },
  itemContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
}); 