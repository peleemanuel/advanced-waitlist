import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsAvailabilityController } from './reservations-availability.controller';
import { ReservationService } from './reservations.service';

describe('ReservationsAvailabilityController', () => {
    let controller: ReservationsAvailabilityController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ReservationsAvailabilityController],
            providers: [
                {
                    provide: ReservationService,
                    useValue: {
                        buildAvailabilityForTableOnDate: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<ReservationsAvailabilityController>(
            ReservationsAvailabilityController,
        );
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
