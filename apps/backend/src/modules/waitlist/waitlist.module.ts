import { Module, forwardRef } from "@nestjs/common";
import { WaitlistController } from "./waitlist.controller";
import { WaitlistService } from "./waitlist.service";
import { RestaurantsModule } from "../restaurants/restaurants.module";
import { ReservationsModule } from "../reservations/reservations.module";
import { UsersModule } from "../users/users.module";

@Module({
    imports: [RestaurantsModule, forwardRef(() => ReservationsModule), UsersModule],
    controllers: [WaitlistController],
    providers: [WaitlistService],
    exports: [WaitlistService],
})
export class WaitlistModule { }