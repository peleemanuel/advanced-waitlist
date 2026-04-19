import type { User } from "./types/domain";

export const MOCK_USERS: User[] = [
    {
        id: 1,
        name: "George",
        email: "george@gmail.com",
        segment: "normal"
    },
    {
        id: 2,
        name: "Razvan",
        email: "razvan.beta@gmail.com",
        segment: "beta"
    },
    {
        id: 3,
        name: "Andrei",
        email: "andrei@upt.ro",
        segment: "normal"
    },
    {
        id: 4,
        name: "Cristi",
        email: "cristi@upt.ro",
        segment: "beta"
    }
];