import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { RestaurantsService } from '../restaurants/restaurants.service';
import { Reservation } from '../shared/types/domain.types';

@Injectable()
export class ReservationService {
    constructor(
        private readonly restaurantsService: RestaurantsService
    ) { }

    private reservations: Reservation[] = [
        {
            id: 1,
            userId: 1,
            restaurantId: 1,
            tableId: 1,
            reservationDate: '2026-04-20',
            slotHour: 15,
            status: 'ACTIVE',
        },
        {
            id: 2,
            userId: 2,
            restaurantId: 1,
            tableId: 2,
            reservationDate: '2026-04-21',
            slotHour: 17,
            status: 'ACTIVE',
        },
    ];

    create(createReservationDto: CreateReservationDto) {
        const restaurant = this.restaurantsService.findCertainRestaurant(createReservationDto.restaurantId);

        const tableExists = restaurant.tables.some(
            (table) => table.id === createReservationDto.tableId,
        );

        if (!tableExists) {
            throw new NotFoundException('Table not found for restaurant');
        }

        const slotTaken = this.reservations.some((reservation) => {
            return (
                reservation.restaurantId === createReservationDto.restaurantId &&
                reservation.tableId === createReservationDto.tableId &&
                reservation.reservationDate === createReservationDto.reservationDate &&
                reservation.slotHour === createReservationDto.slotHour &&
                reservation.status === 'ACTIVE'
            );
        });

        if (slotTaken) {
            throw new BadRequestException('Requested slot is not available');
        }

        const newReservation: Reservation = {
            id: this.reservations.length + 1,
            userId: createReservationDto.userId,
            restaurantId: createReservationDto.restaurantId,
            tableId: createReservationDto.tableId,
            reservationDate: createReservationDto.reservationDate,
            slotHour: createReservationDto.slotHour,
            status: 'ACTIVE',
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
