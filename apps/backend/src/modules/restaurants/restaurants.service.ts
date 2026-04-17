import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { Reservation, Restaurant, Table } from '../shared/types/domain.types';

@Injectable()
export class RestaurantsService {
  private restaurants: Restaurant[] = [
    {
      id: 1,
      name: 'Demo Restaurant',
      tables: [
        { id: 1, tableNumber: 1, capacity: 2 },
        { id: 2, tableNumber: 2, capacity: 4 },
        { id: 3, tableNumber: 3, capacity: 3 },
        { id: 4, tableNumber: 4, capacity: 6 },
        { id: 5, tableNumber: 5, capacity: 2 },
      ],
    },
    {
      id: 2,
      name: 'Second Restaurant',
      tables: [
        { id: 6, tableNumber: 1, capacity: 4 },
        { id: 7, tableNumber: 2, capacity: 2 },
        { id: 8, tableNumber: 3, capacity: 5 },
        { id: 9, tableNumber: 4, capacity: 3 },
        { id: 10, tableNumber: 5, capacity: 6 },
      ],
    },
  ];

  findAll() {
    return this.restaurants;
  }

  create(createRestaurantDto: CreateRestaurantDto) {
    const nextTableId = this.restaurants
      .flatMap((restaurant) => restaurant.tables)
      .reduce((maxId, table) => Math.max(maxId, table.id), 0);

    const newRestaurant: Restaurant = {
      id: this.restaurants.length + 1,
      name: createRestaurantDto.name,
      tables: this.generateDefaultTables(nextTableId + 1),
    };

    this.restaurants.push(newRestaurant);
    return newRestaurant;
  }

  findCertainRestaurant(id: number) {
    const found = this.findAll().find((restaurant) => restaurant.id === id);
    if (!found) throw new NotFoundException('Restaurant not found');
    return found;
  }

  findCertainTableInRestaurant(restaurantId: number, tableId: number) {
    const restaurant = this.findCertainRestaurant(restaurantId);
    const tableExists = restaurant.tables.some(
      (table) => table.id === tableId,
    );

    if (!tableExists) {
      throw new NotFoundException('Table not found for restaurant');
    }
    return tableExists;
  }

  private randomCapacity() {
    return Math.floor(Math.random() * 5) + 2;
  }

  findTablesForRestaurant(restaurantId: number) {
    const restaurant = this.findCertainRestaurant(restaurantId);
    return restaurant.tables;
  }

  private generateDefaultTables(startId: number): Table[] {
    return [1, 2, 3, 4, 5].map((tableNumber, index) => ({
      id: startId + index,
      tableNumber,
      capacity: this.randomCapacity(),
    }));
  }

  findActiveReservationsForTableOnDate(
    tableId: number,
    date: string,
    reservations: Reservation[] = [],
  ) {
    const tableExists = this.restaurants.some((restaurant) =>
      restaurant.tables.some((table) => table.id === tableId),
    );

    if (!tableExists) {
      throw new NotFoundException('Table not found');
    }

    return reservations.filter(
      (reservation) =>
        reservation.tableId === tableId &&
        reservation.reservationDate === date &&
        reservation.status === 'ACTIVE',
    );
  }


}