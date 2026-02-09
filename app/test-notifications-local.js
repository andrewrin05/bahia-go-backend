// Test de notificaciones locales (funcionan en Expo Go)
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

export const testLocalNotifications = async () => {
  console.log('🧪 Probando notificaciones locales...');

  // Verificar si estamos en un dispositivo
  if (!Device.isDevice) {
    console.log('❌ Solo funciona en dispositivos físicos');
    return;
  }

  // Verificar soporte de push notifications
  const isPushSupported = !(Platform.OS === 'android' && Constants.appOwnership === 'expo');

  console.log(`📱 Plataforma: ${Platform.OS}`);
  console.log(`🏠 App Ownership: ${Constants.appOwnership}`);
  console.log(`📲 Push Notifications Soportadas: ${isPushSupported ? '✅' : '❌'}`);

  try {
    // Solicitar permisos
    const { status } = await Notifications.requestPermissionsAsync();
    console.log(`🔐 Permisos: ${status}`);

    if (status === 'granted') {
      // Programar una notificación local de prueba
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '¡Prueba de Notificación Local! 🎉',
          body: 'Las notificaciones locales funcionan correctamente en Bahía Go',
          sound: true,
        },
        trigger: { seconds: 5 }, // En 5 segundos
      });

      console.log('✅ Notificación local programada para dentro de 5 segundos');
    } else {
      console.log('❌ Permisos denegados para notificaciones');
    }
  } catch (error) {
    console.error('❌ Error probando notificaciones:', error);
  }
};