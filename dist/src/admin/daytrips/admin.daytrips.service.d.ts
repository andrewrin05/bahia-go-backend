import { PrismaService } from '../../prisma/prisma.service';
export declare class AdminDaytripsService {
    private prisma;
    constructor(prisma: PrismaService);
    getReservations(): Promise<({
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            role: string;
            passwordHash: string | null;
        };
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
            ownerId: string;
            images: string | null;
        };
    } & {
        id: string;
        bookingNumber: string | null;
        userId: string;
        daytripId: string;
        status: string;
        totalPrice: number;
        currency: string;
        paymentProvider: string | null;
        paymentReference: string | null;
        paymentStatus: string;
        paymentCheckoutUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    updateStatus(id: string, status: string): Promise<{
        id: string;
        bookingNumber: string | null;
        userId: string;
        daytripId: string;
        status: string;
        totalPrice: number;
        currency: string;
        paymentProvider: string | null;
        paymentReference: string | null;
        paymentStatus: string;
        paymentCheckoutUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updatePayment(id: string, paymentStatus: string): Promise<{
        id: string;
        bookingNumber: string | null;
        userId: string;
        daytripId: string;
        status: string;
        totalPrice: number;
        currency: string;
        paymentProvider: string | null;
        paymentReference: string | null;
        paymentStatus: string;
        paymentCheckoutUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
