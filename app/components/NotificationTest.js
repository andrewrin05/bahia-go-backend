import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
// import { useNotifications } from '../hooks/useNotifications';

export default function NotificationTest() {
  // const { showNotification, scheduleNotification } = useNotifications();
  const testLocalNotification = async () => {
    // try {
    //   await scheduleNotification(
    //     '🧪 Prueba de Notificación Local',
    //     'Esta es una notificación local de prueba para Bahía Go',
    //     {}, // data
    //     5 // 5 segundos
    //   );
    //   Alert.alert('✅ Éxito', 'Notificación programada para dentro de 5 segundos');
    // } catch (error) {
    //   Alert.alert('❌ Error', `No se pudo programar la notificación: ${error.message}`);
    // }
    Alert.alert('Info', 'Notificaciones deshabilitadas temporalmente');
  };

  const testImmediateNotification = async () => {
    // try {
    //   await showNotification(
    //     '🚀 Notificación Inmediata',
    //     'Esta notificación aparece inmediatamente'
    //   );
    //   Alert.alert('✅ Éxito', 'Notificación inmediata mostrada');
    // } catch (error) {
    //   Alert.alert('❌ Error', `Error: ${error.message}`);
    // }
    Alert.alert('Info', 'Notificaciones deshabilitadas temporalmente');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧪 Pruebas de Notificaciones</Text>
      <Text style={styles.subtitle}>
        Estas notificaciones locales funcionan en iOS y Android
      </Text>

      <TouchableOpacity style={styles.button} onPress={testLocalNotification}>
        <Text style={styles.buttonText}>📅 Notificación en 5 segundos</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={testImmediateNotification}>
        <Text style={styles.buttonText}>⚡ Notificación Inmediata</Text>
      </TouchableOpacity>

      <Text style={styles.info}>
        💡 Para push notifications remotas:{'\n'}
        • iOS: Funciona en Expo Go{'\n'}
        • Android: Necesitas development build
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#0B0E14',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00D4AA',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  info: {
    fontSize: 14,
    color: '#CCCCCC',
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 30,
  },
});