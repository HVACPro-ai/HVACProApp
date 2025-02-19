import { Button, Pressable, StyleSheet } from 'react-native';
import { useColorScheme } from 'react-native';
import { ThemedText } from './ThemedText';

type ThemedButtonProps = {
  title: string;
  onPress: () => void;
};

export function ThemedButton({ title, onPress }: ThemedButtonProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Pressable
      style={[
        styles.button,
        { backgroundColor: isDark ? '#333' : '#fff',
          borderColor: isDark ? '#666' : '#ccc' }
      ]}
      onPress={onPress}
    >
      <ThemedText style={styles.text}>{title}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
  },
}); 