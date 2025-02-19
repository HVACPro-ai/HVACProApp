import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ServiceCallsScreen from '../serviceCalls';
import * as Notifications from 'expo-notifications';
import '@testing-library/jest-native/extend-expect';

// Add type definitions for Jest
declare const jest: any;
declare const describe: any;
declare const beforeEach: any;
declare const it: any;
declare const expect: any;

// Mock expo-notifications
jest.mock('expo-notifications', () => ({
  scheduleNotificationAsync: jest.fn(),
  SchedulableTriggerInputTypes: {
    DATE: 'date'
  }
}));

// Mock DateTimePicker
jest.mock('@react-native-community/datetimepicker', () => {
  const mockComponent = jest.fn().mockReturnValue(null);
  return mockComponent;
});

describe('ServiceCallsScreen', () => {
  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks();
  });

  it('renders all input fields', () => {
    const { getByPlaceholderText, getByText } = render(<ServiceCallsScreen />);
    
    expect(getByPlaceholderText('Customer Name')).toBeTruthy();
    expect(getByPlaceholderText('Address')).toBeTruthy();
    expect(getByPlaceholderText('Phone Number')).toBeTruthy();
    expect(getByPlaceholderText('Description')).toBeTruthy();
    expect(getByText('Add Service Call')).toBeTruthy();
  });

  it('shows error when submitting empty form', async () => {
    const { getByText } = render(<ServiceCallsScreen />);
    
    fireEvent.press(getByText('Add Service Call'));
    
    await waitFor(() => {
      expect(getByText('Please fill in all required fields')).toBeTruthy();
    });
  });

  it('successfully creates a service call', async () => {
    const { getByPlaceholderText, getByText } = render(<ServiceCallsScreen />);
    
    // Fill out the form
    fireEvent.changeText(getByPlaceholderText('Customer Name'), 'John Smith');
    fireEvent.changeText(getByPlaceholderText('Address'), '123 Main St');
    fireEvent.changeText(getByPlaceholderText('Phone Number'), '555-0123');
    fireEvent.changeText(getByPlaceholderText('Description'), 'AC not working');
    
    // Submit form
    fireEvent.press(getByText('Add Service Call'));
    
    await waitFor(() => {
      // Check if notification was scheduled
      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalled();
      // Check if success message appears
      expect(getByText('Service call saved successfully!')).toBeTruthy();
    });
  });

  it('displays the service call in the list after creation', async () => {
    const { getByPlaceholderText, getByText, findByText } = render(<ServiceCallsScreen />);
    
    // Create a service call
    fireEvent.changeText(getByPlaceholderText('Customer Name'), 'John Smith');
    fireEvent.changeText(getByPlaceholderText('Address'), '123 Main St');
    fireEvent.changeText(getByPlaceholderText('Phone Number'), '555-0123');
    fireEvent.changeText(getByPlaceholderText('Description'), 'AC not working');
    fireEvent.press(getByText('Add Service Call'));
    
    // Verify the service call appears in the list
    await findByText('John Smith');
    expect(getByText('123 Main St')).toBeTruthy();
    expect(getByText('555-0123')).toBeTruthy();
    expect(getByText('AC not working')).toBeTruthy();
    expect(getByText('Pending')).toBeTruthy();
  });
}); 