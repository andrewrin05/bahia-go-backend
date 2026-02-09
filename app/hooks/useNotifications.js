import { useEffect, useState } from 'react';
import NotificationService from '../services/notifications';

export const useNotifications = () => {
  const [expoPushToken, setExpoPushToken] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    // Solicitar permisos y obtener token
    const setupNotifications = async () => {
      const hasPermission = await NotificationService.requestPermissions();
      if (hasPermission) {
        const token = await NotificationService.getExpoPushToken();
        setExpoPushToken(token);
      }
    };

    setupNotifications();

    // Configurar listeners
    const onNotificationReceived = (notification) => {
      setNotification(notification);
    };

    const onNotificationResponse = (response) => {
      // Manejar respuesta de notificación (navegación, etc.)
      console.log('Usuario interactuó con notificación:', response);
    };

    NotificationService.setupNotificationListeners(onNotificationReceived, onNotificationResponse);

    // Cleanup
    return () => {
      NotificationService.cleanup();
    };
  }, []);

  // Funciones helper
  const showNotification = (title, body, data = {}) => {
    NotificationService.showNotification(title, body, data);
  };

  const scheduleNotification = (title, body, data = {}, delay = 0) => {
    NotificationService.scheduleNotification(title, body, data, delay);
  };

  const cancelAllNotifications = () => {
    NotificationService.cancelAllScheduledNotifications();
  };

  return {
    expoPushToken,
    notification,
    showNotification,
    scheduleNotification,
    cancelAllNotifications,
  };
};