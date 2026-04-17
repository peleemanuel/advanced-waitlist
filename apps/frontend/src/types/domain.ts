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