import type { WaitlistEntry } from "../types/domain";

type WaitlistPanelProps = {
    entries: WaitlistEntry[];
};

export function WaitlistPanel({ entries }: WaitlistPanelProps) {
    return (
        <div>
            <h2>My waitlist entries</h2>

            {entries.length === 0 ? (
                <p>No waitlist entries yet.</p>
            ) : (
                <ul>
                    {entries.map((entry) => (
                        <li key={entry.id}>
                            Restaurant {entry.restaurantId}, table {entry.tableId}, date{" "}
                            {entry.reservationDate}, hour {entry.slotHour}:00, status{" "}
                            <strong>{entry.status}</strong>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}