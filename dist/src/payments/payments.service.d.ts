import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
interface WompiCheckoutOptions {
    bookingId: string;
    redirectUrl?: string;
    customerEmail?: string;
}
export declare class PaymentsService {
    private config;
    private prisma;
    private cachedAcceptanceToken;
    private cachedAcceptanceExpires;
    constructor(config: ConfigService, prisma: PrismaService);
    private getBaseUrl;
    private getAcceptanceToken;
    createWompiCheckout(userId: string, opts: WompiCheckoutOptions): Promise<{
        checkoutUrl: string;
        reference: string;
        amountInCents: number;
        currency: string;
        acceptanceToken: string;
    }>;
    handleWompiWebhook(event: any): Promise<{
        received: boolean;
    }>;
}
export {};
