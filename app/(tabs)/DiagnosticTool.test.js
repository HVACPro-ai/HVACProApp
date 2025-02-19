import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import DiagnosticTool from './DiagnosticTool';

test('renders DiagnosticTool and handles input', () => {
  const { getByPlaceholderText, getByText } = render(<DiagnosticTool />);
  
  fireEvent.changeText(getByPlaceholderText('Model Number'), 'Model123');
  fireEvent.changeText(getByPlaceholderText('Serial Number'), 'Serial456');
  fireEvent.changeText(getByPlaceholderText('Describe Symptoms'), 'Not cooling');

  fireEvent.press(getByText('Submit'));

  // Add assertions to check if diagnostics are fetched correctly
}); 