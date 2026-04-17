import type { Hour, HourAvailability } from "../types/domain";

type AvailabilityGridProps = {
    availability: HourAvailability | null;
    canSeeAdvancedWaitlist: boolean;
    onSelectSlot: (hour: Hour) => void;
    onJoinWaitlist: (hour: Hour) => void;
};

const HOURS: Hour[] = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19];

export function AvailabilityGrid({
    availability,
    canSeeAdvancedWaitlist,
    onSelectSlot,
    onJoinWaitlist,
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

                    if (isAvailable) {
                        return (
                            <button
                                key={hour}
                                onClick={() => onSelectSlot(hour)}
                                style={{
                                    padding: "12px",
                                    minWidth: "90px",
                                    textAlign: "center",
                                    border: "1px solid #ccc",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    backgroundColor: "#c8f7c5",
                                }}
                            >
                                {hour}:00
                            </button>
                        );
                    }

                    return (
                        <div
                            key={hour}
                            style={{
                                padding: "12px",
                                minWidth: "120px",
                                textAlign: "center",
                                border: "1px solid #ccc",
                                borderRadius: "8px",
                                backgroundColor: "#f7c5c5",
                            }}
                        >
                            <div>{hour}:00</div>

                            {canSeeAdvancedWaitlist ? (
                                <button
                                    onClick={() => onJoinWaitlist(hour)}
                                    style={{ marginTop: "8px" }}
                                >
                                    Join waitlist
                                </button>
                            ) : (
                                <div style={{ marginTop: "8px", fontSize: "12px" }}>
                                    Occupied
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}