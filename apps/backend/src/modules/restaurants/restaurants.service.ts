import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';

@Injectable()
export class RestaurantsService {
  private restaurants = [
    { id: 0, name: 'Demo Restaurant', location: 'Timisoara' },
    { id: 1, name: 'Second Restaurant', location: 'Bucuresti' },
  ];

  findAll() {
    return this.restaurants;
  }

  create(createRestaurantDto: CreateRestaurantDto) {
    const newRestaurant = {
      id: this.restaurants.length + 1,
      ...createRestaurantDto,
    };

    this.restaurants.push(newRestaurant);
    return newRestaurant;
  }

  findCertainRestaurant(id: number) {
    const found = this.findAll().find((restaurant) => restaurant.id === id);
    if (!found) throw new NotFoundException('Restaurant not found');
    return found;
  }
}