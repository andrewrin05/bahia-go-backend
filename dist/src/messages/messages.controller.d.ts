import { MessagesService } from './messages.service';
export declare class MessagesController {
    private readonly messagesService;
    constructor(messagesService: MessagesService);
    markAsReadDaytrip(daytripId: string, req: any): Promise<import(".prisma/client").Prisma.BatchPayload>;
    findByDaytrip(daytripId: string, req: any): Promise<({
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
    markAsRead(boatId: string, req: any): Promise<import(".prisma/client").Prisma.BatchPayload>;
    findAllConversations(req: any): Promise<unknown[]>;
    create(req: any, createMessageDto: any): Promise<{
        id: string;
        createdAt: Date;
        boatId: string | null;
        daytripId: string | null;
        content: string;
        readAt: Date | null;
        senderId: string;
    }>;
    findConversations(req: any): Promise<unknown[]>;
    findByBoat(boatId: string, req: any): Promise<({
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
    findByBoatAlias(boatId: string, req: any): Promise<({
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
}
