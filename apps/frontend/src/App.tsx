import { useEffect, useState } from 'react';
import './App.css';
import { getRestaurants } from './services/api';
import type { Restaurant } from './types/domain';

function App() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadRestaurants() {
      try {
        const data = await getRestaurants();
        setRestaurants(data);
      } catch (err) {
        console.log('Error fetching restaurants:', err);
        setError('Could not load restaurants');
      } finally {
        setLoading(false);
      }
    }

    loadRestaurants();
  }, []);

  if (loading) {
    return <div>Loading restaurants...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={{ padding: '24px' }}>
      <h1>Restaurants</h1>

      {restaurants.length === 0 ? (
        <p>No restaurants found.</p>
      ) : (
        <ul>
          {restaurants.map((restaurant) => (
            <li key={restaurant.id}>
              <strong>{restaurant.name}</strong> - {restaurant.tables.length} tables
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;