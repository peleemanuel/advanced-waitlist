import { IsInt, IsString } from "class-validator";
import type { Hour } from "../../shared/types/domain.types";

export class CreateWaitlistEntryDto {
    @IsInt()
    userId!: number;

    @IsInt()
    restaurantId!: number;

    @IsInt()
    tableId!: number;

    @IsString()
    reservationDate!: string;

    @IsInt()
    slotHour!: Hour;
}