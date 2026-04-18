import { useEffect, useState } from "react";
import "./App.css";
import { AvailabilityGrid } from "./components/AvailabilityGrid";
import { RestaurantList } from "./components/RestaurantList";
import { TableList } from "./components/TableList";
import { UserSelector } from "./components/UserSelector";
import { MOCK_USERS } from "./mock-users";
import {
  createReservation,
  getAdvancedWaitlistUiFlag,
  getRestaurants,
  getTableAvailability,
  createWaitlistEntry,
  getMyWaitlistEntries,
} from "./services/api";
import type { Hour, HourAvailability, Restaurant, User, WaitlistEntry } from "./types/domain";
import { WaitlistPanel } from "./components/WaitlistPanel";

function App() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<number | null>(null);
  const [selectedTableId, setSelectedTableId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState("2026-04-20");
  const [availability, setAvailability] = useState<HourAvailability | null>(null);

  const [selectedUserId, setSelectedUserId] = useState<number>(MOCK_USERS[0].id);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [message, setMessage] = useState<string | null>(null);
  const [bookingInProgress, setBookingInProgress] = useState(false);

  const [canSeeAdvancedWaitlist, setCanSeeAdvancedWaitlist] = useState(false);

  const [waitlistEntries, setWaitlistEntries] = useState<WaitlistEntry[]>([]);

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

  const selectedUser: User =
    MOCK_USERS.find((user) => user.id === selectedUserId) ?? MOCK_USERS[0];

  useEffect(() => {
    async function loadFeatureFlags() {
      try {
        setError(null);

        const enabled = await getAdvancedWaitlistUiFlag(
          selectedUser.id,
          selectedUser.segment,
        );

        setCanSeeAdvancedWaitlist(enabled);
      } catch (err) {
        console.error("Error fetching feature flag:", err);
        setCanSeeAdvancedWaitlist(false);
      }
    }

    loadFeatureFlags();
  }, [selectedUser.id, selectedUser.segment]);

  const selectedRestaurant =
    restaurants.find((restaurant) => restaurant.id === selectedRestaurantId) ?? null;

  function handleSelectRestaurant(restaurantId: number) {
    setSelectedRestaurantId(restaurantId);
    setSelectedTableId(null);
    setAvailability(null);
    setMessage(null);
    setError(null);
  }

  async function loadMyWaitlistEntries(userId: number) {
    const data = await getMyWaitlistEntries(userId);
    setWaitlistEntries(data);
  }

  async function handleJoinWaitlist(hour: Hour) {
    if (!selectedRestaurantId || !selectedTableId) {
      return;
    }

    try {
      setBookingInProgress(true);
      setMessage(null);
      setError(null);

      await createWaitlistEntry({
        userId: selectedUser.id,
        restaurantId: selectedRestaurantId,
        tableId: selectedTableId,
        reservationDate: selectedDate,
        slotHour: hour,
      });

      setMessage(
        `${selectedUser.name} joined waitlist for ${selectedDate} at ${hour}:00`,
      );

      await loadMyWaitlistEntries(selectedUser.id);

    } catch (err) {
      if (err instanceof Error) {
        setMessage(err.message);
      } else {
        setMessage("Could not join waitlist");
      }
    } finally {
      setBookingInProgress(false);
    }
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
        userId: selectedUser.id,
        restaurantId: selectedRestaurantId,
        tableId: selectedTableId,
        reservationDate: selectedDate,
        slotHour: hour,
      });

      setMessage(
        `Reservation created for ${selectedUser.name} on ${selectedDate} at ${hour}:00`,
      );

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

      <UserSelector
        users={MOCK_USERS}
        selectedUserId={selectedUserId}
        onSelectUser={setSelectedUserId}
      />

      <div style={{ marginBottom: "16px" }}>
        Active segment: <strong>{selectedUser.segment}</strong>
      </div>

      <div style={{ marginBottom: "16px" }}>
        Advanced waitlist UI enabled:{" "}
        <strong>{canSeeAdvancedWaitlist ? "yes" : "no"}</strong>
      </div>

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

      {canSeeAdvancedWaitlist && (
        <div style={{ marginTop: "32px" }}>
          <WaitlistPanel entries={waitlistEntries} />
        </div>)}

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
          canSeeAdvancedWaitlist={canSeeAdvancedWaitlist}
          onSelectSlot={handleSelectSlot}
          onJoinWaitlist={handleJoinWaitlist}
        />
      </div>
    </div>
  );
}

export default App;