import { Controller, Get, Body, Param, Post, ParseIntPipe } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ReservationService } from './reservation.service';

@Controller('reservations')
export class ReservationsController {
    constructor(private readonly reservationService: ReservationService) {}

    @Get()
    findAll() {
        return this.reservationService.findAll();
    }

    @Get(':id')
    findCertainReservation(@Param('id', ParseIntPipe) id: number) {
        return this.reservationService.findCertainReservation(id);
    }

    @Post()
    create(@Body() createReservationDto: CreateReservationDto) {
        return this.reservationService.create(createReservationDto);
    }
}
