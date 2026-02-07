import { Controller, Get, Patch, Param, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { AdminDaytripsService } from './admin.daytrips.service';
import { AdminGuard } from '../../auth/admin.guard';

@Controller('admin/daytrips')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminDaytripsController {
  constructor(private readonly service: AdminDaytripsService) {}

  @Get('reservations')
  async getReservations(@Param() params, @Body() body, @Req() req) {
    console.log('ADMIN endpoint /admin/daytrips/reservations called by:', req?.user);
    const reservations = await this.service.getReservations();
    console.log('Total reservas devueltas:', reservations.length);
    return reservations;
  }

  @Patch('reservations/:id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.service.updateStatus(id, status);
  }

  @Patch('reservations/:id/payment')
  async updatePayment(@Param('id') id: string, @Body('paymentStatus') paymentStatus: string) {
    return this.service.updatePayment(id, paymentStatus);
  }
}
