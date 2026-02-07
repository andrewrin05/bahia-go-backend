"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const node_fetch_1 = require("node-fetch");
const crypto_1 = require("crypto");
const prisma_service_1 = require("../prisma/prisma.service");
let PaymentsService = class PaymentsService {
    constructor(config, prisma) {
        this.config = config;
        this.prisma = prisma;
        this.cachedAcceptanceToken = null;
        this.cachedAcceptanceExpires = null;
    }
    getBaseUrl() {
        return this.config.get('WOMPI_BASE_URL') || 'https://production.wompi.co';
    }
    async getAcceptanceToken() {
        const now = Date.now();
        if (this.cachedAcceptanceToken && this.cachedAcceptanceExpires && now < this.cachedAcceptanceExpires) {
            return this.cachedAcceptanceToken;
        }
        const publicKey = this.config.get('WOMPI_PUBLIC_KEY');
        if (!publicKey) {
            throw new common_1.InternalServerErrorException('WOMPI_PUBLIC_KEY is not configured');
        }
        const res = await (0, node_fetch_1.default)(`${this.getBaseUrl()}/v1/merchants/${publicKey}`);
        if (!res.ok) {
            const text = await res.text();
            throw new common_1.InternalServerErrorException(`Failed to fetch acceptance token: ${text}`);
        }
        const data = await res.json();
        const token = data?.data?.presigned_acceptance?.acceptance_token;
        const expires = data?.data?.presigned_acceptance?.expires_at;
        if (!token) {
            throw new common_1.InternalServerErrorException('No acceptance token returned by Wompi');
        }
        this.cachedAcceptanceToken = token;
        this.cachedAcceptanceExpires = expires ? expires * 1000 : now + 1000 * 60 * 10;
        return token;
    }
    async createWompiCheckout(userId, opts) {
        const publicKey = this.config.get('WOMPI_PUBLIC_KEY');
        if (!publicKey) {
            throw new common_1.InternalServerErrorException('WOMPI_PUBLIC_KEY is not configured');
        }
        const booking = await this.prisma.booking.findUnique({
            where: { id: opts.bookingId },
            include: { user: true },
        });
        if (!booking || booking.userId !== userId) {
            throw new common_1.NotFoundException('Booking not found');
        }
        const acceptanceToken = await this.getAcceptanceToken();
        const amountInCents = Math.round((booking.totalPrice || 0) * 100);
        const currency = booking.currency || 'COP';
        const reference = `BOOK-${booking.id}-${Date.now()}`;
        const customerEmail = opts.customerEmail || booking.user?.email;
        const redirectUrl = opts.redirectUrl || this.config.get('WOMPI_REDIRECT_URL') || 'https://checkout.bahiago.app/return';
        const params = new URLSearchParams({
            'public-key': publicKey,
            'amount-in-cents': amountInCents.toString(),
            currency,
            reference,
            'redirect-url': redirectUrl,
            'acceptance-token': acceptanceToken,
        });
        if (customerEmail) {
            params.append('customer-data.email', customerEmail);
        }
        const checkoutUrl = `https://checkout.wompi.co/p/?${params.toString()}`;
        await this.prisma.booking.update({
            where: { id: booking.id },
            data: {
                paymentProvider: 'wompi',
                paymentReference: reference,
                paymentStatus: 'pending_payment',
                paymentCheckoutUrl: checkoutUrl,
            },
        });
        return {
            checkoutUrl,
            reference,
            amountInCents,
            currency,
            acceptanceToken,
        };
    }
    async handleWompiWebhook(event) {
        const transaction = event?.data?.transaction || event?.transaction;
        if (!transaction)
            return { received: true };
        const reference = transaction.reference;
        const status = transaction.status;
        if (!reference)
            return { received: true };
        const signature = event?.signature || event?.event_data?.signature;
        const properties = signature?.properties;
        const checksum = signature?.checksum;
        const webhookSecret = this.config.get('WOMPI_WEBHOOK_SECRET');
        if (webhookSecret && properties?.length && checksum) {
            const getByPath = (obj, path) => path.split('.').reduce((acc, key) => (acc ? acc[key] : undefined), obj);
            const baseString = properties
                .map((prop) => {
                const val = getByPath(event, prop);
                return val === undefined || val === null ? '' : String(val);
            })
                .join('');
            const computed = crypto_1.default.createHmac('sha256', webhookSecret).update(baseString).digest('hex');
            if (computed !== checksum) {
                throw new common_1.ForbiddenException('Invalid webhook signature');
            }
        }
        const statusMap = {
            APPROVED: 'paid',
            VOIDED: 'cancelled',
            DECLINED: 'failed',
            ERROR: 'failed',
            PENDING: 'pending_payment',
        };
        const paymentStatus = statusMap[status || ''] || 'pending_payment';
        await this.prisma.booking.updateMany({
            where: { paymentReference: reference },
            data: {
                paymentStatus,
                status: paymentStatus === 'paid' ? 'confirmed' : undefined,
            },
        });
        return { received: true };
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService, prisma_service_1.PrismaService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map