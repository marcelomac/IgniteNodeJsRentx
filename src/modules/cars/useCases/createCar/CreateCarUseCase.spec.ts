import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { AppError } from '@shared/errors/AppErrors';
import { CreateCarUseCase } from './CreateCarUseCase';

let createCarUseCase: CreateCarUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe('Create Car', () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    createCarUseCase = new CreateCarUseCase(carsRepositoryInMemory);
  });
  it('should be able to create a new car', async () => {
    const car = await createCarUseCase.execute({
      name: 'Fusca',
      description: 'carro de passeio',
      daily_rate: 100,
      license_plate: 'ABC-1234',
      fine_amount: 60,
      brand: 'VW',
      category_id: 'id_category',
    });

    expect(car).toHaveProperty('id');
  });

  it('should not be able to create a car with exists license plate', async () => {
    await createCarUseCase.execute({
      name: 'Brasília',
      description: 'carro de passeio',
      daily_rate: 100,
      license_plate: 'ABC-1234',
      fine_amount: 60,
      brand: 'VW',
      category_id: 'id_category',
    });

    await expect(
      createCarUseCase.execute({
        name: 'Chevete',
        description: 'carro de passeio',
        daily_rate: 100,
        license_plate: 'ABC-1234',
        fine_amount: 60,
        brand: 'VW',
        category_id: 'id_category',
      })
    ).rejects.toEqual(new AppError('Car already exists!'));
  });

  it('should be able to create a car with available true by default', async () => {
    const car = await createCarUseCase.execute({
      name: 'Chevete',
      description: 'carro de passeio',
      daily_rate: 100,
      license_plate: 'ABC-1234',
      fine_amount: 60,
      brand: 'VW',
      category_id: 'id_category',
    });

    expect(car.available).toBe(true);
  });
});