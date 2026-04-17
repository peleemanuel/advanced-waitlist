import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { RestaurantsService } from '../restaurants/restaurants.service';

@Injectable()
export class ReservationService {
    constructor(
        private readonly restaurantsService: RestaurantsService
    ) { }

    private reservations = [
        {
            id: 1,
            restaurantId: 1,
            reservationDate: new Date('2026-04-20'),
            slotHour: 15
        },
        {
            id: 2,
            restaurantId: 1,
            reservationDate: new Date('2026-04-21'),
            slotHour: 17
        },
    ];

    create(createReservationDto: CreateReservationDto) {
        // check if restaurantId is valid
        this.restaurantsService.findCertainRestaurant(createReservationDto.restaurantId);

        // TODO: check if dates overlap


        const newReservation = {
            id: this.reservations.length + 1,
            ...createReservationDto,
        };

        this.reservations.push(newReservation);
        return newReservation;
    }

    findAll() {
        return this.reservations;
    }

    findCertainReservation(id: number) {
        const found = this.findAll().find((reservation) => reservation.id === id);
        if (!found) throw new NotFoundException('Reservation not found');
        return found;
    }
}
