import React, { useState } from 'react';
import { StyleSheet, View, Button, FlatList, Platform, Alert } from 'react-native';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import { ThemedInput } from '../../components/ThemedInput';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import { FontAwesome } from '@expo/vector-icons';
import { SchedulableTriggerInputTypes } from 'expo-notifications';

type ServiceCall = {
  id: string;
  customerName: string;
  date: string;
  time: string;
  address: string;
  phoneNumber: string;
  description: string;
  status: string;
};

export default function ServiceCallsScreen() {
  const [serviceCalls, setServiceCalls] = useState<ServiceCall[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [description, setDescription] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleSaveServiceCall = async () => {
    try {
      if (customerName.trim() && address.trim() && phoneNumber.trim()) {
        const serviceCall: ServiceCall = {
          id: Date.now().toString(),
          customerName,
          date: date.toLocaleDateString(),
          time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          address,
          phoneNumber,
          description,
          status: 'Pending'
        };

        // Create a notification trigger for the service call date
        const notificationDate = new Date(date);
        notificationDate.setHours(time.getHours());
        notificationDate.setMinutes(time.getMinutes());

        // Schedule notification
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Service Call Reminder',
            body: `Service call for ${customerName} at ${address}`,
            data: { serviceCallId: serviceCall.id },
          },
          trigger: {
            type: SchedulableTriggerInputTypes.DATE,
            date: notificationDate,
          },
        });

        setServiceCalls([...serviceCalls, serviceCall]);
        // Clear form
        setCustomerName('');
        setDate(new Date());
        setTime(new Date());
        setAddress('');
        setPhoneNumber('');
        setDescription('');
        Alert.alert('Success', 'Service call saved successfully!');
      } else {
        Alert.alert('Error', 'Please fill in all required fields');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save service call');
      console.error(error);
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setTime(selectedTime);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.inputContainer}>
        <ThemedInput
          value={customerName}
          onChangeText={setCustomerName}
          placeholder="Customer Name"
          style={styles.input}
        />
        
        <Button 
          title={date.toLocaleDateString()} 
          onPress={() => setShowDatePicker(true)} 
        />
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            onChange={onDateChange}
          />
        )}

        <Button 
          title={time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
          onPress={() => setShowTimePicker(true)} 
        />
        {showTimePicker && (
          <DateTimePicker
            value={time}
            mode="time"
            onChange={onTimeChange}
          />
        )}

        <ThemedInput
          value={address}
          onChangeText={setAddress}
          placeholder="Address"
          style={styles.input}
        />

        <ThemedInput
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="Phone Number"
          keyboardType="phone-pad"
          style={styles.input}
        />

        <ThemedInput
          value={description}
          onChangeText={setDescription}
          placeholder="Description"
          multiline
          numberOfLines={3}
          style={[styles.input, styles.multilineInput]}
        />

        <Button
          title="Add Service Call"
          onPress={handleSaveServiceCall}
        />
      </View>

      <FlatList
        data={serviceCalls}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.callItem}>
            <ThemedText style={styles.customerName}>{item.customerName}</ThemedText>
            <ThemedText style={styles.date}>{item.date} at {item.time}</ThemedText>
            <ThemedText style={styles.address}>{item.address}</ThemedText>
            <ThemedText style={styles.phone}>{item.phoneNumber}</ThemedText>
            <ThemedText style={styles.description}>{item.description}</ThemedText>
            <ThemedText style={styles.status}>{item.status}</ThemedText>
          </View>
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
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    marginBottom: 10,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  callItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
  },
  customerName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 14,
    marginTop: 5,
  },
  address: {
    fontSize: 14,
    marginTop: 5,
  },
  phone: {
    fontSize: 14,
    marginTop: 5,
  },
  description: {
    fontSize: 14,
    marginTop: 5,
  },
  status: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 5,
  },
}); 