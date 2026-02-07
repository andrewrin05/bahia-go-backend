import { PrismaService } from '../prisma/prisma.service';
export declare class SavedSearchesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: any, userId: string): Promise<{
        query: string;
        id: string;
        userId: string;
        createdAt: Date;
    }>;
    findAll(userId: string): Promise<{
        query: string;
        id: string;
        userId: string;
        createdAt: Date;
    }[]>;
    remove(id: string, userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
