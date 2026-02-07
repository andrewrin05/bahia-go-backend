import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    registerPushToken(req: any, body: {
        pushToken: string;
    }): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            userId: string;
            createdAt: Date;
            updatedAt: Date;
            token: string;
        };
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    ping(): Promise<{
        success: boolean;
        message: string;
        timestamp: string;
    }>;
    sendTestNotification(req: any): Promise<{
        success: boolean;
        message: string;
        ticket: import("expo-server-sdk").ExpoPushTicket;
    } | {
        success: boolean;
        message: any;
        ticket?: undefined;
    }>;
    sendBookingConfirmation(body: {
        userId: string;
        bookingNumber: string;
        boatName: string;
    }): Promise<{
        success: boolean;
        message: string;
        ticket: import("expo-server-sdk").ExpoPushTicket;
    } | {
        success: boolean;
        message: any;
        ticket?: undefined;
    }>;
    sendBookingReminder(body: {
        userId: string;
        bookingNumber: string;
        boatName: string;
        hoursUntil: number;
    }): Promise<{
        success: boolean;
        message: string;
        ticket: import("expo-server-sdk").ExpoPushTicket;
    } | {
        success: boolean;
        message: any;
        ticket?: undefined;
    }>;
    sendPaymentUpdate(body: {
        userId: string;
        bookingNumber: string;
        status: string;
    }): Promise<{
        success: boolean;
        message: string;
        ticket: import("expo-server-sdk").ExpoPushTicket;
    } | {
        success: boolean;
        message: any;
        ticket?: undefined;
    }>;
    sendDaytripAvailable(body: {
        userId: string;
        daytripTitle: string;
        price: number;
    }): Promise<{
        success: boolean;
        message: string;
        ticket: import("expo-server-sdk").ExpoPushTicket;
    } | {
        success: boolean;
        message: any;
        ticket?: undefined;
    }>;
    checkNotificationReceipts(body: {
        tickets: any[];
    }): Promise<{
        success: boolean;
        receipts: any[];
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        receipts?: undefined;
    }>;
    scheduleNotification(body: {
        userId: string;
        title: string;
        body: string;
        data?: any;
        delaySeconds?: number;
    }): Promise<{
        success: boolean;
        message: string;
        scheduledTime: Date;
    } | {
        success: boolean;
        message: any;
    }>;
    sendBulkNotifications(body: {
        userIds: string[];
        title: string;
        body: string;
        data?: any;
    }): Promise<{
        success: boolean;
        results: any[];
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        results?: undefined;
    }>;
}
