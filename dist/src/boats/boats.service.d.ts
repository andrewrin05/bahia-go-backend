import { PrismaService } from '../prisma/prisma.service';
export declare class BoatsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<any[]>;
    findAllPublished(): Promise<any[]>;
    searchPublished(raw: any): Promise<any[]>;
    findOne(id: string): Promise<any>;
    create(data: any, userId: string): Promise<{
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
    }>;
    update(id: string, data: any): Promise<{
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
    }>;
    private parseImages;
    checkAvailability(id: string, startDate: string, endDate: string): Promise<{
        available: boolean;
        conflicts: {
            id: string;
            status: string;
            paymentStatus: string;
            startDate: Date;
            endDate: Date;
        }[];
        suggestion: {
            startDate: string;
            endDate: string;
        };
    }>;
    private haversineKm;
    remove(id: string): Promise<{
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
    }>;
}
