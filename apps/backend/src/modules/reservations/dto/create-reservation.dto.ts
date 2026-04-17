import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateReservationDto {
    @IsNumber()
    @IsNotEmpty()
    restaurantId!: number;

    @IsDate()
    @IsNotEmpty()
    @Type(() => Date)
    reservationDate!: Date;

    @IsDate()
    @IsNotEmpty()
    @Type(() => Date)
    startTime!: Date;


    @IsNumber()
    @IsNotEmpty()
    partySize!: number;
}