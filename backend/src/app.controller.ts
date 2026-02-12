import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return 'Bahía Go Backend is running!';
  }

  @Get('health')
  getHealth(): string {
    return 'OK';
  }
}