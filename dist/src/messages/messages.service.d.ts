import { PrismaService } from '../prisma/prisma.service';
export declare class MessagesService {
    private prisma;
    constructor(prisma: PrismaService);
    markAsRead(boatId: string, userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    markAsReadDaytrip(daytripId: string, userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    findAllConversations(): Promise<unknown[]>;
    findByDaytrip(daytripId: string, user?: any): Promise<({
        daytrip: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string | null;
            price: number;
            duration: string;
            horaSalida: string | null;
            horaRetorno: string | null;
            published: boolean;
            images: string | null;
            ownerId: string;
        };
        sender: {
            id: string;
            email: string;
            role: string;
            passwordHash: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        boatId: string | null;
        daytripId: string | null;
        content: string;
        readAt: Date | null;
        senderId: string;
    })[]>;
    create(data: any, user: any): Promise<{
        id: string;
        createdAt: Date;
        boatId: string | null;
        daytripId: string | null;
        content: string;
        readAt: Date | null;
        senderId: string;
    }>;
    findByBoat(boatId: string, user?: any): Promise<({
        boat: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            price: number;
            published: boolean;
            images: string | null;
            ownerId: string;
            type: string;
            pricePerDay: number;
            location: string;
            neighborhood: string | null;
            latitude: number | null;
            longitude: number | null;
            capacity: number;
            imageUrl: string | null;
            available: boolean;
        };
        sender: {
            id: string;
            email: string;
            role: string;
            passwordHash: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        boatId: string | null;
        daytripId: string | null;
        content: string;
        readAt: Date | null;
        senderId: string;
    })[]>;
    findConversations(userId: string): Promise<unknown[]>;
}
