import { PrismaService } from '../prisma/prisma.service';
export declare class FavoritesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: {
        boatId: string;
    }, userId: string): Promise<{
        id: string;
        userId: string;
        boatId: string;
    }>;
    findAll(userId: string): Promise<({
        boat: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            price: number;
            published: boolean;
            ownerId: string;
            images: string | null;
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
    } & {
        id: string;
        userId: string;
        boatId: string;
    })[]>;
    remove(boatId: string, userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
