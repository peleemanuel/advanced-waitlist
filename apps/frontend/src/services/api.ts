import type { Hour, HourAvailability, Restaurant, WaitlistEntry, Reservation } from '../types/domain';

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
        `${API_BASE_URL}/reservations/availability/${restaurantId}/${tableId}?date=${date}`,
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

export async function getAdvancedWaitlistUiFlag(
    userId: number,
    segment: string,
): Promise<boolean> {
    const response = await fetch(
        `${API_BASE_URL}/feature-flags/advanced-waitlist-ui?userId=${userId}&segment=${segment}`,
    );

    if (!response.ok) {
        throw new Error("Failed to fetch advanced waitlist flag");
    }

    const data: { flag: string; enabled: boolean } = await response.json();
    return data.enabled;
}

export type CreateWaitlistEntryPayload = {
    userId: number;
    restaurantId: number;
    tableId: number;
    reservationDate: string;
    slotHour: Hour;
};

export async function createWaitlistEntry(
    payload: CreateWaitlistEntryPayload,
) {
    try {
        const response = await fetch(`${API_BASE_URL}/waitlist`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorBody = await response.json().catch(() => null);
            const message =
                errorBody?.message ?? "Failed to create waitlist entry";
            throw new Error(message);
        }

        return response.json();
    } catch (err) {
        console.error("Error in createWaitlistEntry:", err);
        throw new Error("Network error while creating waitlist entry");
    }
}

export async function getMyWaitlistEntries(
    userId: number,
): Promise<WaitlistEntry[]> {
    const response = await fetch(`${API_BASE_URL}/waitlist/my?userId=${userId}`);

    if (!response.ok) {
        throw new Error("Failed to fetch waitlist entries");
    }

    return response.json();
}

export async function getReservations(): Promise<Reservation[]> {
    const response = await fetch(`${API_BASE_URL}/reservations`);

    if (!response.ok) {
        throw new Error("Failed to fetch reservations");
    }

    return response.json();
}

export async function cancelReservation(reservationId: number) {
    const response = await fetch(
        `${API_BASE_URL}/reservations/${reservationId}/cancel`,
        {
            method: "PATCH",
        },
    );

    if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        const message = errorBody?.message ?? "Failed to cancel reservation";
        throw new Error(message);
    }

    return response.json();
}