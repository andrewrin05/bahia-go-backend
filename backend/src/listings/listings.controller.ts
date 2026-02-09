import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { ListingsService } from './listings.service';

@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Post()
  create(@Body() createListingDto: any) {
    return this.listingsService.create(createListingDto, 'mock-user-id');
  }

  @Get()
  findAll() {
    return this.listingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.listingsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateListingDto: any) {
    return this.listingsService.update(id, updateListingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.listingsService.remove(id);
  }
}