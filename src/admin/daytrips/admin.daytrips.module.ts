import { Module } from '@nestjs/common';
import { AdminDaytripsController } from './admin.daytrips.controller';
import { AdminDaytripsService } from './admin.daytrips.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AdminDaytripsController],
  providers: [AdminDaytripsService],
})
export class AdminDaytripsModule {}
