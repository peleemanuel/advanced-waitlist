import type { User } from "../types/domain";

type UserSelectorProps = {
    users: User[];
    selectedUserId: number;
    onSelectUser: (userId: number) => void;
};

export function UserSelector({
    users,
    selectedUserId,
    onSelectUser,
}: UserSelectorProps) {
    return (
        <div style={{ marginBottom: "16px" }}>
            <label>
                Current user:{" "}
                <select
                    value={selectedUserId}
                    onChange={(event) => onSelectUser(Number(event.target.value))}
                >
                    {users.map((user) => (
                        <option key={user.id} value={user.id}>
                            {user.name} ({user.segment})
                        </option>
                    ))}
                </select>
            </label>
        </div>
    );
}