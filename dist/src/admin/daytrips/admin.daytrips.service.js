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
exports.AdminDaytripsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let AdminDaytripsService = class AdminDaytripsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getReservations() {
        return this.prisma.bookingDaytrip.findMany({
            include: {
                daytrip: true,
                user: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async updateStatus(id, status) {
        return this.prisma.bookingDaytrip.update({
            where: { id },
            data: { status },
        });
    }
    async updatePayment(id, paymentStatus) {
        const data = { paymentStatus };
        if (paymentStatus === 'paid') {
            data.status = 'confirmed';
        }
        else if (paymentStatus === 'pending_payment') {
            data.status = 'pending';
        }
        return this.prisma.bookingDaytrip.update({
            where: { id },
            data,
        });
    }
};
exports.AdminDaytripsService = AdminDaytripsService;
exports.AdminDaytripsService = AdminDaytripsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminDaytripsService);
//# sourceMappingURL=admin.daytrips.service.js.map