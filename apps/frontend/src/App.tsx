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
  cancelReservation,
  getReservations,
} from "./services/api";
import type { Hour, HourAvailability, Restaurant, User, WaitlistEntry, Reservation } from "./types/domain";
import { WaitlistPanel } from "./components/WaitlistPanel";
import { ReservationsPanel } from "./components/ReservationsPanel";
import { SelectedSlotPanel } from "./components/SelectedSlotPanel";

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

  const [reservations, setReservations] = useState<Reservation[]>([]);

  const [selectedHour, setSelectedHour] = useState<number | null>(null);

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

  const selectedUserReservations = reservations.filter(
    (reservation) => reservation.userId === selectedUser.id,
  );

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
    setSelectedHour(null);
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

    setSelectedHour(hour);

    try {
      setBookingInProgress(true);
      setMessage(null);
      setError(null);
      setSelectedHour(hour);

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

  async function handleReserveSlot(hour: Hour) {
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

      setSelectedHour(hour);

      setMessage(
        `Reservation created for ${selectedUser.name} on ${selectedDate} at ${hour}:00`,
      );

      await loadAvailability(
        selectedRestaurantId,
        selectedTableId,
        selectedDate,
      );

      await loadReservations();
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

  async function loadReservations() {
    const data = await getReservations();
    setReservations(data);
  }

  async function handleCancelReservation(reservationId: number) {
    try {
      setBookingInProgress(true);
      setMessage(null);
      setError(null);

      const result = await cancelReservation(reservationId);

      if (result.promotedReservation) {
        setMessage(
          `Reservation cancelled. User ${result.promotedReservation.userId} was auto-promoted from waitlist.`,
        );
      } else {
        setMessage("Reservation cancelled.");
      }

      await loadReservations();

      if (selectedRestaurantId && selectedTableId) {
        await loadAvailability(selectedRestaurantId, selectedTableId, selectedDate);
      }

      await loadMyWaitlistEntries(selectedUser.id);
    } catch (err) {
      if (err instanceof Error) {
        setMessage(err.message);
      } else {
        setMessage("Could not cancel reservation");
      }
    } finally {
      setBookingInProgress(false);
    }
  }

  useEffect(() => {
    async function fetchReservations() {
      try {
        await loadReservations();
      } catch (err) {
        console.error("Error fetching reservations:", err);
      }
    }

    fetchReservations();
  }, []);

  function userAlreadyHasReservationForHour(hour: Hour): boolean {
    if (!selectedRestaurantId || !selectedTableId) {
      return false;
    }

    return selectedUserReservations.some((reservation) => {
      return (
        reservation.restaurantId === selectedRestaurantId &&
        reservation.tableId === selectedTableId &&
        reservation.reservationDate === selectedDate &&
        reservation.slotHour === hour &&
        reservation.status === "ACTIVE"
      );
    });
  }

  function handleInspectSlot(hour: Hour) {
    setSelectedHour(hour);
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

      <div style={{ marginTop: "32px" }}>
        <ReservationsPanel
          reservations={selectedUserReservations}
          users={MOCK_USERS}
          onCancelReservation={handleCancelReservation}
        />
      </div>

      {canSeeAdvancedWaitlist && (
        <div style={{ marginTop: "32px" }}>
          <WaitlistPanel entries={waitlistEntries} users={MOCK_USERS} />
        </div>)}

      <div style={{ marginTop: "32px" }}>
        <SelectedSlotPanel
          selectedRestaurantId={selectedRestaurantId}
          selectedTableId={selectedTableId}
          selectedDate={selectedDate}
          selectedHour={selectedHour}
          reservations={reservations}
          waitlistEntries={waitlistEntries}
          users={MOCK_USERS}
        />
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
          onSelectTable={(tableId) => {
            setSelectedTableId(tableId);
            setSelectedHour(null);
            setAvailability(null);
            setMessage(null);
          }}
        />

        <AvailabilityGrid
          availability={availability}
          selectedHour={selectedHour}
          canSeeAdvancedWaitlist={canSeeAdvancedWaitlist}
          onInspectSlot={handleInspectSlot}
          onReserveSlot={handleReserveSlot}
          onJoinWaitlist={handleJoinWaitlist}
          userAlreadyHasReservationForHour={userAlreadyHasReservationForHour}
        />
      </div>
    </div>
  );
}

export default App;