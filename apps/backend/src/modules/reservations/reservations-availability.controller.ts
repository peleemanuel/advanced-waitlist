import {
    BadRequestException,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Query,
} from '@nestjs/common';
import { ReservationService } from './reservations.service';

@Controller('restaurants/:restaurantId/tables/:tableId')
export class ReservationsAvailabilityController {
    constructor(private readonly reservationService: ReservationService) { }

    @Get('availability')
    getTableAvailability(
        @Param('restaurantId', ParseIntPipe) restaurantId: number,
        @Param('tableId', ParseIntPipe) tableId: number,
        @Query('date') date?: string,
    ) {
        if (!date) {
            throw new BadRequestException('Query parameter "date" is required');
        }

        return this.reservationService.buildAvailabilityForTableOnDate(
            restaurantId,
            tableId,
            date,
        );
    }
}
