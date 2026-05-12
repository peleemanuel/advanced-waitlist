import { BadRequestException, Inject, Injectable, NotFoundException, forwardRef } from "@nestjs/common";
import { CreateWaitlistEntryDto } from "./dto/create-waitlist-entry.dto";
import { RestaurantsService } from "../restaurants/restaurants.service";
import { WaitlistEntry } from "../shared/types/domain.types";
import { ReservationService } from "../reservations/reservations.service";
import { Hour } from "../shared/types/domain.types";
import { UsersService } from "../users/users.service";

@Injectable()
export class WaitlistService {
    constructor(
        private readonly restaurantsService: RestaurantsService,
        @Inject(forwardRef(() => ReservationService))
        private readonly reservationService: ReservationService,
        private readonly usersService: UsersService,
    ) { }

    // In-memory store for demo purposes only.
    private waitlistEntries: WaitlistEntry[] = [];

    create(createWaitlistEntryDto: CreateWaitlistEntryDto) {
        this.usersService.findCertainUser(createWaitlistEntryDto.userId);

        this.restaurantsService.findCertainTableInRestaurant(
            createWaitlistEntryDto.restaurantId,
            createWaitlistEntryDto.tableId,
        );

        const userAlreadyHasReservation =
            this.reservationService.userHasActiveReservationForSlot(
                createWaitlistEntryDto.userId,
                createWaitlistEntryDto.restaurantId,
                createWaitlistEntryDto.tableId,
                createWaitlistEntryDto.reservationDate,
                createWaitlistEntryDto.slotHour,
            );

        if (userAlreadyHasReservation) {
            throw new BadRequestException(
                "User already has an active reservation for this slot",
            );
        }

        const isSlotAvailable = this.reservationService.isSlotAvailable(
            createWaitlistEntryDto.restaurantId,
            createWaitlistEntryDto.tableId,
            createWaitlistEntryDto.reservationDate,
            createWaitlistEntryDto.slotHour,
        );

        if (isSlotAvailable) {
            throw new BadRequestException(
                "Slot is still available, waitlist entry is not needed",
            );
        }

        const alreadyInWaitlist = this.waitlistEntries.some((entry) => {
            return (
                entry.userId === createWaitlistEntryDto.userId &&
                entry.restaurantId === createWaitlistEntryDto.restaurantId &&
                entry.tableId === createWaitlistEntryDto.tableId &&
                entry.reservationDate === createWaitlistEntryDto.reservationDate &&
                entry.slotHour === createWaitlistEntryDto.slotHour &&
                entry.status === "WAITING"
            );
        });

        if (alreadyInWaitlist) {
            throw new BadRequestException(
                "User is already in waitlist for this slot",
            );
        }

        const newEntry: WaitlistEntry = {
            id: this.waitlistEntries.length + 1,
            userId: createWaitlistEntryDto.userId,
            restaurantId: createWaitlistEntryDto.restaurantId,
            tableId: createWaitlistEntryDto.tableId,
            reservationDate: createWaitlistEntryDto.reservationDate,
            slotHour: createWaitlistEntryDto.slotHour,
            status: "WAITING",
        };

        this.waitlistEntries.push(newEntry);
        return newEntry;
    }

    findAll() {
        return this.waitlistEntries;
    }

    findMyEntries(userId: number) {
        return this.waitlistEntries.filter((entry) => entry.userId === userId);
    }

    findCertainEntry(id: number) {
        const found = this.waitlistEntries.find((entry) => entry.id === id);

        if (!found) {
            throw new NotFoundException("Waitlist entry not found");
        }

        return found;
    }

    findFirstWaitingEntryForSlot(
        restaurantId: number,
        tableId: number,
        reservationDate: string,
        slotHour: number,
    ) {
        return (
            this.waitlistEntries.find((entry) => {
                return (
                    entry.restaurantId === restaurantId &&
                    entry.tableId === tableId &&
                    entry.reservationDate === reservationDate &&
                    entry.slotHour === slotHour &&
                    entry.status === "WAITING"
                );
            }) ?? null
        );
    }

    markPromoted(id: number) {
        const entry = this.findCertainEntry(id);
        entry.status = "PROMOTED";
        return entry;
    }

    findEntriesForSlot(
        restaurantId: number,
        tableId: number,
        reservationDate: string,
        slotHour: Hour,
    ) {
        return this.waitlistEntries.filter((entry) => {
            return (
                entry.restaurantId === restaurantId &&
                entry.tableId === tableId &&
                entry.reservationDate === reservationDate &&
                entry.slotHour === slotHour
            );
        });
    }
}