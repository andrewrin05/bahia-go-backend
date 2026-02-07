import { FavoritesService } from './favorites.service';
export declare class FavoritesController {
    private readonly favoritesService;
    constructor(favoritesService: FavoritesService);
    create(req: any, body: {
        boatId: string;
    }): Promise<{
        id: string;
        userId: string;
        boatId: string;
    }>;
    findAll(req: any): Promise<({
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
    remove(boatId: string, req: any): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
