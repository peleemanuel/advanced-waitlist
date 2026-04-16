import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Injectable()
export class ReservationService {
    private reservations = [
        {
            id: 1,
            restaurantId: 1,
            reservationDate: new Date('2026-04-20'),
            startTime: new Date('2026-04-20T19:00:00Z'),
            partySize: 2,
        },
        {
            id: 2,
            restaurantId: 1,
            reservationDate: new Date('2026-04-21'),
            startTime: new Date('2026-04-21T20:30:00Z'),
            partySize: 4,
        },
    ];

    create(createReservationDto: CreateReservationDto) {
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
        if(!found) throw new NotFoundException('Reservation not found');
        return found;
    }
}
