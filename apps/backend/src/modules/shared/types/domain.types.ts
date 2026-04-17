export type Hour = 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19;

export type HourAvailability = Record<Hour, boolean>;

export type Table = {
  id: number;
  tableNumber: number;
  capacity: number;
};

export type Restaurant = {
  id: number;
  name: string;
  tables: Table[];
};

export type ReservationStatus = 'ACTIVE' | 'CANCELLED';

export type Reservation = {
  id: number;
  userId: number;
  restaurantId: number;
  tableId: number;
  reservationDate: string;
  slotHour: Hour;
  status: ReservationStatus;
};

export type WaitlistStatus = 'WAITING' | 'PROMOTED' | 'CANCELLED';

export type WaitlistEntry = {
  id: number;
  userId: number;
  restaurantId: number;
  tableId: number;
  reservationDate: string;
  slotHour: Hour;
  status: WaitlistStatus;
};