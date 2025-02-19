import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

const VisualAid = ({ imageSource }) => {
  return (
    <View style={styles.container}>
      <Image source={imageSource} style={styles.image} resizeMode="contain" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  image: {
    width: '100%',
    height: 200, // Adjust height as needed
  },
});

export default VisualAid; 