import { Global, Injectable } from '@nestjs/common';
import { PrismaClient } from '../../prisma/generated';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super({
      log: ['query'],
    });
  }
}