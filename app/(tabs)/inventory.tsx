import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Button, FlatList } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

interface InventoryItem {
  id: string;
  name: string;
}

export default function InventoryScreen() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [newItemName, setNewItemName] = useState('');

  const addItem = () => {
    if (newItemName.trim()) {
      const newItem: InventoryItem = {
        id: Date.now().toString(),
        name: newItemName.trim(),
      };
      setItems([...items, newItem]);
      setNewItemName('');
    }
  };

  const loadSampleData = () => {
    const sampleItems: InventoryItem[] = [
      { id: '1', name: 'Air Filter' },
      { id: '2', name: 'Thermostat' },
      { id: '3', name: 'Refrigerant' },
    ];
    setItems(sampleItems);
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Inventory</ThemedText>

      <View style={styles.addItemSection}>
        <TextInput
          style={styles.input}
          value={newItemName}
          onChangeText={setNewItemName}
          placeholder="Enter item name"
          placeholderTextColor="#999"
        />
        <Button title="Add Item" onPress={addItem} />
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyState}>
          <ThemedText>No items in inventory</ThemedText>
          <Button title="Load Sample Data" onPress={loadSampleData} />
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.itemRow}>
              <ThemedText>{item.name}</ThemedText>
              <Button title="Delete" onPress={() => deleteItem(item.id)} color="red" />
            </View>
          )}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  addItemSection: {
    marginVertical: 20,
    gap: 10,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
}); 