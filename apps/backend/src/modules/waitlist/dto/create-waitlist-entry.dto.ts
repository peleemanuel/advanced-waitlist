import { IsIn, IsInt, IsNotEmpty, IsString, Matches } from "class-validator";
import type { Hour } from "../../shared/types/domain.types";

export class CreateWaitlistEntryDto {
    @IsInt()
    @IsNotEmpty()
    userId!: number;

    @IsInt()
    @IsNotEmpty()
    restaurantId!: number;

    @IsInt()
    @IsNotEmpty()
    tableId!: number;

    @IsString()
    @IsNotEmpty()
    @Matches(/^\d{4}-\d{2}-\d{2}$/)
    reservationDate!: string;

    @IsInt()
    @IsNotEmpty()
    @IsIn([10, 11, 12, 13, 14, 15, 16, 17, 18, 19])
    slotHour!: Hour;
}