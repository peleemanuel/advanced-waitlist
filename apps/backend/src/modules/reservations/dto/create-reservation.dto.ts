import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateReservationDto {
  @IsNumber()
  @IsNotEmpty()
  restaurantId!: number;

  @IsNumber()
  @IsNotEmpty()
  tableId!: number;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  reservationDate!: Date;

  @IsDate()
  @IsNotEmpty()
  slotHour!: number;

  @IsBoolean()
  @IsNotEmpty()
  status!: boolean;
}