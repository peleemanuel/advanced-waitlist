import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { RestaurantsService } from '../restaurants/restaurants.service';
import { Hour, HourAvailability, Reservation } from '../shared/types/domain.types';

@Injectable()
export class ReservationService {
    constructor(
        private readonly restaurantsService: RestaurantsService
    ) { }

    private readonly openingHours: Hour[] = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19];

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
            restaurantId: 2,
            tableId: 8,
            reservationDate: '2026-04-21',
            slotHour: 17,
            status: 'ACTIVE',
        },
    ];

    create(createReservationDto: CreateReservationDto) {
        const activeReservations = this.findActiveReservationsForTableOnDate(
            createReservationDto.restaurantId,
            createReservationDto.tableId,
            createReservationDto.reservationDate,
        );

        const slotTaken = activeReservations.some(
            (reservation) => reservation.slotHour === createReservationDto.slotHour,
        );

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

    buildAvailabilityForTableOnDate(
        restaurantId: number,
        tableId: number,
        reservationDate: string,
    ): HourAvailability {
        const availability = this.openingHours.reduce((acc, hour) => {
            acc[hour] = true;
            return acc;
        }, {} as HourAvailability);

        const activeReservations = this.findActiveReservationsForTableOnDate(
            restaurantId,
            tableId,
            reservationDate,
        );

        activeReservations.forEach((reservation) => {
            availability[reservation.slotHour] = false;
        });

        return availability;
    }

    isSlotAvailable(
        restaurantId: number,
        tableId: number,
        reservationDate: string,
        slotHour: Hour,
    ): boolean {
        const availability = this.buildAvailabilityForTableOnDate(
            restaurantId,
            tableId,
            reservationDate,
        );

        return availability[slotHour];
    }

    private findActiveReservationsForTableOnDate(
        restaurantId: number,
        tableId: number,
        reservationDate: string,
    ): Reservation[] {
        this.restaurantsService.findCertainTableInRestaurant(restaurantId, tableId);

        return this.reservations.filter(
            (reservation) =>
                reservation.restaurantId === restaurantId &&
                reservation.tableId === tableId &&
                reservation.reservationDate === reservationDate &&
                reservation.status === 'ACTIVE',
        );
    }
}
