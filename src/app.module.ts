import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { BoatsModule } from './boats/boats.module';
import { BookingsModule } from './bookings/bookings.module';
import { FavoritesModule } from './favorites/favorites.module';
import { SavedSearchesModule } from './saved-searches/saved-searches.module';
import { PaymentsModule } from './payments/payments.module';
import { DaytripsModule } from './daytrips/daytrips.module';
import { AdminDaytripsModule } from './admin/daytrips/admin.daytrips.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    AuthModule,
    BoatsModule,
    BookingsModule,
    FavoritesModule,
    SavedSearchesModule,
    PaymentsModule,
    DaytripsModule,
    AdminDaytripsModule,
    NotificationsModule,
  ],
})
export class AppModule {}