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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsController = void 0;
const common_1 = require("@nestjs/common");
const notifications_service_1 = require("./notifications.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let NotificationsController = class NotificationsController {
    constructor(notificationsService) {
        this.notificationsService = notificationsService;
    }
    async registerPushToken(req, body) {
        try {
            const result = await this.notificationsService.savePushToken(req.user.userId, body.pushToken);
            return { success: true, message: 'Push token registered successfully', data: result };
        }
        catch (error) {
            return { success: false, message: error.message };
        }
    }
    async ping() {
        return {
            success: true,
            message: 'Notifications service is working!',
            timestamp: new Date().toISOString()
        };
    }
    async sendTestNotification(req) {
        try {
            console.log('Test notification requested for user:', req.user.userId);
            const result = await this.notificationsService.sendPushNotification(req.user.userId, 'Notificación de Prueba 🧪', 'Esta es una notificación de prueba de Bahía Go', { type: 'test' });
            console.log('Test notification result:', result);
            return result;
        }
        catch (error) {
            console.error('Error in test notification:', error);
            return { success: false, message: error.message };
        }
    }
    async sendBookingConfirmation(body) {
        try {
            const result = await this.notificationsService.notifyBookingConfirmed(body.userId, body.bookingNumber, body.boatName);
            return result;
        }
        catch (error) {
            return { success: false, message: error.message };
        }
    }
    async sendBookingReminder(body) {
        try {
            const result = await this.notificationsService.notifyBookingReminder(body.userId, body.bookingNumber, body.boatName, body.hoursUntil);
            return result;
        }
        catch (error) {
            return { success: false, message: error.message };
        }
    }
    async sendPaymentUpdate(body) {
        try {
            const result = await this.notificationsService.notifyPaymentUpdate(body.userId, body.bookingNumber, body.status);
            return result;
        }
        catch (error) {
            return { success: false, message: error.message };
        }
    }
    async sendDaytripAvailable(body) {
        try {
            const result = await this.notificationsService.notifyDaytripAvailable(body.userId, body.daytripTitle, body.price);
            return result;
        }
        catch (error) {
            return { success: false, message: error.message };
        }
    }
    async checkNotificationReceipts(body) {
        try {
            const receipts = await this.notificationsService.checkNotificationReceipts(body.tickets);
            return { success: true, receipts };
        }
        catch (error) {
            return { success: false, message: error.message };
        }
    }
    async scheduleNotification(body) {
        try {
            const result = await this.notificationsService.scheduleNotification(body.userId, body.title, body.body, body.data || {}, body.delaySeconds || 0);
            return result;
        }
        catch (error) {
            return { success: false, message: error.message };
        }
    }
    async sendBulkNotifications(body) {
        try {
            const results = await this.notificationsService.sendBulkPushNotifications(body.userIds, body.title, body.body, body.data || {});
            return { success: true, results };
        }
        catch (error) {
            return { success: false, message: error.message };
        }
    }
};
exports.NotificationsController = NotificationsController;
__decorate([
    (0, common_1.Post)('register-token'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "registerPushToken", null);
__decorate([
    (0, common_1.Post)('ping'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "ping", null);
__decorate([
    (0, common_1.Post)('test'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "sendTestNotification", null);
__decorate([
    (0, common_1.Post)('send-booking-confirmation'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "sendBookingConfirmation", null);
__decorate([
    (0, common_1.Post)('send-booking-reminder'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "sendBookingReminder", null);
__decorate([
    (0, common_1.Post)('send-payment-update'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "sendPaymentUpdate", null);
__decorate([
    (0, common_1.Post)('send-daytrip-available'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "sendDaytripAvailable", null);
__decorate([
    (0, common_1.Post)('check-receipts'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "checkNotificationReceipts", null);
__decorate([
    (0, common_1.Post)('schedule'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "scheduleNotification", null);
__decorate([
    (0, common_1.Post)('bulk-send'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "sendBulkNotifications", null);
exports.NotificationsController = NotificationsController = __decorate([
    (0, common_1.Controller)('notifications'),
    __metadata("design:paramtypes", [notifications_service_1.NotificationsService])
], NotificationsController);
//# sourceMappingURL=notifications.controller.js.map