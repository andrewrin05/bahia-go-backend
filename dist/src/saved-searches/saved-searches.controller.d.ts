import { SavedSearchesService } from './saved-searches.service';
export declare class SavedSearchesController {
    private readonly savedSearchesService;
    constructor(savedSearchesService: SavedSearchesService);
    create(req: any, createSavedSearchDto: any): Promise<{
        query: string;
        id: string;
        userId: string;
        createdAt: Date;
    }>;
    findAll(req: any): Promise<{
        query: string;
        id: string;
        userId: string;
        createdAt: Date;
    }[]>;
    remove(id: string, req: any): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
