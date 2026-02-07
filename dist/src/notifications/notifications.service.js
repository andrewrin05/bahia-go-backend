"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const expo_server_sdk_1 = require("expo-server-sdk");
let NotificationsService = class NotificationsService {
    constructor(prisma) {
        this.prisma = prisma;
        this.expo = new expo_server_sdk_1.Expo();
    }
    async savePushToken(userId, pushToken) {
        const existingToken = await this.prisma.pushToken.findUnique({
            where: { userId },
        });
        if (existingToken) {
            return this.prisma.pushToken.update({
                where: { userId },
                data: { token: pushToken, updatedAt: new Date() },
            });
        }
        else {
            return this.prisma.pushToken.create({
                data: {
                    userId,
                    token: pushToken,
                },
            });
        }
    }
    async getPushToken(userId) {
        const pushToken = await this.prisma.pushToken.findUnique({
            where: { userId },
        });
        return pushToken?.token || null;
    }
    async sendPushNotification(userId, title, body, data = {}) {
        try {
            const pushToken = await this.getPushToken(userId);
            if (!pushToken) {
                console.log(`No push token found for user ${userId}`);
                return { success: false, message: 'No push token found' };
            }
            if (!expo_server_sdk_1.Expo.isExpoPushToken(pushToken)) {
                console.error(`Push token ${pushToken} is not a valid Expo push token`);
                return { success: false, message: 'Invalid push token' };
            }
            const message = {
                to: pushToken,
                title,
                body,
                data,
                sound: 'default',
                priority: 'default',
            };
            const ticket = await this.expo.sendPushNotificationsAsync([message]);
            console.log(`Push notification sent to user ${userId}:`, ticket);
            return {
                success: true,
                message: 'Notification sent successfully',
                ticket: ticket[0],
            };
        }
        catch (error) {
            console.error('Error sending push notification:', error);
            return { success: false, message: error.message };
        }
    }
    async sendBulkPushNotifications(userIds, title, body, data = {}) {
        const results = [];
        const messages = [];
        for (const userId of userIds) {
            const pushToken = await this.getPushToken(userId);
            if (pushToken && expo_server_sdk_1.Expo.isExpoPushToken(pushToken)) {
                messages.push({
                    to: pushToken,
                    title,
                    body,
                    data: { ...data, userId },
                    sound: 'default',
                    priority: 'default',
                });
            }
            else {
                results.push({ userId, success: false, message: 'No valid push token found' });
            }
        }
        const chunks = this.chunkArray(messages, 100);
        for (const chunk of chunks) {
            try {
                const tickets = await this.expo.sendPushNotificationsAsync(chunk);
                console.log(`Bulk notifications sent:`, tickets);
                chunk.forEach((message, index) => {
                    const userId = message.data?.userId;
                    results.push({
                        userId,
                        success: true,
                        message: 'Notification sent',
                        ticket: tickets[index]
                    });
                });
            }
            catch (error) {
                console.error('Error sending bulk notifications:', error);
                chunk.forEach((message) => {
                    const userId = message.data?.userId;
                    results.push({ userId, success: false, message: error.message });
                });
            }
        }
        return results;
    }
    chunkArray(array, chunkSize) {
        const chunks = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            chunks.push(array.slice(i, i + chunkSize));
        }
        return chunks;
    }
    async notifyBookingConfirmed(userId, bookingNumber, boatName) {
        const title = '¡Reserva Confirmada! 🎉';
        const body = `Tu reserva ${bookingNumber} para ${boatName} ha sido confirmada.`;
        const data = {
            type: 'booking_confirmed',
            bookingNumber,
            boatName,
        };
        return this.sendPushNotification(userId, title, body, data);
    }
    async notifyBookingReminder(userId, bookingNumber, boatName, hoursUntil) {
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
    async notifyPaymentUpdate(userId, bookingNumber, status) {
        const title = 'Actualización de Pago 💳';
        const body = `El pago de tu reserva ${bookingNumber} ha sido ${status}.`;
        const data = {
            type: 'payment_update',
            bookingNumber,
            status,
        };
        return this.sendPushNotification(userId, title, body, data);
    }
    async notifyDaytripAvailable(userId, daytripTitle, price) {
        const title = '¡Nueva Excursión Disponible! 🏖️';
        const body = `${daytripTitle} - Solo por $${price}. ¡Reserva ahora!`;
        const data = {
            type: 'daytrip_available',
            daytripTitle,
            price,
        };
        return this.sendPushNotification(userId, title, body, data);
    }
    async checkNotificationReceipts(tickets) {
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
            }
            catch (error) {
                console.error('Error checking notification receipts:', error);
            }
        }
        return results;
    }
    async scheduleNotification(userId, title, body, data = {}, delaySeconds = 0) {
        const scheduledTime = new Date(Date.now() + delaySeconds * 1000);
        console.log(`Notification scheduled for user ${userId} at ${scheduledTime}:`, { title, body, data });
        return {
            success: true,
            message: 'Notification scheduled',
            scheduledTime,
        };
    }
    async removePushToken(userId) {
        return this.prisma.pushToken.deleteMany({
            where: { userId },
        });
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map