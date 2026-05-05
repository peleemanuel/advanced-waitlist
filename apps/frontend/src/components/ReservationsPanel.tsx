import type { Reservation } from "../types/domain";

type ReservationsPanelProps = {
    reservations: Reservation[];
    onCancelReservation: (reservationId: number) => void;
};

export function ReservationsPanel({
    reservations,
    onCancelReservation,
}: ReservationsPanelProps) {
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
                                Restaurant {reservation.restaurantId}, table {reservation.tableId},
                                date {reservation.reservationDate}, hour {reservation.slotHour}:00,
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