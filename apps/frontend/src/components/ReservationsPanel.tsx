import type { Reservation, User } from "../types/domain";

type ReservationsPanelProps = {
    reservations: Reservation[];
    users: User[];
    onCancelReservation: (reservationId: number) => void;
};

export function ReservationsPanel({
    reservations,
    users,
    onCancelReservation,
}: ReservationsPanelProps) {
    function getUserName(userId: number) {
        return users.find((user) => user.id === userId)?.name ?? `User ${userId}`;
    }

    return (
        <div>
            <h2>My reservations</h2>

            {reservations.length === 0 ? (
                <p>No reservations yet.</p>
            ) : (
                <ul>
                    {reservations.map((reservation) => (
                        <li key={reservation.id} style={{ marginBottom: "12px" }}>
                            <div>
                                <strong>{getUserName(reservation.userId)}</strong> - restaurant{" "}
                                {reservation.restaurantId}, table {reservation.tableId}, date{" "}
                                {reservation.reservationDate}, hour {reservation.slotHour}:00,
                                status <strong>{reservation.status}</strong>
                            </div>

                            {reservation.status === "ACTIVE" && (
                                <button
                                    onClick={() => onCancelReservation(reservation.id)}
                                    style={{ marginTop: "8px" }}
                                >
                                    Cancel
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}