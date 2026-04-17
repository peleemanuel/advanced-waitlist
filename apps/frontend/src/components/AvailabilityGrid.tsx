import type { Hour, HourAvailability } from '../types/domain';

type AvailabilityGridProps = {
  availability: HourAvailability | null;
  onSelectSlot: (hour: Hour) => void;
};

const HOURS: Hour[] = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19];

export function AvailabilityGrid({
  availability,
  onSelectSlot,
}: AvailabilityGridProps) {
  if (!availability) {
    return <p>Select a table and a date to see availability.</p>;
  }

  return (
    <div>
      <h2>Availability</h2>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {HOURS.map((hour) => {
          const isAvailable = availability[hour];

          return (
            <button
              key={hour}
              onClick={() => onSelectSlot(hour)}
              disabled={!isAvailable}
              style={{
                padding: '12px',
                minWidth: '70px',
                textAlign: 'center',
                border: '1px solid #ccc',
                borderRadius: '8px',
                cursor: isAvailable ? 'pointer' : 'not-allowed',
                backgroundColor: isAvailable ? '#c8f7c5' : '#f7c5c5',
              }}
            >
              {hour}:00
            </button>
          );
        })}
      </div>
    </div>
  );
}