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
exports.DaytripsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DaytripsService = class DaytripsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAllDaytrips() {
        return this.prisma.daytrip.findMany({ where: { published: true } });
    }
    async createReservation(data, userId) {
        const { daytripId, totalPrice, currency, paymentProvider, paymentReference, paymentStatus, paymentCheckoutUrl } = data;
        if (!daytripId || !totalPrice) {
            throw new Error('daytripId and totalPrice are required');
        }
        return this.prisma.bookingDaytrip.create({
            data: {
                userId,
                daytripId,
                totalPrice: Number(totalPrice),
                currency: currency || 'COP',
                paymentProvider: paymentProvider || 'none',
                paymentReference: paymentReference || null,
                paymentStatus: paymentStatus || 'pending',
                paymentCheckoutUrl: paymentCheckoutUrl || null,
            },
        });
    }
    async getMyDaytrips(userId) {
        return this.prisma.daytrip.findMany({ where: { ownerId: userId } });
    }
    async createDaytrip(data, userId) {
        console.log('DATA RECIBIDA EN BACKEND:', data);
        return this.prisma.daytrip.create({
            data: {
                title: data.title,
                description: data.description,
                price: Number(data.price),
                duration: data.duration,
                horaSalida: data.horaSalida ?? null,
                horaRetorno: data.horaRetorno ?? null,
                published: data.published ?? false,
                ownerId: userId,
                images: data.images,
            },
        });
    }
    async getDaytrip(id) {
        const trip = await this.prisma.daytrip.findUnique({ where: { id, published: true } });
        if (!trip)
            throw new common_1.NotFoundException('No encontrado');
        return trip;
    }
    async updateDaytrip(id, data, userId, role) {
        const trip = await this.prisma.daytrip.findUnique({ where: { id } });
        if (!trip)
            throw new common_1.NotFoundException('Daytrip not found');
        const isAdmin = role && role.toLowerCase() === 'admin';
        if (trip.ownerId !== userId && !isAdmin) {
            throw new common_1.ForbiddenException('You do not have permission to edit this daytrip');
        }
        return this.prisma.daytrip.update({
            where: { id },
            data: {
                title: data.title,
                description: data.description,
                price: Number(data.price),
                duration: data.duration,
                horaSalida: typeof data.horaSalida !== 'undefined' ? data.horaSalida : trip.horaSalida,
                horaRetorno: typeof data.horaRetorno !== 'undefined' ? data.horaRetorno : trip.horaRetorno,
                published: typeof data.published !== 'undefined' ? data.published : trip.published,
                images: data.images,
            },
        });
    }
    async deleteDaytrip(id, userId) {
        const trip = await this.prisma.daytrip.findUnique({ where: { id } });
        if (!trip || trip.ownerId !== userId)
            throw new common_1.ForbiddenException('No autorizado');
        return this.prisma.daytrip.delete({ where: { id } });
    }
};
exports.DaytripsService = DaytripsService;
exports.DaytripsService = DaytripsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DaytripsService);
//# sourceMappingURL=daytrips.service.js.map