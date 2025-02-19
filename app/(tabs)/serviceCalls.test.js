import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ServiceCallsScreen from './serviceCalls';

test('should render ServiceCallsScreen and handle input', () => {
  const { getByPlaceholderText, getByText } = render(<ServiceCallsScreen />);
  
  fireEvent.changeText(getByPlaceholderText('Customer Name'), 'John Doe');
  fireEvent.changeText(getByPlaceholderText('Address'), '123 Main St');
  fireEvent.changeText(getByPlaceholderText('Phone Number'), '1234567890');
  fireEvent.changeText(getByPlaceholderText('Description'), 'Service needed');

  fireEvent.press(getByText('Add Service Call'));

  // Assert that the service call was added and notification was scheduled
  // You may need to mock the notification scheduling
}); 