import type { Hour, HourAvailability } from "../types/domain";

type AvailabilityGridProps = {
    availability: HourAvailability | null;
    selectedHour: number | null;
    canSeeAdvancedWaitlist: boolean;
    onInspectSlot: (hour: Hour) => void;
    onReserveSlot: (hour: Hour) => void;
    onJoinWaitlist: (hour: Hour) => void;
    userAlreadyHasReservationForHour: (hour: Hour) => boolean;
};

const HOURS: Hour[] = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19];

export function AvailabilityGrid({
    availability,
    selectedHour,
    canSeeAdvancedWaitlist,
    onInspectSlot,
    onReserveSlot,
    onJoinWaitlist,
    userAlreadyHasReservationForHour,
}: AvailabilityGridProps) {
    if (!availability) {
        return <p>Select a table and a date to see availability.</p>;
    }

    return (
        <div>
            <h2>Availability</h2>

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {HOURS.map((hour) => {
                    const isAvailable = availability[hour];
                    const isSelected = selectedHour === hour;
                    const userAlreadyHasReservation =
                        userAlreadyHasReservationForHour(hour);

                    return (
                        <div
                            key={hour}
                            onClick={() => onInspectSlot(hour)}
                            style={{
                                padding: "12px",
                                minWidth: "140px",
                                textAlign: "center",
                                border: isSelected ? "2px solid black" : "1px solid #ccc",
                                borderRadius: "8px",
                                cursor: "pointer",
                                backgroundColor: isAvailable ? "#c8f7c5" : "#f7c5c5",
                            }}
                        >
                            <div>
                                <strong>{hour}:00</strong>
                            </div>

                            <div style={{ marginTop: "8px", fontSize: "12px" }}>
                                {isAvailable ? "Available" : "Occupied"}
                            </div>

                            <div style={{ marginTop: "10px" }}>
                                {isAvailable ? (
                                    <button
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            onReserveSlot(hour);
                                        }}
                                    >
                                        Reserve
                                    </button>
                                ) : canSeeAdvancedWaitlist && !userAlreadyHasReservation ? (
                                    <button
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            onJoinWaitlist(hour);
                                        }}
                                    >
                                        Join waitlist
                                    </button>
                                ) : null}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}