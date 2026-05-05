import type { User, WaitlistEntry } from "../types/domain";

type WaitlistPanelProps = {
    entries: WaitlistEntry[];
    users: User[];
};

export function WaitlistPanel({ entries, users }: WaitlistPanelProps) {
    function getUserName(userId: number) {
        return users.find((user) => user.id === userId)?.name ?? `User ${userId}`;
    }

    function getStatusColor(status: WaitlistEntry["status"]) {
        if (status === "WAITING") return "#d97706";
        if (status === "PROMOTED") return "#15803d";
        return "#6b7280";
    }

    return (
        <div>
            <h2>My waitlist entries</h2>

            {entries.length === 0 ? (
                <p>No waitlist entries yet.</p>
            ) : (
                <ul>
                    {entries.map((entry) => (
                        <li key={entry.id} style={{ marginBottom: "12px" }}>
                            <div>
                                <strong>{getUserName(entry.userId)}</strong> - restaurant{" "}
                                {entry.restaurantId}, table {entry.tableId}, date{" "}
                                {entry.reservationDate}, hour {entry.slotHour}:00, status{" "}
                                <strong style={{ color: getStatusColor(entry.status) }}>
                                    {entry.status}
                                </strong>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}