import type { Hour, HourAvailability, Restaurant } from '../types/domain';

const API_BASE_URL = 'http://localhost:3000';

export async function getRestaurants(): Promise<Restaurant[]> {
    const response = await fetch(`${API_BASE_URL}/restaurants`);

    if (!response.ok) {
        throw new Error('Failed to fetch restaurants');
    }

    return response.json();
}

export async function getTableAvailability(
    restaurantId: number,
    tableId: number,
    date: string,
): Promise<HourAvailability> {
    const response = await fetch(
        `${API_BASE_URL}/restaurants/${restaurantId}/tables/${tableId}/availability?date=${date}`,
    );

    if (!response.ok) {
        throw new Error('Failed to fetch table availability');
    }

    return response.json();
}

export type CreateReservationPayload = {
    userId: number;
    restaurantId: number;
    tableId: number;
    reservationDate: string;
    slotHour: Hour;
};

export async function createReservation(
    payload: CreateReservationPayload,
) {
    const response = await fetch(`${API_BASE_URL}/reservations`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        const message =
            errorBody?.message ?? 'Failed to create reservation';
        throw new Error(message);
    }

    return response.json();
}