import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Bahía Go</Text>
      <Text style={styles.subtitle}>App funcionando sin expo-router</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0B0E14',
  },
  text: {
    fontSize: 24,
    color: '#00D4AA',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 10,
  },
});