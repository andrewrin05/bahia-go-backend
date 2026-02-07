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
exports.BoatsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BoatsService = class BoatsService {
    constructor(prisma) {
        this.prisma = prisma;
        this.parseImages = (boat) => {
            if (boat?.images && typeof boat.images === 'string') {
                try {
                    boat.images = JSON.parse(boat.images);
                }
                catch (e) {
                    boat.images = [];
                }
            }
            if (boat && boat.latitude !== undefined && boat.latitude !== null) {
                boat.latitude = Number(boat.latitude);
            }
            if (boat && boat.longitude !== undefined && boat.longitude !== null) {
                boat.longitude = Number(boat.longitude);
            }
            return boat;
        };
    }
    async findAll() {
        const boats = await this.prisma.boat.findMany({
            include: {
                bookings: true,
                favorites: true,
            },
        });
        return boats.map(this.parseImages);
    }
    async findAllPublished() {
        const boats = await this.prisma.boat.findMany({
            where: { published: true },
            include: {
                bookings: true,
                favorites: true,
            },
        });
        return boats.map(this.parseImages);
    }
    async searchPublished(raw) {
        const { search, location, minPrice, maxPrice, minCapacity, types, startDate, endDate, lat, lng, radiusKm, } = raw || {};
        const typeList = typeof types === 'string' && types.length > 0 ? types.split(',') : undefined;
        const minPriceNumber = minPrice ? Number(minPrice) : undefined;
        const maxPriceNumber = maxPrice ? Number(maxPrice) : undefined;
        const minCapacityNumber = minCapacity ? Number(minCapacity) : undefined;
        const centerLat = lat ? Number(lat) : undefined;
        const centerLng = lng ? Number(lng) : undefined;
        const radius = radiusKm ? Number(radiusKm) : undefined;
        const where = { published: true };
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { location: { contains: search, mode: 'insensitive' } },
                { type: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (location) {
            where.location = { contains: location, mode: 'insensitive' };
        }
        if (typeList?.length) {
            where.type = { in: typeList };
        }
        if (minPriceNumber !== undefined || maxPriceNumber !== undefined) {
            where.pricePerDay = {
                gte: minPriceNumber ?? undefined,
                lte: maxPriceNumber ?? undefined,
            };
        }
        if (minCapacityNumber !== undefined) {
            where.capacity = { gte: minCapacityNumber };
        }
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
                where.bookings = {
                    none: {
                        status: { not: 'cancelled' },
                        startDate: { lt: end },
                        endDate: { gt: start },
                    },
                };
            }
        }
        if (centerLat !== undefined && centerLng !== undefined && radius !== undefined && !isNaN(radius)) {
            const latDelta = radius / 111;
            const lngDelta = radius / (111 * Math.max(Math.cos((centerLat * Math.PI) / 180), 0.0001));
            const minLat = centerLat - latDelta;
            const maxLat = centerLat + latDelta;
            const minLng = centerLng - lngDelta;
            const maxLng = centerLng + lngDelta;
            where.latitude = { gte: minLat, lte: maxLat };
            where.longitude = { gte: minLng, lte: maxLng };
        }
        const boats = await this.prisma.boat.findMany({
            where,
            include: {
                bookings: true,
                favorites: true,
            },
            orderBy: {
                pricePerDay: 'asc',
            },
        });
        const parsed = boats.map(this.parseImages);
        if (centerLat !== undefined && centerLng !== undefined && radius !== undefined && !isNaN(radius)) {
            return parsed.filter((boat) => {
                if (boat.latitude === null || boat.longitude === null || boat.latitude === undefined || boat.longitude === undefined) {
                    return false;
                }
                const distance = this.haversineKm(centerLat, centerLng, boat.latitude, boat.longitude);
                return distance <= radius;
            });
        }
        return parsed;
    }
    async findOne(id) {
        const boat = await this.prisma.boat.findUnique({
            where: { id },
            include: {
                bookings: true,
                favorites: true,
            },
        });
        return boat ? this.parseImages(boat) : null;
    }
    async create(data, userId) {
        try {
            const user = await this.prisma.user.findUnique({ where: { id: userId } });
            if (!user) {
                await this.prisma.user.create({ data: { id: userId, email: `user${userId}@example.com` } });
            }
            const normalized = {
                ...data,
                pricePerDay: data.pricePerDay ?? data.price ?? 0,
                images: Array.isArray(data.images) ? JSON.stringify(data.images) : data.images ?? undefined,
                latitude: data.latitude !== undefined ? Number(data.latitude) : undefined,
                longitude: data.longitude !== undefined ? Number(data.longitude) : undefined,
                ownerId: userId,
            };
            console.log('Creating boat with data:', normalized);
            return await this.prisma.boat.create({
                data: normalized,
            });
        }
        catch (err) {
            console.error('Error in BoatsService.create:', err, { data, userId });
            throw err;
        }
    }
    async update(id, data) {
        const normalized = {
            ...data,
            pricePerDay: data.pricePerDay ?? data.price ?? undefined,
            images: Array.isArray(data.images) ? JSON.stringify(data.images) : data.images ?? undefined,
            latitude: data.latitude !== undefined ? Number(data.latitude) : undefined,
            longitude: data.longitude !== undefined ? Number(data.longitude) : undefined,
        };
        return this.prisma.boat.update({
            where: { id },
            data: normalized,
        });
    }
    async checkAvailability(id, startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
            throw new common_1.BadRequestException('Invalid date range');
        }
        const conflicts = await this.prisma.booking.findMany({
            where: {
                boatId: id,
                status: { not: 'cancelled' },
                startDate: { lt: end },
                endDate: { gt: start },
            },
            select: {
                id: true,
                startDate: true,
                endDate: true,
                status: true,
                paymentStatus: true,
            },
            orderBy: { startDate: 'asc' },
        });
        let nextAvailableStart = null;
        if (conflicts.length > 0) {
            const latestConflictEnd = conflicts.reduce((latest, booking) => {
                const endValue = new Date(booking.endDate).getTime();
                return endValue > latest ? endValue : latest;
            }, start.getTime());
            nextAvailableStart = new Date(latestConflictEnd);
        }
        const requestedNights = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
        const nextAvailableEnd = nextAvailableStart
            ? new Date(nextAvailableStart.getTime() + requestedNights * 24 * 60 * 60 * 1000)
            : null;
        return {
            available: conflicts.length === 0,
            conflicts,
            suggestion: nextAvailableStart
                ? {
                    startDate: nextAvailableStart.toISOString(),
                    endDate: nextAvailableEnd?.toISOString(),
                }
                : null,
        };
    }
    haversineKm(lat1, lon1, lat2, lon2) {
        const toRad = (v) => (v * Math.PI) / 180;
        const R = 6371;
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
    async remove(id) {
        return this.prisma.boat.delete({
            where: { id },
        });
    }
};
exports.BoatsService = BoatsService;
exports.BoatsService = BoatsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BoatsService);
//# sourceMappingURL=boats.service.js.map