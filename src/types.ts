export interface ServiceImage {
  uri: string;
  type?: string;
  name?: string;
}

export interface ThemedButtonProps {
  title: string;
  onPress: () => void;
  style?: any;
  disabled?: boolean;
  loading?: boolean;
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