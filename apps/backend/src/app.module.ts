import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RestaurantsModule } from './modules/restaurants/restaurants.module';
import { ReservationsModule } from './modules/reservations/reservations.module';
import { WaitlistModule } from './modules/waitlist/waitlist.module';
import { FeatureFlagsModule } from './modules/feature-flags/feature-flags.module';

@Module({
  imports: [AuthModule, UsersModule, RestaurantsModule, ReservationsModule, WaitlistModule, FeatureFlagsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
