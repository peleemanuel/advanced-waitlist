import { Module } from '@nestjs/common';
import { ReservationsController } from './reservations.controller';
import { ReservationService } from './reservation.service';

@Module({
  controllers: [ReservationsController],
  providers: [ReservationService]
})
export class ReservationsModule {}
