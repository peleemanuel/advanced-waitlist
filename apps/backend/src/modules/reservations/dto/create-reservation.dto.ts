import { IsDate, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateReservationDto {
    @IsNumber()
    @IsNotEmpty()
    restaurantId!: number;

    @IsDate()
    @IsNotEmpty()
    reservationDate!: Date;

    @IsDate()
    @IsNotEmpty()
    startTime!: Date;


    @IsNumber()
    @IsNotEmpty()
    partySize!: number;
}