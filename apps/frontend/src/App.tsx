import { useEffect, useState } from "react";
import "./App.css";
import { AvailabilityGrid } from "./components/AvailabilityGrid";
import { RestaurantList } from "./components/RestaurantList";
import { TableList } from "./components/TableList";
import {
  createReservation,
  getRestaurants,
  getTableAvailability,
} from "./services/api";
import type { Hour, HourAvailability, Restaurant } from "./types/domain";

function App() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<number | null>(null);
  const [selectedTableId, setSelectedTableId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState("2026-04-20");
  const [availability, setAvailability] = useState<HourAvailability | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [message, setMessage] = useState<string | null>(null);
  const [bookingInProgress, setBookingInProgress] = useState(false);

  async function loadAvailability(
    restaurantId: number,
    tableId: number,
    date: string,
  ) {
    const data = await getTableAvailability(restaurantId, tableId, date);
    setAvailability(data);
  }

  useEffect(() => {
    async function loadRestaurants() {
      try {
        setError(null);
        const data = await getRestaurants();
        setRestaurants(data);
      } catch (err) {
        console.error("Error fetching restaurants:", err);
        setError("Could not load restaurants");
      } finally {
        setLoading(false);
      }
    }

    loadRestaurants();
  }, []);

  useEffect(() => {
    async function fetchAvailability() {
      if (!selectedRestaurantId || !selectedTableId || !selectedDate) {
        setAvailability(null);
        return;
      }

      try {
        setError(null);
        await loadAvailability(selectedRestaurantId, selectedTableId, selectedDate);
      } catch (err) {
        console.error("Error fetching availability:", err);
        setError("Could not load availability");
      }
    }

    fetchAvailability();
  }, [selectedRestaurantId, selectedTableId, selectedDate]);

  const selectedRestaurant =
    restaurants.find((restaurant) => restaurant.id === selectedRestaurantId) ?? null;

  function handleSelectRestaurant(restaurantId: number) {
    setSelectedRestaurantId(restaurantId);
    setSelectedTableId(null);
    setAvailability(null);
    setMessage(null);
    setError(null);
  }

  async function handleSelectSlot(hour: Hour) {
    if (!selectedRestaurantId || !selectedTableId) {
      return;
    }

    try {
      setBookingInProgress(true);
      setMessage(null);
      setError(null);

      await createReservation({
        userId: 1,
        restaurantId: selectedRestaurantId,
        tableId: selectedTableId,
        reservationDate: selectedDate,
        slotHour: hour,
      });

      setMessage(`Reservation created for ${selectedDate} at ${hour}:00`);

      await loadAvailability(
        selectedRestaurantId,
        selectedTableId,
        selectedDate,
      );
    } catch (err) {
      if (err instanceof Error) {
        setMessage(err.message);
      } else {
        setMessage("Could not create reservation");
      }
    } finally {
      setBookingInProgress(false);
    }
  }

  if (loading) {
    return <div style={{ padding: "24px" }}>Loading restaurants...</div>;
  }

  return (
    <div style={{ padding: "24px" }}>
      <h1>Restaurant Booking Demo</h1>

      <div style={{ marginBottom: "16px" }}>
        <label>
          Selected date:{" "}
          <input
            type="date"
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
          />
        </label>
      </div>

      {error && (
        <div style={{ marginBottom: "16px", color: "red" }}>
          {error}
        </div>
      )}

      {message && (
        <div style={{ marginBottom: "16px" }}>
          {message}
        </div>
      )}

      {bookingInProgress && (
        <div style={{ marginBottom: "16px" }}>
          Creating reservation...
        </div>
      )}

      <div style={{ display: "flex", gap: "40px", alignItems: "flex-start" }}>
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

        <AvailabilityGrid
          availability={availability}
          onSelectSlot={handleSelectSlot}
        />
      </div>
    </div>
  );
}

export default App;