import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const checkBiometricsAvailable = async (): Promise<boolean> => {
  const compatible = await LocalAuthentication.hasHardwareAsync();
  if (!compatible) return false;

  const enrolled = await LocalAuthentication.isEnrolledAsync();
  return enrolled;
};

export const authenticateWithBiometrics = async (): Promise<boolean> => {
  try {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate to continue',
      fallbackLabel: 'Use password instead',
      cancelLabel: 'Cancel',
      disableDeviceFallback: false,
    });

    return result.success;
  } catch (error) {
    console.error('Biometric authentication error:', error);
    return false;
  }
};

export const enableBiometrics = async (userId: string): Promise<void> => {
  await AsyncStorage.setItem('biometrics_enabled', userId);
};

export const disableBiometrics = async (): Promise<void> => {
  await AsyncStorage.removeItem('biometrics_enabled');
};

export const isBiometricsEnabled = async (): Promise<boolean> => {
  const enabled = await AsyncStorage.getItem('biometrics_enabled');
  return !!enabled;
}; 