import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // Guardar token de notificación push
  @Post('register-token')
  @UseGuards(JwtAuthGuard)
  async registerPushToken(@Request() req, @Body() body: { pushToken: string }) {
    try {
      const result = await this.notificationsService.savePushToken(req.user.userId, body.pushToken);
      return { success: true, message: 'Push token registered successfully', data: result };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // Endpoint simple para verificar que el servicio funciona
  @Post('ping')
  @UseGuards(JwtAuthGuard)
  async ping() {
    return {
      success: true,
      message: 'Notifications service is working!',
      timestamp: new Date().toISOString()
    };
  }

  // Enviar notificación de prueba (solo para desarrollo)
  @Post('test')
  @UseGuards(JwtAuthGuard)
  async sendTestNotification(@Request() req) {
    try {
      console.log('Test notification requested for user:', req.user.userId);

      const result = await this.notificationsService.sendPushNotification(
        req.user.userId,
        'Notificación de Prueba 🧪',
        'Esta es una notificación de prueba de Bahía Go',
        { type: 'test' }
      );

      console.log('Test notification result:', result);
      return result;
    } catch (error) {
      console.error('Error in test notification:', error);
      return { success: false, message: error.message };
    }
  }

  // Endpoint para enviar notificaciones específicas (solo admin)
  @Post('send-booking-confirmation')
  @UseGuards(JwtAuthGuard)
  async sendBookingConfirmation(@Body() body: { userId: string, bookingNumber: string, boatName: string }) {
    try {
      const result = await this.notificationsService.notifyBookingConfirmed(
        body.userId,
        body.bookingNumber,
        body.boatName
      );
      return result;
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Post('send-booking-reminder')
  @UseGuards(JwtAuthGuard)
  async sendBookingReminder(@Body() body: { userId: string, bookingNumber: string, boatName: string, hoursUntil: number }) {
    try {
      const result = await this.notificationsService.notifyBookingReminder(
        body.userId,
        body.bookingNumber,
        body.boatName,
        body.hoursUntil
      );
      return result;
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Post('send-payment-update')
  @UseGuards(JwtAuthGuard)
  async sendPaymentUpdate(@Body() body: { userId: string, bookingNumber: string, status: string }) {
    try {
      const result = await this.notificationsService.notifyPaymentUpdate(
        body.userId,
        body.bookingNumber,
        body.status
      );
      return result;
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Post('send-daytrip-available')
  @UseGuards(JwtAuthGuard)
  async sendDaytripAvailable(@Body() body: { userId: string, daytripTitle: string, price: number }) {
    try {
      const result = await this.notificationsService.notifyDaytripAvailable(
        body.userId,
        body.daytripTitle,
        body.price
      );
      return result;
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // Endpoint para verificar receipts de notificaciones
  @Post('check-receipts')
  @UseGuards(JwtAuthGuard)
  async checkNotificationReceipts(@Body() body: { tickets: any[] }) {
    try {
      const receipts = await this.notificationsService.checkNotificationReceipts(body.tickets);
      return { success: true, receipts };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // Endpoint para programar notificaciones
  @Post('schedule')
  @UseGuards(JwtAuthGuard)
  async scheduleNotification(@Body() body: { userId: string, title: string, body: string, data?: any, delaySeconds?: number }) {
    try {
      const result = await this.notificationsService.scheduleNotification(
        body.userId,
        body.title,
        body.body,
        body.data || {},
        body.delaySeconds || 0
      );
      return result;
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // Endpoint para enviar notificaciones masivas
  @Post('bulk-send')
  @UseGuards(JwtAuthGuard)
  async sendBulkNotifications(@Body() body: { userIds: string[], title: string, body: string, data?: any }) {
    try {
      const results = await this.notificationsService.sendBulkPushNotifications(
        body.userIds,
        body.title,
        body.body,
        body.data || {}
      );
      return { success: true, results };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}