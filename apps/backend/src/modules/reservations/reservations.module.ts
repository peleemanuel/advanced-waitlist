import { Module } from '@nestjs/common';
import { ReservationsController } from './reservations.controller';
import { ReservationService } from './reservations.service';
import { RestaurantsModule } from '../restaurants/restaurants.module';
import { ReservationsAvailabilityController } from './reservations-availability.controller';

@Module({
  imports: [RestaurantsModule],
  controllers: [ReservationsController, ReservationsAvailabilityController],
  providers: [ReservationService]
})
export class ReservationsModule { }
