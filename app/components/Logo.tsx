import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

const Logo = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo.png')} // Ensure you have the logo image in your assets folder
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  logo: {
    width: 150, // Adjust size as needed
    height: 150, // Adjust size as needed
  },
});

export default Logo; 