import { EquipmentTypeInfo } from './equipment';

export interface DiagnosticState {
  equipmentType?: EquipmentTypeInfo;
  brand: string;
  modelNumber: string;
  serialNumber: string;
  symptoms: string[];
  answers: Record<string, string>;
  sensorData?: {
    temperature?: number;
    pressure?: number;
    humidity?: number;
    airflow?: number;
    powerConsumption?: number;
    noiseLevel?: number;
  };
  confirmedIssue?: string;
} 