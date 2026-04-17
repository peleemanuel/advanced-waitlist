import { Test, TestingModule } from '@nestjs/testing';
import { ReservationService } from './reservations.service';
import { RestaurantsService } from '../restaurants/restaurants.service';

describe('ReservationService', () => {
  let service: ReservationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationService,
        {
          provide: RestaurantsService,
          useValue: {
            findCertainTableInRestaurant: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ReservationService>(ReservationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
