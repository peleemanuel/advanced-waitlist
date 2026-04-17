import { Module } from '@nestjs/common';
import { ReservationsController } from './reservations.controller';
import { ReservationService } from './reservations.service';
import { RestaurantsModule } from '../restaurants/restaurants.module';

@Module({
  imports: [RestaurantsModule],
  controllers: [ReservationsController],
  providers: [ReservationService]
})
export class ReservationsModule { }
