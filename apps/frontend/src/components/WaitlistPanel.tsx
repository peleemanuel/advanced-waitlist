import type { WaitlistEntry } from "../types/domain";

type WaitlistPanelProps = {
    entries: WaitlistEntry[];
};

export function WaitlistPanel({ entries }: WaitlistPanelProps) {

    function getStatusColor(status: WaitlistEntry["status"]) {
        if (status === "WAITING") return "#d97706";
        if (status === "PROMOTED") return "green";
        return "#6b7280";
    }

    return (
        <div
            style={{
                border: "1px solid #d1d5db",
                borderRadius: "12px",
                padding: "16px",
            }}
        >
            <h2 style={{ marginTop: 0 }}>My waitlist entries</h2>

            {entries.length === 0 ? (
                <p>No waitlist entries yet.</p>
            ) : (
                <div>
                    {entries.map((entry) => (
                        <div
                            key={entry.id}
                            style={{ padding: "12px" }}
                        >
                            <div>
                                Restaurant {entry.restaurantId}, table {entry.tableId}, date{" "}
                                {entry.reservationDate}, hour {entry.slotHour}:00, status{" "}
                                <strong style={{ color: getStatusColor(entry.status) }}>
                                    {entry.status}
                                </strong>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}