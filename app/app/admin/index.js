import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';

export default function AdminPanel() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Panel de Administración</Text>
      <Button mode="contained" style={styles.button} onPress={() => router.push('/admin/daytrips/reservations')}>Ver reservas de pasadías</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#181c1f',
    padding: 24,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 32,
  },
  button: {
    marginVertical: 8,
    width: 240,
  },
});
