import { Module, forwardRef } from "@nestjs/common";
import { ReservationsController } from "./reservations.controller";
import { ReservationService } from "./reservations.service";
import { RestaurantsModule } from "../restaurants/restaurants.module";
import { WaitlistModule } from "../waitlist/waitlist.module";
import { FeatureFlagsModule } from "../feature-flags/feature-flags.module";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [
    RestaurantsModule,
    forwardRef(() => WaitlistModule),
    FeatureFlagsModule,
    UsersModule,
  ],
  controllers: [ReservationsController],
  providers: [ReservationService],
  exports: [ReservationService],
})
export class ReservationsModule { }