import { useEffect, useState } from 'react';
import './App.css';
import { AvailabilityGrid } from './components/AvailabilityGrid';
import { RestaurantList } from './components/RestaurantList';
import { TableList } from './components/TableList';
import { getRestaurants, getTableAvailability } from './services/api';
import type { HourAvailability, Restaurant } from './types/domain';

function App() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<number | null>(null);
  const [selectedTableId, setSelectedTableId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState('2026-04-20');
  const [availability, setAvailability] = useState<HourAvailability | null>(null);

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

  useEffect(() => {
    async function loadAvailability() {
      if (!selectedRestaurantId || !selectedTableId || !selectedDate) {
        setAvailability(null);
        return;
      }

      try {
        const data = await getTableAvailability(
          selectedRestaurantId,
          selectedTableId,
          selectedDate,
        );
        setAvailability(data);
      } catch (err) {
        console.log('Error fetching availability:', err);
        setError('Could not load availability');
      }
    }

    loadAvailability();
  }, [selectedRestaurantId, selectedTableId, selectedDate]);

  const selectedRestaurant =
    restaurants.find((restaurant) => restaurant.id === selectedRestaurantId) ?? null;

  function handleSelectRestaurant(restaurantId: number) {
    setSelectedRestaurantId(restaurantId);
    setSelectedTableId(null);
    setAvailability(null);
  }

  if (loading) {
    return <div>Loading restaurants...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={{ padding: '24px' }}>
      <h1>Restaurant Booking Demo</h1>

      <div style={{ marginBottom: '16px' }}>
        <label>
          Selected date:{' '}
          <input
            type="date"
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
          />
        </label>
      </div>

      <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
        <RestaurantList
          restaurants={restaurants}
          selectedRestaurantId={selectedRestaurantId}
          onSelectRestaurant={handleSelectRestaurant}
        />

        <TableList
          restaurant={selectedRestaurant}
          selectedTableId={selectedTableId}
          onSelectTable={setSelectedTableId}
        />

        <AvailabilityGrid availability={availability} />
      </div>
    </div>
  );
}

export default App;