import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ListingsModule } from './listings/listings.module';
import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // PrismaModule, // commented out for testing
    // AuthModule, // commented out for testing
    // ListingsModule, // commented out for testing
  ],
  controllers: [AppController],
})
export class AppModule {}