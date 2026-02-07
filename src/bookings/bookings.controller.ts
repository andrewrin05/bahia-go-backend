import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Request } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

    // --- BookingDaytrip endpoints ---
    @Post('daytrip')
    @UseGuards(JwtAuthGuard)
    async createDaytrip(@Request() req, @Body() createBookingDaytripDto: any) {
      try {
        return await this.bookingsService.createDaytrip(createBookingDaytripDto, req.user.userId);
      } catch (error) {
        throw error;
      }
    }

    @Get('daytrip')
    @UseGuards(JwtAuthGuard)
    findAllDaytrip(@Request() req) {
      return this.bookingsService.findAllDaytrip(req.user.userId);
    }

    @Get('daytrip/:id')
    @UseGuards(JwtAuthGuard)
    findOneDaytrip(@Param('id') id: string) {
      return this.bookingsService.findOneDaytrip(id);
    }

    @Put('daytrip/:id')
    @UseGuards(JwtAuthGuard)
    updateDaytrip(@Param('id') id: string, @Body() updateBookingDaytripDto: any) {
      return this.bookingsService.updateDaytrip(id, updateBookingDaytripDto);
    }

    @Delete('daytrip/:id')
    @UseGuards(JwtAuthGuard)
    removeDaytrip(@Param('id') id: string) {
      return this.bookingsService.removeDaytrip(id);
    }

  @Post('update-existing-numbers')
  @UseGuards(JwtAuthGuard)
  async updateExistingBookingNumbers() {
    return this.bookingsService.updateExistingBookingNumbers();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Request() req, @Body() createBookingDto: any) {
    console.log('Received create booking request', createBookingDto);
    try {
      return await this.bookingsService.create(createBookingDto, req.user.userId);
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Request() req) {
    return this.bookingsService.findAll(req.user.userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateBookingDto: any) {
    return this.bookingsService.update(id, updateBookingDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.bookingsService.remove(id);
  }
}