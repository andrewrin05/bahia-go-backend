import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ListingsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.listing.findMany({
      include: { user: { select: { email: true } } },
    });
  }

  async findOne(id: string) {
    return this.prisma.listing.findUnique({
      where: { id },
      include: { user: { select: { email: true } } },
    });
  }

  async create(data: any, userId: string) {
    return this.prisma.listing.create({
      data: { ...data, userId },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.listing.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.listing.delete({
      where: { id },
    });
  }
}