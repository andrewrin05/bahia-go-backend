import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DaytripsService {
  constructor(private prisma: PrismaService) {}

  async getAllDaytrips() {
    return this.prisma.daytrip.findMany({ where: { published: true } });
  }

  async createReservation(data: any, userId: string) {
    // Create a BookingDaytrip record
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

  async getMyDaytrips(userId: string) {
    return this.prisma.daytrip.findMany({ where: { ownerId: userId } });
  }

  async createDaytrip(data: any, userId: string) {
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

  async getDaytrip(id: string) {
    const trip = await this.prisma.daytrip.findUnique({ where: { id, published: true } });
    if (!trip) throw new NotFoundException('No encontrado');
    return trip;
  }

  async updateDaytrip(id: string, data: any, userId: string, role?: string) {
    const trip = await this.prisma.daytrip.findUnique({ where: { id } });
    if (!trip) throw new NotFoundException('Daytrip not found');
    const isAdmin = role && role.toLowerCase() === 'admin';
    if (trip.ownerId !== userId && !isAdmin) {
      throw new ForbiddenException('You do not have permission to edit this daytrip');
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

  async deleteDaytrip(id: string, userId: string) {
    const trip = await this.prisma.daytrip.findUnique({ where: { id } });
    if (!trip || trip.ownerId !== userId) throw new ForbiddenException('No autorizado');
    return this.prisma.daytrip.delete({ where: { id } });
  }
}
