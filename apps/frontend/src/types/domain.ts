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

export type Hour = 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19;

export type HourAvailability = Record<Hour, boolean>;