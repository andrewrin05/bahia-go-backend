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
exports.MessagesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let MessagesService = class MessagesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async markAsRead(boatId, userId) {
        return this.prisma.message.updateMany({
            where: {
                boatId,
                senderId: { not: userId },
                readAt: null,
            },
            data: {
                readAt: new Date(),
            },
        });
    }
    async markAsReadDaytrip(daytripId, userId) {
        return this.prisma.message.updateMany({
            where: {
                daytripId,
                senderId: { not: userId },
                readAt: null,
            },
            data: {
                readAt: new Date(),
            },
        });
    }
    async findAllConversations() {
        const messages = await this.prisma.message.findMany({
            include: {
                boat: true,
                daytrip: true,
                sender: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        const conversations = {};
        messages.forEach(msg => {
            const key = msg.boatId || msg.daytripId;
            if (!conversations[key]) {
                conversations[key] = {
                    boat: msg.boat,
                    daytrip: msg.daytrip,
                    lastMessage: msg,
                    messages: [],
                };
            }
            conversations[key].messages.push(msg);
        });
        return Object.values(conversations);
    }
    async findByDaytrip(daytripId, user) {
        const bookingDaytrip = await this.prisma.bookingDaytrip.findFirst({
            where: {
                daytripId,
                userId: user?.userId,
            }
        });
        console.log('bookingDaytrip found:', !!bookingDaytrip);
        if (!bookingDaytrip && user?.role !== 'ADMIN') {
            console.log('No booking and not admin, returning []');
            return [];
        }
        const messages = await this.prisma.message.findMany({
            where: {
                daytripId,
            },
            include: { sender: true, daytrip: true },
            orderBy: { createdAt: 'asc' },
        });
        console.log('Messages found:', messages.length);
        return messages;
    }
    async create(data, user) {
        try {
            if ((!data.boatId && !data.daytripId) || !data.content) {
                throw new Error('Se requiere boatId o daytripId y el contenido');
            }
            if (data.boatId) {
                const boat = await this.prisma.boat.findUnique({ where: { id: data.boatId } });
                if (!boat) {
                    throw new Error('La embarcación no existe (boatId inválido)');
                }
                const booking = await this.prisma.booking.findFirst({
                    where: {
                        boatId: data.boatId,
                        userId: user.userId,
                        OR: [
                            { status: 'confirmed' },
                            { paymentStatus: 'paid' },
                            { paymentStatus: 'pending_payment' }
                        ]
                    }
                });
                if (!booking && user.role !== 'ADMIN') {
                    throw new Error('Solo puedes chatear si tienes una reserva activa para esta embarcación');
                }
                if (data.receiverId && data.receiverId !== boat.ownerId && data.receiverId !== user.userId) {
                    throw new Error('Solo puedes chatear con el operador de la embarcación');
                }
            }
            if (data.daytripId) {
                const daytrip = await this.prisma.daytrip.findUnique({ where: { id: data.daytripId } });
                if (!daytrip) {
                    throw new Error('El pasadía no existe (daytripId inválido)');
                }
                const bookingDaytrip = await this.prisma.bookingDaytrip.findFirst({
                    where: {
                        daytripId: data.daytripId,
                        userId: user.userId,
                        OR: [
                            { status: 'confirmed' },
                            { paymentStatus: 'paid' },
                            { paymentStatus: 'pending_payment' }
                        ]
                    }
                });
                if (!bookingDaytrip && user.role !== 'ADMIN') {
                    throw new Error('Solo puedes chatear si tienes una reserva activa para este pasadía');
                }
                if (data.receiverId && data.receiverId !== daytrip.ownerId && data.receiverId !== user.userId) {
                    throw new Error('Solo puedes chatear con el operador del pasadía');
                }
            }
            return await this.prisma.message.create({
                data: { ...data, senderId: user.userId },
            });
        }
        catch (err) {
            console.error('Error creating message:', err, { data, userId: user.userId });
            throw err;
        }
    }
    async findByBoat(boatId, user) {
        const booking = await this.prisma.booking.findFirst({
            where: {
                boatId,
                userId: user?.userId,
            }
        });
        if (!booking && user?.role !== 'ADMIN') {
            return [];
        }
        return this.prisma.message.findMany({
            where: {
                boatId,
            },
            include: { sender: true, boat: true },
            orderBy: { createdAt: 'asc' },
        });
    }
    async findConversations(userId) {
        const messages = await this.prisma.message.findMany({
            where: {
                senderId: userId,
            },
            include: {
                boat: true,
                sender: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        const conversations = {};
        messages.forEach(msg => {
            if (!conversations[msg.boatId]) {
                conversations[msg.boatId] = {
                    boat: msg.boat,
                    lastMessage: msg,
                    messages: [],
                };
            }
            conversations[msg.boatId].messages.push(msg);
        });
        return Object.values(conversations);
    }
};
exports.MessagesService = MessagesService;
exports.MessagesService = MessagesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MessagesService);
//# sourceMappingURL=messages.service.js.map