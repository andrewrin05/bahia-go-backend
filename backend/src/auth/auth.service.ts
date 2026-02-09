import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async requestOtp(email: string) {
    // Mock: en producción, enviar email con código real
    console.log(`OTP code for ${email}: 123456`);
    return { message: 'OTP sent' };
  }

  async verifyOtp(email: string, code: string) {
    // Mock: aceptar cualquier código '123456'
    if (code !== '123456') {
      throw new Error('Invalid code');
    }

    let user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await this.prisma.user.create({ data: { email } });
    }

    const token = this.jwt.sign({ userId: user.id });
    return { userId: user.id, token };
  }
}