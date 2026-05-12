import { ConflictException, Inject, Injectable, NotFoundException, BadRequestException, forwardRef } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { RestaurantsService } from '../restaurants/restaurants.service';
import { FeatureFlagsService } from '../feature-flags/feature-flags.service';
import { UsersService } from '../users/users.service';
import { WaitlistService } from '../waitlist/waitlist.service';
import { Hour, HourAvailability, Reservation } from '../shared/types/domain.types';

@Injectable()
export class ReservationService {
    constructor(
        private readonly restaurantsService: RestaurantsService,
        @Inject(forwardRef(() => WaitlistService))
        private readonly waitlistService: WaitlistService,
        private readonly featureFlagsService: FeatureFlagsService,
        private readonly usersService: UsersService,
    ) { }

    private readonly openingHours: Hour[] = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19];

    // In-memory store for demo purposes only.
    private reservations: Reservation[] = [];

    create(createReservationDto: CreateReservationDto) {
        this.usersService.findCertainUser(createReservationDto.userId);

        this.restaurantsService.findCertainTableInRestaurant(
            createReservationDto.restaurantId,
            createReservationDto.tableId,
        );

        const userAlreadyHasReservation = this.userHasActiveReservationForSlot(
            createReservationDto.userId,
            createReservationDto.restaurantId,
            createReservationDto.tableId,
            createReservationDto.reservationDate,
            createReservationDto.slotHour,
        );

        if (userAlreadyHasReservation) {
            throw new ConflictException('User already has an active reservation for this slot');
        }

        const isAvailable = this.isSlotAvailable(
            createReservationDto.restaurantId,
            createReservationDto.tableId,
            createReservationDto.reservationDate,
            createReservationDto.slotHour,
        );

        if (!isAvailable) {
            throw new ConflictException('Requested slot is not available');
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
        const found = this.reservations.find((reservation) => reservation.id === id);

        if (!found) {
            throw new NotFoundException('Reservation not found');
        }

        return found;
    }

    findActiveReservationsForTableOnDate(
        restaurantId: number,
        tableId: number,
        reservationDate: string,
    ) {
        return this.reservations.filter((reservation) => {
            return (
                reservation.restaurantId === restaurantId &&
                reservation.tableId === tableId &&
                reservation.reservationDate === reservationDate &&
                reservation.status === 'ACTIVE'
            );
        });
    }

    buildAvailabilityForTableOnDate(
        restaurantId: number,
        tableId: number,
        reservationDate: string,
    ): HourAvailability {
        this.restaurantsService.findCertainTableInRestaurant(restaurantId, tableId);

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

    async cancelReservation(id: number) {
        const reservation = this.findCertainReservation(id);

        if (reservation.status === 'CANCELLED') {
            throw new BadRequestException('Reservation is already cancelled');
        }

        reservation.status = 'CANCELLED';

        const waitingEntry = this.waitlistService.findFirstWaitingEntryForSlot(
            reservation.restaurantId,
            reservation.tableId,
            reservation.reservationDate,
            reservation.slotHour,
        );

        if (!waitingEntry) {
            return {
                cancelledReservation: reservation,
                promotedReservation: null,
                promotedWaitlistEntry: null,
            };
        }

        const user = this.usersService.findCertainUser(waitingEntry.userId);

        const canAutoPromote =
            await this.featureFlagsService.canAutoPromoteFromWaitlist(user);

        if (!canAutoPromote) {
            return {
                cancelledReservation: reservation,
                promotedReservation: null,
                promotedWaitlistEntry: null,
            };
        }

        const promotedReservation = this.create({
            userId: waitingEntry.userId,
            restaurantId: waitingEntry.restaurantId,
            tableId: waitingEntry.tableId,
            reservationDate: waitingEntry.reservationDate,
            slotHour: waitingEntry.slotHour,
        });

        const promotedWaitlistEntry = this.waitlistService.markPromoted(
            waitingEntry.id,
        );

        return {
            cancelledReservation: reservation,
            promotedReservation,
            promotedWaitlistEntry,
        };
    }

    userHasActiveReservationForSlot(
        userId: number,
        restaurantId: number,
        tableId: number,
        reservationDate: string,
        slotHour: Hour,
    ): boolean {
        return this.reservations.some((reservation) => {
            return (
                reservation.userId === userId &&
                reservation.restaurantId === restaurantId &&
                reservation.tableId === tableId &&
                reservation.reservationDate === reservationDate &&
                reservation.slotHour === slotHour &&
                reservation.status === "ACTIVE"
            );
        });
    }
}