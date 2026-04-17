import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from "@nestjs/common";
import { WaitlistService } from "./waitlist.service";
import { CreateWaitlistEntryDto } from "./dto/create-waitlist-entry.dto";

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

    @Get(":id")
    findCertainEntry(@Param("id", ParseIntPipe) id: number) {
        return this.waitlistService.findCertainEntry(id);
    }
}