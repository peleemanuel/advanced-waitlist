import type { Restaurant } from '../types/domain';

const API_BASE_URL = 'http://localhost:3000';

export async function getRestaurants(): Promise<Restaurant[]> {
    const response = await fetch(`${API_BASE_URL}/restaurants`);

    if (!response.ok) {
        throw new Error('Failed to fetch restaurants');
    }

    return response.json();
}