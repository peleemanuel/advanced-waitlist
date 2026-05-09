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
        <div
            style={{
                border: "1px solid #d1d5db",
                borderRadius: "12px",
                padding: "16px",
            }}
        >
            <h2>My reservations</h2>

            {reservations.length === 0 ? (
                <p>No reservations yet.</p>
            ) : (
                <div>
                    {reservations.map((reservation) => (
                        <div key={reservation.id} style={{ padding: "12px" }}>
                            <div>
                                Restaurant{" "}
                                {reservation.restaurantId}, table {reservation.tableId}, date{" "}
                                {reservation.reservationDate}, hour {reservation.slotHour}:00,
                                status <strong style={{ color: reservation.status === "ACTIVE" ? "green" : "red" }}>{reservation.status}</strong>
                            </div>

                            {reservation.status === "ACTIVE" && (
                                <button
                                    onClick={() => onCancelReservation(reservation.id)}
                                    style={{ marginTop: "8px" }}
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}