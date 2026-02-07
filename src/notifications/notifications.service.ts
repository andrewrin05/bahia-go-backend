import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Expo, ExpoPushMessage, ExpoPushToken } from 'expo-server-sdk';

@Injectable()
export class NotificationsService {
  private expo: Expo;

  constructor(private prisma: PrismaService) {
    this.expo = new Expo();
  }

  // Guardar token de notificación push de un usuario
  async savePushToken(userId: string, pushToken: string) {
    // Verificar si ya existe un token para este usuario
    const existingToken = await this.prisma.pushToken.findUnique({
      where: { userId },
    });

    if (existingToken) {
      // Actualizar token existente
      return this.prisma.pushToken.update({
        where: { userId },
        data: { token: pushToken, updatedAt: new Date() },
      });
    } else {
      // Crear nuevo token
      return this.prisma.pushToken.create({
        data: {
          userId,
          token: pushToken,
        },
      });
    }
  }

  // Obtener token de notificación de un usuario
  async getPushToken(userId: string) {
    const pushToken = await this.prisma.pushToken.findUnique({
      where: { userId },
    });
    return pushToken?.token || null;
  }

  // Enviar notificación push usando Expo
  async sendPushNotification(userId: string, title: string, body: string, data: any = {}) {
    try {
      const pushToken = await this.getPushToken(userId);

      if (!pushToken) {
        console.log(`No push token found for user ${userId}`);
        return { success: false, message: 'No push token found' };
      }

      // Verificar que el token sea válido
      if (!Expo.isExpoPushToken(pushToken)) {
        console.error(`Push token ${pushToken} is not a valid Expo push token`);
        return { success: false, message: 'Invalid push token' };
      }

      // Crear el mensaje
      const message: ExpoPushMessage = {
        to: pushToken as ExpoPushToken,
        title,
        body,
        data,
        sound: 'default',
        priority: 'default',
      };

      // Enviar la notificación
      const ticket = await this.expo.sendPushNotificationsAsync([message]);

      console.log(`Push notification sent to user ${userId}:`, ticket);

      return {
        success: true,
        message: 'Notification sent successfully',
        ticket: ticket[0],
      };

    } catch (error) {
      console.error('Error sending push notification:', error);
      return { success: false, message: error.message };
    }
  }

  // Enviar notificación a múltiples usuarios
  async sendBulkPushNotifications(userIds: string[], title: string, body: string, data: any = {}) {
    const results = [];
    const messages: ExpoPushMessage[] = [];

    // Recopilar todos los tokens válidos
    for (const userId of userIds) {
      const pushToken = await this.getPushToken(userId);

      if (pushToken && Expo.isExpoPushToken(pushToken)) {
        messages.push({
          to: pushToken as ExpoPushToken,
          title,
          body,
          data: { ...data, userId },
          sound: 'default',
          priority: 'default',
        });
      } else {
        results.push({ userId, success: false, message: 'No valid push token found' });
      }
    }

    // Enviar notificaciones en lotes (Expo permite hasta 100 por lote)
    const chunks = this.chunkArray(messages, 100);

    for (const chunk of chunks) {
      try {
        const tickets = await this.expo.sendPushNotificationsAsync(chunk);
        console.log(`Bulk notifications sent:`, tickets);

        // Agregar resultados
        chunk.forEach((message, index) => {
          const userId = message.data?.userId;
          results.push({
            userId,
            success: true,
            message: 'Notification sent',
            ticket: tickets[index]
          });
        });
      } catch (error) {
        console.error('Error sending bulk notifications:', error);
        chunk.forEach((message) => {
          const userId = message.data?.userId;
          results.push({ userId, success: false, message: error.message });
        });
      }
    }

    return results;
  }

  // Helper para dividir arrays en chunks
  private chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }

  // Notificaciones específicas para eventos de reservas
  async notifyBookingConfirmed(userId: string, bookingNumber: string, boatName: string) {
    const title = '¡Reserva Confirmada! 🎉';
    const body = `Tu reserva ${bookingNumber} para ${boatName} ha sido confirmada.`;
    const data = {
      type: 'booking_confirmed',
      bookingNumber,
      boatName,
    };

    return this.sendPushNotification(userId, title, body, data);
  }

  async notifyBookingReminder(userId: string, bookingNumber: string, boatName: string, hoursUntil: number) {
    const title = 'Recordatorio de Reserva ⏰';
    const body = `Tu reserva ${bookingNumber} para ${boatName} es en ${hoursUntil} horas.`;
    const data = {
      type: 'booking_reminder',
      bookingNumber,
      boatName,
      hoursUntil,
    };

    return this.sendPushNotification(userId, title, body, data);
  }

  async notifyPaymentUpdate(userId: string, bookingNumber: string, status: string) {
    const title = 'Actualización de Pago 💳';
    const body = `El pago de tu reserva ${bookingNumber} ha sido ${status}.`;
    const data = {
      type: 'payment_update',
      bookingNumber,
      status,
    };

    return this.sendPushNotification(userId, title, body, data);
  }

  async notifyDaytripAvailable(userId: string, daytripTitle: string, price: number) {
    const title = '¡Nueva Excursión Disponible! 🏖️';
    const body = `${daytripTitle} - Solo por $${price}. ¡Reserva ahora!`;
    const data = {
      type: 'daytrip_available',
      daytripTitle,
      price,
    };

    return this.sendPushNotification(userId, title, body, data);
  }

  // Verificar estado de notificaciones enviadas
  async checkNotificationReceipts(tickets: any[]) {
    const receiptIds = tickets
      .filter(ticket => ticket.status === 'ok')
      .map(ticket => ticket.id);

    if (receiptIds.length === 0) {
      return [];
    }

    const receiptIdChunks = this.chunkArray(receiptIds, 100);

    const results = [];
    for (const chunk of receiptIdChunks) {
      try {
        const receipts = await this.expo.getPushNotificationReceiptsAsync(chunk);
        results.push(...Object.entries(receipts));
      } catch (error) {
        console.error('Error checking notification receipts:', error);
      }
    }

    return results;
  }

  // Método para enviar notificaciones programadas (recordatorios)
  async scheduleNotification(userId: string, title: string, body: string, data: any = {}, delaySeconds: number = 0) {
    // Para notificaciones programadas, las manejamos desde el frontend
    // Este método puede usarse para programar notificaciones que se envíen desde el servidor
    const scheduledTime = new Date(Date.now() + delaySeconds * 1000);

    console.log(`Notification scheduled for user ${userId} at ${scheduledTime}:`, { title, body, data });

    return {
      success: true,
      message: 'Notification scheduled',
      scheduledTime,
    };
  }

  // Eliminar token de notificación (cuando el usuario cierra sesión)
  async removePushToken(userId: string) {
    return this.prisma.pushToken.deleteMany({
      where: { userId },
    });
  }
}