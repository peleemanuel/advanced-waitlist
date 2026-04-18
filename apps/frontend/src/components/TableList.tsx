import type { Restaurant } from '../types/domain';

type TableListProps = {
  restaurant: Restaurant | null;
  selectedTableId: number | null;
  onSelectTable: (tableId: number) => void;
};

export function TableList({
  restaurant,
  selectedTableId,
  onSelectTable,
}: TableListProps) {
  if (!restaurant) {
    return <p>Select a restaurant to see its tables.</p>;
  }

  return (
    <div>
      <h2>Tables for {restaurant.name}</h2>

      {restaurant.tables.length === 0 ? (
        <p>No tables found.</p>
      ) : (
        <ul>
          {restaurant.tables.map((table) => (
            <li key={table.id}>
              <button
                onClick={() => onSelectTable(table.id)}
                style={{
                  fontWeight: selectedTableId === table.id ? 'bold' : 'normal'
                }}
              >
                Table {table.tableNumber} - capacity {table.capacity}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}