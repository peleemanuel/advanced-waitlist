import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from "@nestjs/common";
import { WaitlistService } from "./waitlist.service";
import { CreateWaitlistEntryDto } from "./dto/create-waitlist-entry.dto";
import type { Hour } from "../shared/types/domain.types";
@Controller("waitlist")
export class WaitlistController {
    constructor(private readonly waitlistService: WaitlistService) { }

    @Post()
    create(@Body() createWaitlistEntryDto: CreateWaitlistEntryDto) {
        return this.waitlistService.create(createWaitlistEntryDto);
    }

    @Get()
    findAll() {
        return this.waitlistService.findAll();
    }

    @Get("my")
    findMyEntries(@Query("userId", ParseIntPipe) userId: number) {
        return this.waitlistService.findMyEntries(userId);
    }
    @Get("slot")
    findEntriesForSlot(
        @Query("restaurantId", ParseIntPipe) restaurantId: number,
        @Query("tableId", ParseIntPipe) tableId: number,
        @Query("date") reservationDate: string,
        @Query("slotHour", ParseIntPipe) slotHour: Hour,
    ) {
        return this.waitlistService.findEntriesForSlot(
            restaurantId,
            tableId,
            reservationDate,
            slotHour,
        );
    }

    @Get(":id")
    findCertainEntry(@Param("id", ParseIntPipe) id: number) {
        return this.waitlistService.findCertainEntry(id);
    }

}