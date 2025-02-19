import { Text, TextProps, StyleSheet } from 'react-native';
import { useColorScheme } from 'react-native';

interface ThemedTextProps extends TextProps {
  type?: 'default' | 'title' | 'subtitle' | 'link';
}

export function ThemedText({ type = 'default', style, ...props }: ThemedTextProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const textStyle = [
    styles.default,
    type === 'title' && styles.title,
    type === 'subtitle' && styles.subtitle,
    type === 'link' && styles.link,
    { color: isDark ? '#fff' : '#000' },
    style,
  ];

  return <Text style={textStyle} {...props} />;
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  link: {
    fontSize: 16,
    color: '#2f95dc',
    textDecorationLine: 'underline',
  },
}); 