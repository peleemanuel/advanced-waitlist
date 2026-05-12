import type { Hour, HourAvailability, Restaurant, WaitlistEntry, Reservation } from '../types/domain';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

type ApiErrorBody = {
    message?: string | string[];
};

async function requestJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
    let response: Response;

    try {
        response = await fetch(input, init);
    } catch (_err) {
        throw new Error("Network error while contacting API");
    }

    if (!response.ok) {
        const errorBody: ApiErrorBody | null = await response.json().catch(() => null);
        const message = Array.isArray(errorBody?.message)
            ? errorBody?.message.join(", ")
            : errorBody?.message ?? `Request failed (${response.status})`;
        throw new Error(message);
    }

    return response.json() as Promise<T>;
}

export async function getRestaurants(): Promise<Restaurant[]> {
    return requestJson<Restaurant[]>(`${API_BASE_URL}/restaurants`);
}

export async function getTableAvailability(
    restaurantId: number,
    tableId: number,
    date: string,
): Promise<HourAvailability> {
    const params = new URLSearchParams({ date });
    return requestJson<HourAvailability>(
        `${API_BASE_URL}/reservations/availability/${restaurantId}/${tableId}?${params.toString()}`,
    );
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
    return requestJson(`${API_BASE_URL}/reservations`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });
}

export async function getAdvancedWaitlistUiFlag(
    userId: number,
): Promise<boolean> {
    const params = new URLSearchParams({ userId: String(userId) });
    const data = await requestJson<{ flag: string; enabled: boolean }>(
        `${API_BASE_URL}/feature-flags/advanced-waitlist-ui?${params.toString()}`,
    );
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
    return requestJson(`${API_BASE_URL}/waitlist`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });
}

export async function getMyWaitlistEntries(
    userId: number,
): Promise<WaitlistEntry[]> {
    const params = new URLSearchParams({ userId: String(userId) });
    return requestJson<WaitlistEntry[]>(
        `${API_BASE_URL}/waitlist/my?${params.toString()}`,
    );
}

export async function getReservations(): Promise<Reservation[]> {
    return requestJson<Reservation[]>(`${API_BASE_URL}/reservations`);
}

export async function cancelReservation(reservationId: number) {
    return requestJson(
        `${API_BASE_URL}/reservations/${reservationId}/cancel`,
        {
            method: "PATCH",
        },
    );
}

export async function getWaitlistEntriesForSlot(
    restaurantId: number,
    tableId: number,
    date: string,
    slotHour: Hour,
): Promise<WaitlistEntry[]> {
    const params = new URLSearchParams({
        restaurantId: String(restaurantId),
        tableId: String(tableId),
        date,
        slotHour: String(slotHour),
    });
    return requestJson<WaitlistEntry[]>(
        `${API_BASE_URL}/waitlist/slot?${params.toString()}`,
    );
}