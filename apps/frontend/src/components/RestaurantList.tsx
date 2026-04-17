import type { Restaurant } from '../types/domain';

type RestaurantListProps = {
  restaurants: Restaurant[];
  selectedRestaurantId: number | null;
  onSelectRestaurant: (restaurantId: number) => void;
};

export function RestaurantList({
  restaurants,
  selectedRestaurantId,
  onSelectRestaurant,
}: RestaurantListProps) {
  return (
    <div>
      <h2>Restaurants</h2>

      {restaurants.length === 0 ? (
        <p>No restaurants found.</p>
      ) : (
        <ul>
          {restaurants.map((restaurant) => (
            <li key={restaurant.id}>
              <button
                onClick={() => onSelectRestaurant(restaurant.id)}
                style={{
                  fontWeight:
                    selectedRestaurantId === restaurant.id ? 'bold' : 'normal',
                }}
              >
                {restaurant.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}