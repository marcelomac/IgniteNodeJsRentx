import dayjs from 'dayjs';
import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { RentalsRepositoryInMemory } from '@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory';
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';
import { AppError } from '@shared/errors/AppErrors';
import { CreateRentalUseCase } from './CreateRentalUseCase';
import { Car } from '@modules/cars/infra/typeorm/entities/Car';

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let dayjsDateProvider: DayjsDateProvider;

describe('Create Rental', () => {
  const dayAdd24Hours = dayjs().add(1, 'day').toDate();

  beforeEach(() => {
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    dayjsDateProvider = new DayjsDateProvider();
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepositoryInMemory,
      dayjsDateProvider,
      carsRepositoryInMemory
    );
  });

  it('should be able to create a new rental', async () => {
    const car1 = await carsRepositoryInMemory.create({
      name: 'Fusca',
      description: 'carro de passeio',
      daily_rate: 100,
      license_plate: 'ABC-1234',
      fine_amount: 60,
      brand: 'VW',
      category_id: 'id_category',
    });

    const rental = await createRentalUseCase.execute({
      car_id: car1.id,
      user_id: 'user.id 12345',
      expected_return_date: dayAdd24Hours,
    });

    expect(rental).toHaveProperty('id');
    expect(rental).toHaveProperty('start_date');
  });

  it('should not be able to create a new rental it there is another open to the same user', async () => {
    await rentalsRepositoryInMemory.create({
      car_id: 'carId1',
      user_id: 'user.id111',
      expected_return_date: dayAdd24Hours,
    });

    await expect(
      createRentalUseCase.execute({
        car_id: 'carId2',
        user_id: 'user.id111',
        expected_return_date: dayAdd24Hours,
      })
    ).rejects.toEqual(new AppError("There's a rental in progress for user!"));
  });

  
  it('should not be able to create a new rental it there is another open to the same car', async () => {
    await rentalsRepositoryInMemory.create({
      car_id: 'carId1',
      user_id: 'user.id111',
      expected_return_date: dayAdd24Hours,
    });
    
    await expect(
      createRentalUseCase.execute({
        car_id: 'carId1',
        user_id: 'user.id222',
        expected_return_date: dayAdd24Hours,
      })
      ).rejects.toEqual(new AppError('Car is unavailable'));
    });
    
    it('should not be able to create a new rental with invalid return time', async () => {
    await expect(
      createRentalUseCase.execute({
        car_id: 'car1.id',
        user_id: 'user.id11111',
        expected_return_date: dayjs().toDate(),
      })
    ).rejects.toEqual(new AppError('Invalid return time!'));
  });
});
