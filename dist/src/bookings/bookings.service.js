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
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
let BookingsService = class BookingsService {
    constructor(prisma, notificationsService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
    }
    async generateUniqueBookingNumber() {
        let bookingNumber;
        let attempts = 0;
        const maxAttempts = 100;
        do {
            const randomNum = Math.floor(Math.random() * 90000) + 10000;
            bookingNumber = `#${randomNum}`;
            attempts++;
            const existingBooking = await this.prisma.booking.findUnique({
                where: { bookingNumber },
            });
            const existingDaytrip = await this.prisma.bookingDaytrip.findUnique({
                where: { bookingNumber },
            });
            if (!existingBooking && !existingDaytrip) {
                return bookingNumber;
            }
        } while (attempts < maxAttempts);
        return `#${Date.now() % 100000}`;
    }
    async updateExistingBookingNumbers() {
        const existingBookings = await this.prisma.booking.findMany({
            where: {
                bookingNumber: {
                    not: null,
                },
            },
        });
        for (const booking of existingBookings) {
            if (booking.bookingNumber && !booking.bookingNumber.startsWith('#')) {
                const newBookingNumber = await this.generateUniqueBookingNumber();
                await this.prisma.booking.update({
                    where: { id: booking.id },
                    data: { bookingNumber: newBookingNumber },
                });
            }
        }
        const existingDaytrips = await this.prisma.bookingDaytrip.findMany({
            where: {
                bookingNumber: {
                    not: null,
                },
            },
        });
        for (const daytrip of existingDaytrips) {
            if (daytrip.bookingNumber && !daytrip.bookingNumber.startsWith('#')) {
                const newBookingNumber = await this.generateUniqueBookingNumber();
                await this.prisma.bookingDaytrip.update({
                    where: { id: daytrip.id },
                    data: { bookingNumber: newBookingNumber },
                });
            }
        }
        return { message: 'Existing booking numbers updated successfully' };
    }
    async createDaytrip(data, userId) {
        if (!data.daytripId || !data.totalPrice) {
            throw new common_1.BadRequestException('daytripId and totalPrice are required');
        }
        const bookingNumber = await this.generateUniqueBookingNumber();
        const booking = await this.prisma.bookingDaytrip.create({
            data: {
                bookingNumber,
                userId,
                daytripId: data.daytripId,
                totalPrice: Number(data.totalPrice),
                currency: data.currency || 'COP',
                paymentProvider: data.paymentProvider || 'none',
                paymentReference: data.paymentReference || null,
                paymentStatus: data.paymentStatus || 'pending',
                paymentCheckoutUrl: data.paymentCheckoutUrl || null,
            },
            include: {
                daytrip: true,
            },
        });
        try {
            await this.notificationsService.notifyBookingConfirmed(userId, bookingNumber, booking.daytrip.title);
        }
        catch (error) {
            console.error('Error sending booking confirmation notification:', error);
        }
        return booking;
    }
    async findAllDaytrip(userId) {
        return this.prisma.bookingDaytrip.findMany({
            where: userId ? { userId } : {},
            include: {
                daytrip: true,
                user: true,
            },
        });
    }
    async findOneDaytrip(id) {
        return this.prisma.bookingDaytrip.findUnique({
            where: { id },
            include: {
                daytrip: true,
                user: true,
            },
        });
    }
    async updateDaytrip(id, data) {
        return this.prisma.bookingDaytrip.update({
            where: { id },
            data,
        });
    }
    async removeDaytrip(id) {
        return this.prisma.bookingDaytrip.delete({
            where: { id },
        });
    }
    async create(data, userId) {
        const start = new Date(data.startDate);
        const end = new Date(data.endDate);
        if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
            throw new common_1.BadRequestException('Invalid date range');
        }
        const conflicts = await this.prisma.booking.count({
            where: {
                boatId: data.boatId,
                status: { not: 'cancelled' },
                startDate: { lt: end },
                endDate: { gt: start },
            },
        });
        if (conflicts > 0) {
            throw new common_1.BadRequestException('Dates not available for this boat');
        }
        const bookingNumber = await this.generateUniqueBookingNumber();
        const booking = await this.prisma.booking.create({
            data: {
                ...data,
                bookingNumber,
                userId,
                currency: data?.currency || 'COP',
                paymentStatus: data?.paymentStatus || 'pending',
            },
            include: {
                boat: true,
            },
        });
        try {
            await this.notificationsService.notifyBookingConfirmed(userId, bookingNumber, booking.boat.name);
        }
        catch (error) {
            console.error('Error sending booking confirmation notification:', error);
        }
        return booking;
    }
    async findAll(userId) {
        return this.prisma.booking.findMany({
            where: userId ? { userId } : {},
            include: {
                boat: true,
                user: true,
            },
        });
    }
    async findOne(id) {
        return this.prisma.booking.findUnique({
            where: { id },
            include: {
                boat: true,
                user: true,
            },
        });
    }
    async update(id, data) {
        return this.prisma.booking.update({
            where: { id },
            data,
        });
    }
    async remove(id) {
        return this.prisma.booking.delete({
            where: { id },
        });
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map