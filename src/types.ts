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
} 