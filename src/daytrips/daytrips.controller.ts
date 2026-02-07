import { Controller, Post, Body, UseGuards, Request, Get, Put, Delete, Param } from '@nestjs/common';
import { DaytripsService } from './daytrips.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('daytrips')
export class DaytripsController {
  constructor(private readonly daytripsService: DaytripsService) {}

  @Get()
  getAllDaytrips() {
    return this.daytripsService.getAllDaytrips();
  }

  @Post('reservations')
  @UseGuards(JwtAuthGuard)
  createReservation(@Body() body: any, @Request() req) {
    return this.daytripsService.createReservation(body, req.user.userId);
  }

  @Get('mine')
  @UseGuards(JwtAuthGuard)
  getMyDaytrips(@Request() req) {
    return this.daytripsService.getMyDaytrips(req.user.userId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createDaytrip(@Body() body: any, @Request() req) {
    return this.daytripsService.createDaytrip(body, req.user.userId);
  }

  @Get(':id')
  getDaytrip(@Param('id') id: string) {
    return this.daytripsService.getDaytrip(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  updateDaytrip(@Param('id') id: string, @Body() body: any, @Request() req) {
    return this.daytripsService.updateDaytrip(id, body, req.user.userId, req.user.role);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteDaytrip(@Param('id') id: string, @Request() req) {
    return this.daytripsService.deleteDaytrip(id, req.user.userId);
  }
}
