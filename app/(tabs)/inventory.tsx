import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Button, Alert } from 'react-native';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import { ThemedInput } from '../../components/ThemedInput';
import { fetchInventoryItems, saveInventoryItem } from '../../api/inventoryApi';

export default function InventoryScreen() {
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState('');

  useEffect(() => {
    const loadItems = async () => {
      const inventoryItems = await fetchInventoryItems();
      setItems(inventoryItems);
    };

    loadItems();
  }, []);

  const handleAddItem = async () => {
    if (!itemName || !itemQuantity) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    const newItem = { name: itemName, quantity: parseInt(itemQuantity) };
    await saveInventoryItem(newItem);
    setItems([...items, newItem]);
    setItemName('');
    setItemQuantity('');
    Alert.alert('Success', 'Item added to inventory!');
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Inventory Management</ThemedText>
      <ThemedInput
        value={itemName}
        onChangeText={setItemName}
        placeholder="Item Name"
        style={styles.input}
      />
      <ThemedInput
        value={itemQuantity}
        onChangeText={setItemQuantity}
        placeholder="Quantity"
        keyboardType="numeric"
        style={styles.input}
      />
      <Button title="Add Item" onPress={handleAddItem} />
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ThemedText style={styles.item}>{item.name} - {item.quantity}</ThemedText>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
  },
  item: {
    fontSize: 16,
    marginVertical: 5,
  },
}); 