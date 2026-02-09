import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Configurar el comportamiento de las notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

class NotificationService {
  constructor() {
    this.notificationListener = null;
    this.responseListener = null;
  }

  // Solicitar permisos para notificaciones
  async requestPermissions() {
    if (!Device.isDevice) {
      console.log('Las notificaciones push solo funcionan en dispositivos físicos');
      return false;
    }

    // Verificar si las push notifications están soportadas en esta plataforma
    if (Platform.OS === 'android' && Constants.appOwnership === 'expo') {
      console.log('⚠️  Push notifications no están soportadas en Expo Go para Android.');
      console.log('📱 Usa un development build o dispositivo iOS para probar push notifications.');
      console.log('🔗 Más info: https://docs.expo.dev/develop/development-builds/introduction/');
      return false;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Permisos de notificación denegados');
      return false;
    }

    // Configurar canal de notificaciones para Android
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Bahía Go Notifications',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#007AFF',
      });
    }

    return true;
  }

  // Obtener token de notificación push
  async getExpoPushToken() {
    if (!Device.isDevice) {
      return null;
    }

    // Verificar si las push notifications están soportadas
    if (Platform.OS === 'android' && Constants.appOwnership === 'expo') {
      console.log('⚠️  Push notifications no disponibles en Expo Go para Android');
      return null;
    }

    // For local development, try without projectId first
    try {
      console.log('Intentando obtener token de notificación sin projectId...');
      const token = await Notifications.getExpoPushTokenAsync();
      console.log('Token obtenido exitosamente sin projectId');
      return token.data;
    } catch (error) {
      console.error('Error obteniendo token sin projectId:', error);

      // If that fails, try with projectId from Constants
      let projectId = null;
      try {
        if (Constants && typeof Constants === 'object') {
          if (Constants.expoConfig && typeof Constants.expoConfig === 'object' && Constants.expoConfig.extra) {
            const easConfig = Constants.expoConfig.extra.eas;
            if (easConfig && typeof easConfig === 'object' && typeof easConfig.projectId === 'string') {
              projectId = easConfig.projectId;
            }
          }
          if (!projectId && Constants.easConfig && typeof Constants.easConfig === 'object' && typeof Constants.easConfig.projectId === 'string') {
            projectId = Constants.easConfig.projectId;
          }
        }
      } catch (constantsError) {
        console.warn('Error accessing Constants:', constantsError);
      }

      const finalProjectId = (typeof projectId === 'string' && projectId.trim().length > 0) ? projectId.trim() : null;

      if (finalProjectId) {
        try {
          console.log('Intentando obtener token con projectId:', finalProjectId);
          const token = await Notifications.getExpoPushTokenAsync({
            projectId: finalProjectId,
          });
          return token.data;
        } catch (projectIdError) {
          console.error('Error obteniendo token con projectId:', projectIdError);
        }
      }

      return null;
    }
  }

  // Enviar notificación local
  async scheduleNotification(title, body, data = {}, delay = 0) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: true,
        },
        trigger: delay > 0 ? { seconds: delay } : null,
      });
    } catch (error) {
      console.error('Error programando notificación:', error);
    }
  }

  // Mostrar notificación inmediata
  async showNotification(title, body, data = {}) {
    try {
      await Notifications.presentNotificationAsync({
        title,
        body,
        data,
      });
    } catch (error) {
      console.error('Error mostrando notificación:', error);
    }
  }

  // Configurar listeners para notificaciones
  setupNotificationListeners(onNotificationReceived, onNotificationResponse) {
    // Listener para cuando llega una notificación
    this.notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notificación recibida:', notification);
      if (onNotificationReceived) {
        onNotificationReceived(notification);
      }
    });

    // Listener para cuando el usuario interactúa con la notificación
    this.responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Respuesta de notificación:', response);
      if (onNotificationResponse) {
        onNotificationResponse(response);
      }
    });
  }

  // Limpiar listeners
  cleanup() {
    if (this.notificationListener) {
      Notifications.removeNotificationSubscription(this.notificationListener);
    }
    if (this.responseListener) {
      Notifications.removeNotificationSubscription(this.responseListener);
    }
  }

  // Cancelar todas las notificaciones programadas
  async cancelAllScheduledNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  // Obtener todas las notificaciones programadas
  async getAllScheduledNotifications() {
    return await Notifications.getAllScheduledNotificationsAsync();
  }
}

export default new NotificationService();