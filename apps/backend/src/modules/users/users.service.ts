import { Injectable, NotFoundException } from "@nestjs/common";
import { User } from "../shared/types/domain.types";

@Injectable()
export class UsersService {
    private users: User[] = [
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

    findAll() {
        return this.users;
    }

    findCertainUser(id: number) {
        const found = this.users.find((user) => user.id === id);

        if (!found) {
            throw new NotFoundException("User not found");
        }

        return found;
    }
}