import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class BookingsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  // Función helper para generar número de reserva aleatorio único de 5 dígitos con #
  private async generateUniqueBookingNumber(): Promise<string> {
    let bookingNumber: string;
    let attempts = 0;
    const maxAttempts = 100; // Evitar loop infinito

    do {
      // Generar número aleatorio de 5 dígitos (10000-99999)
      const randomNum = Math.floor(Math.random() * 90000) + 10000;
      bookingNumber = `#${randomNum}`;
      attempts++;

      // Verificar unicidad en ambas tablas
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

    // Si no se encuentra uno único después de muchos intentos, usar timestamp como fallback
    return `#${Date.now() % 100000}`;
  }

  // Función para actualizar reservas existentes con nuevos números aleatorios
  async updateExistingBookingNumbers() {
    // Actualizar bookings
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

    // Actualizar bookingDaytrips
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

    // --- BookingDaytrip methods ---
    async createDaytrip(data: any, userId: string) {
      if (!data.daytripId || !data.totalPrice) {
        throw new BadRequestException('daytripId and totalPrice are required');
      }
      // Asignar número de reserva aleatorio único de 5 dígitos
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

      // Enviar notificación de confirmación
      try {
        await this.notificationsService.notifyBookingConfirmed(
          userId,
          bookingNumber,
          booking.daytrip.title
        );
      } catch (error) {
        console.error('Error sending booking confirmation notification:', error);
      }

      return booking;
    }

    async findAllDaytrip(userId?: string) {
      return this.prisma.bookingDaytrip.findMany({
        where: userId ? { userId } : {},
        include: {
          daytrip: true,
          user: true,
        },
      });
    }

    async findOneDaytrip(id: string) {
      return this.prisma.bookingDaytrip.findUnique({
        where: { id },
        include: {
          daytrip: true,
          user: true,
        },
      });
    }

    async updateDaytrip(id: string, data: any) {
      return this.prisma.bookingDaytrip.update({
        where: { id },
        data,
      });
    }

    async removeDaytrip(id: string) {
      return this.prisma.bookingDaytrip.delete({
        where: { id },
      });
    }

  async create(data: any, userId: string) {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
      throw new BadRequestException('Invalid date range');
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
      throw new BadRequestException('Dates not available for this boat');
    }

    // Asignar número de reserva aleatorio único de 5 dígitos
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

    // Enviar notificación de confirmación
    try {
      await this.notificationsService.notifyBookingConfirmed(
        userId,
        bookingNumber,
        booking.boat.name
      );
    } catch (error) {
      console.error('Error sending booking confirmation notification:', error);
    }

    return booking;
  }

  async findAll(userId?: string) {
    return this.prisma.booking.findMany({
      where: userId ? { userId } : {},
      include: {
        boat: true,
        user: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.booking.findUnique({
      where: { id },
      include: {
        boat: true,
        user: true,
      },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.booking.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.booking.delete({
      where: { id },
    });
  }
}