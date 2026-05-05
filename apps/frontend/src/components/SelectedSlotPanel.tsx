import type { Reservation, User, WaitlistEntry } from "../types/domain";

type SelectedSlotPanelProps = {
    selectedRestaurantId: number | null;
    selectedTableId: number | null;
    selectedDate: string;
    selectedHour: number | null;
    reservations: Reservation[];
    waitlistEntries: WaitlistEntry[];
    users: User[];
};

export function SelectedSlotPanel({
    selectedRestaurantId,
    selectedTableId,
    selectedDate,
    selectedHour,
    reservations,
    waitlistEntries,
    users,
}: SelectedSlotPanelProps) {
    function getUserName(userId: number) {
        return users.find((user) => user.id === userId)?.name ?? `User ${userId}`;
    }

    if (
        !selectedRestaurantId ||
        !selectedTableId ||
        selectedHour === null
    ) {
        return <p>Select a slot to see its details.</p>;
    }

    const activeReservation = reservations.find((reservation) => {
        return (
            reservation.restaurantId === selectedRestaurantId &&
            reservation.tableId === selectedTableId &&
            reservation.reservationDate === selectedDate &&
            reservation.slotHour === selectedHour &&
            reservation.status === "ACTIVE"
        );
    });

    const slotWaitlistEntries = waitlistEntries.filter((entry) => {
        return (
            entry.restaurantId === selectedRestaurantId &&
            entry.tableId === selectedTableId &&
            entry.reservationDate === selectedDate &&
            entry.slotHour === selectedHour
        );
    });

    return (
        <div>
            <h2>Selected slot details</h2>

            <div style={{ marginBottom: "12px" }}>
                Restaurant {selectedRestaurantId}, table {selectedTableId}, date{" "}
                {selectedDate}, hour {selectedHour}:00
            </div>

            <div style={{ marginBottom: "12px" }}>
                <strong>Active reservation:</strong>{" "}
                {activeReservation
                    ? `${getUserName(activeReservation.userId)}`
                    : "No active reservation"}
            </div>

            <div>
                <strong>Waitlist:</strong>
                {slotWaitlistEntries.length === 0 ? (
                    <p>No waitlist entries for this slot.</p>
                ) : (
                    <ul>
                        {slotWaitlistEntries.map((entry) => (
                            <li key={entry.id}>
                                {getUserName(entry.userId)} - {entry.status}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}