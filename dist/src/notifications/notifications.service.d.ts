import { PrismaService } from '../prisma/prisma.service';
export declare class NotificationsService {
    private prisma;
    private expo;
    constructor(prisma: PrismaService);
    savePushToken(userId: string, pushToken: string): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        token: string;
    }>;
    getPushToken(userId: string): Promise<string>;
    sendPushNotification(userId: string, title: string, body: string, data?: any): Promise<{
        success: boolean;
        message: string;
        ticket: import("expo-server-sdk").ExpoPushTicket;
    } | {
        success: boolean;
        message: any;
        ticket?: undefined;
    }>;
    sendBulkPushNotifications(userIds: string[], title: string, body: string, data?: any): Promise<any[]>;
    private chunkArray;
    notifyBookingConfirmed(userId: string, bookingNumber: string, boatName: string): Promise<{
        success: boolean;
        message: string;
        ticket: import("expo-server-sdk").ExpoPushTicket;
    } | {
        success: boolean;
        message: any;
        ticket?: undefined;
    }>;
    notifyBookingReminder(userId: string, bookingNumber: string, boatName: string, hoursUntil: number): Promise<{
        success: boolean;
        message: string;
        ticket: import("expo-server-sdk").ExpoPushTicket;
    } | {
        success: boolean;
        message: any;
        ticket?: undefined;
    }>;
    notifyPaymentUpdate(userId: string, bookingNumber: string, status: string): Promise<{
        success: boolean;
        message: string;
        ticket: import("expo-server-sdk").ExpoPushTicket;
    } | {
        success: boolean;
        message: any;
        ticket?: undefined;
    }>;
    notifyDaytripAvailable(userId: string, daytripTitle: string, price: number): Promise<{
        success: boolean;
        message: string;
        ticket: import("expo-server-sdk").ExpoPushTicket;
    } | {
        success: boolean;
        message: any;
        ticket?: undefined;
    }>;
    checkNotificationReceipts(tickets: any[]): Promise<any[]>;
    scheduleNotification(userId: string, title: string, body: string, data?: any, delaySeconds?: number): Promise<{
        success: boolean;
        message: string;
        scheduledTime: Date;
    }>;
    removePushToken(userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
