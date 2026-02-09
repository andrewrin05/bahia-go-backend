import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import api from '../services/api';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { expoPushToken, notification, showNotification, scheduleNotification } = useNotifications();
  const [user, setUser] = useState(null);

  // Simular obtención de usuario (esto debería venir de un AuthProvider real)
  useEffect(() => {
    // Aquí deberías integrar con tu sistema de autenticación real
    // Por ahora, asumimos que el usuario está autenticado si hay un token
    const checkAuth = async () => {
      try {
        const response = await api.get('/auth/profile');
        setUser(response.data);
      } catch (error) {
        setUser(null);
      }
    };

    checkAuth();
  }, []);

  // Registrar token push cuando tengamos usuario y token
  useEffect(() => {
    const registerPushToken = async () => {
      if (user && expoPushToken) {
        try {
          await api.post('/notifications/register-token', {
            pushToken: expoPushToken,
          });
          console.log('Push token registered successfully');
        } catch (error) {
          console.error('Error registering push token:', error);
        }
      }
    };

    registerPushToken();
  }, [user, expoPushToken]);

  // Manejar notificaciones entrantes
  useEffect(() => {
    if (notification) {
      console.log('Received notification:', notification);

      // Aquí puedes agregar lógica adicional para manejar diferentes tipos de notificaciones
      // Por ejemplo, navegar a una pantalla específica, actualizar datos, etc.
    }
  }, [notification]);

  const value = {
    expoPushToken,
    notification,
    showNotification,
    scheduleNotification,
    user,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
};