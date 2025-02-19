import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ServiceCallsScreen from '../serviceCalls';
import * as Notifications from 'expo-notifications';
import ServiceCalls from './serviceCalls';

// Mock the Notifications module
jest.mock('expo-notifications', () => ({
  scheduleNotificationAsync: jest.fn(),
  setNotificationHandler: jest.fn(),
}));

export default function ServiceCallsTest() {
  return null;
}

describe('ServiceCallsScreen', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByPlaceholderText, getByText } = render(<ServiceCallsScreen />);
    
    // Check if all input fields are present
    expect(getByPlaceholderText('Customer Name')).toBeTruthy();
    expect(getByPlaceholderText('Address')).toBeTruthy();
    expect(getByPlaceholderText('Phone Number')).toBeTruthy();
    expect(getByPlaceholderText('Description')).toBeTruthy();
    expect(getByText('Add Service Call')).toBeTruthy();
  });

  it('validates required fields', async () => {
    const { getByText } = render(<ServiceCallsScreen />);
    
    // Try to submit empty form
    fireEvent.press(getByText('Add Service Call'));
    
    await waitFor(() => {
      expect(getByText('Please fill in all required fields')).toBeTruthy();
    });
  });

  it('creates a new service call', async () => {
    const { getByPlaceholderText, getByText } = render(<ServiceCallsScreen />);
    
    // Fill in the form
    fireEvent.changeText(getByPlaceholderText('Customer Name'), 'John Doe');
    fireEvent.changeText(getByPlaceholderText('Address'), '123 Main St');
    fireEvent.changeText(getByPlaceholderText('Phone Number'), '555-1234');
    fireEvent.changeText(getByPlaceholderText('Description'), 'AC repair');
    
    // Submit the form
    fireEvent.press(getByText('Add Service Call'));
    
    await waitFor(() => {
      // Check if success message appears
      expect(getByText('Service call saved successfully!')).toBeTruthy();
      // Check if notification was scheduled
      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalled();
    });
  });

  it('displays service calls in the list', async () => {
    const { getByPlaceholderText, getByText, findByText } = render(<ServiceCallsScreen />);
    
    // Create a service call
    fireEvent.changeText(getByPlaceholderText('Customer Name'), 'John Doe');
    fireEvent.changeText(getByPlaceholderText('Address'), '123 Main St');
    fireEvent.changeText(getByPlaceholderText('Phone Number'), '555-1234');
    fireEvent.changeText(getByPlaceholderText('Description'), 'AC repair');
    fireEvent.press(getByText('Add Service Call'));
    
    // Check if the service call appears in the list
    await findByText('John Doe');
    expect(getByText('123 Main St')).toBeTruthy();
    expect(getByText('555-1234')).toBeTruthy();
    expect(getByText('AC repair')).toBeTruthy();
  });
});