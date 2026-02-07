import { Module } from '@nestjs/common';
import { DaytripsController } from './daytrips.controller';
import { DaytripsService } from './daytrips.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [DaytripsController],
  providers: [DaytripsService, PrismaService],
})
export class DaytripsModule {}
