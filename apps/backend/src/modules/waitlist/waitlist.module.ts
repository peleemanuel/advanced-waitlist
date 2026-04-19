import { Module, forwardRef } from "@nestjs/common";
import { WaitlistController } from "./waitlist.controller";
import { WaitlistService } from "./waitlist.service";
import { RestaurantsModule } from "../restaurants/restaurants.module";
import { ReservationsModule } from "../reservations/reservations.module";

@Module({
    imports: [RestaurantsModule, forwardRef(() => ReservationsModule)],
    controllers: [WaitlistController],
    providers: [WaitlistService],
    exports: [WaitlistService],
})
export class WaitlistModule { }