import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminDaytripsService {
  constructor(private prisma: PrismaService) {}

  async getReservations() {
    return this.prisma.bookingDaytrip.findMany({
      include: {
        daytrip: true,
        user: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.bookingDaytrip.update({
      where: { id },
      data: { status },
    });
  }

  async updatePayment(id: string, paymentStatus: string) {
    // Si el pago es 'paid', también confirmamos la reserva
    // Si el pago es 'pending_payment', la reserva se pone en 'pending'
    const data: any = { paymentStatus };
    if (paymentStatus === 'paid') {
      data.status = 'confirmed';
    } else if (paymentStatus === 'pending_payment') {
      data.status = 'pending';
    }
    return this.prisma.bookingDaytrip.update({
      where: { id },
      data,
    });
  }
}
