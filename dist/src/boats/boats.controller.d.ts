import { BoatsService } from './boats.service';
export declare class BoatsController {
    private readonly boatsService;
    constructor(boatsService: BoatsService);
    create(req: any, createBoatDto: any): Promise<{
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
    findAll(): Promise<any[]>;
    findSearch(query: any): Promise<any[]>;
    availability(id: string, startDate?: string, endDate?: string): Promise<{
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
    findOne(id: string): Promise<any>;
    update(id: string, updateBoatDto: any): Promise<{
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
    remove(id: string, req: any): Promise<{
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
    findAllAdmin(): Promise<any[]>;
}
