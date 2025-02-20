export interface ServiceImage {
    uri: string;
    type?: string;
    name?: string;
  }
  
  export interface DiagnosticState {
    modelNumber: string;
    serialNumber: string;
    symptoms: string[];
    images: ServiceImage[];
    sensorData?: {
      temperature: number;
      pressure: number;
      humidity: number;
      airflow: number;
      powerConsumption: number;
    };
  }

export { ThemedView } from './ThemedView';
export { ThemedText } from './ThemedText';
export { ThemedInput } from './ThemedInput';
export { ThemedButton } from './ThemedButton';
export { Card } from './Card';
export { NavigationButtons } from './NavigationButtons';
export { OfflineBanner } from './OfflineBanner';
export { AnimatedStepTransition } from './AnimatedStepTransition';
export { DiagnosticProgress } from './diagnostics/DiagnosticProgress';