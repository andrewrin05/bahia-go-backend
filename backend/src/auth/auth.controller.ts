import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('request-otp')
  async requestOtp(@Body() { email }: { email: string }) {
    return this.authService.requestOtp(email);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() { email, code }: { email: string; code: string }) {
    return this.authService.verifyOtp(email, code);
  }
}