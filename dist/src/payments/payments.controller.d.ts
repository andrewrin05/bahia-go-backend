import { PaymentsService } from './payments.service';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    createWompiCheckout(req: any, body: any): Promise<{
        checkoutUrl: string;
        reference: string;
        amountInCents: number;
        currency: string;
        acceptanceToken: string;
    }>;
    wompiWebhook(payload: any): Promise<{
        received: boolean;
    }>;
}
