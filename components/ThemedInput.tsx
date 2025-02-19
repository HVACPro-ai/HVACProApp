import { TextInput, TextInputProps, StyleSheet } from 'react-native';
import { useColorScheme } from 'react-native';

export function ThemedInput(props: TextInputProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <TextInput
      {...props}
      style={[
        styles.input,
        { 
          color: isDark ? '#fff' : '#000',
          backgroundColor: isDark ? '#333' : '#fff',
          borderColor: isDark ? '#666' : '#ccc',
        },
        props.style,
      ]}
      placeholderTextColor={isDark ? '#999' : '#666'}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    marginBottom: 15,
    borderRadius: 5,
    fontSize: 16,
  },
}); 