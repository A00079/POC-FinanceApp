import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.appName}>FinanceApp</Text>
      <Text style={styles.tagline}>Your Investment Partner</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#00C853',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: '#666666',
  },
});

export default SplashScreen;