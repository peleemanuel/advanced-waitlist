import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ReservationService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Controller('reservations')
export class ReservationsController {
    constructor(private readonly reservationService: ReservationService) { }

    @Post()
    create(@Body() createReservationDto: CreateReservationDto) {
        return this.reservationService.create(createReservationDto);
    }

    @Get()
    findAll() {
        return this.reservationService.findAll();
    }

    @Get('availability/:restaurantId/:tableId')
    getAvailability(
        @Param('restaurantId', ParseIntPipe) restaurantId: number,
        @Param('tableId', ParseIntPipe) tableId: number,
        @Query('date') reservationDate: string,
    ) {
        return this.reservationService.buildAvailabilityForTableOnDate(
            restaurantId,
            tableId,
            reservationDate,
        );
    }

    @Get(':id')
    findCertainReservation(@Param('id', ParseIntPipe) id: number) {
        return this.reservationService.findCertainReservation(id);
    }

    @Patch(':id/cancel')
    cancelReservation(@Param('id', ParseIntPipe) id: number) {
        return this.reservationService.cancelReservation(id);
    }
}