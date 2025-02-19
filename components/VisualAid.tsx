import React from 'react';
import { Image, StyleSheet, View, ImageSourcePropType } from 'react-native';
import { ThemedText } from './ThemedText';

interface VisualAidProps {
  imageSource: ImageSourcePropType;
  caption?: string;
}

export default function VisualAid({ imageSource, caption }: VisualAidProps) {
  return (
    <View style={styles.container}>
      <Image 
        source={imageSource}
        style={styles.image}
        resizeMode="contain"
      />
      {caption && (
        <ThemedText style={styles.caption}>
          {caption}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 10,
  },
  image: {
    width: '100%',
    height: 200,
  },
  caption: {
    marginTop: 5,
    textAlign: 'center',
    fontSize: 14,
  },
}); 