import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { SpecificationsRepositoryInMemory } from '@modules/cars/repositories/in-memory/SpecificationsRepositoryInMemory';
import { AppError } from '@shared/errors/AppErrors';
import { CreateCarSpecificationsUseCase } from './CreateCarSpecificationsUseCase';

let createCarSpecificationUseCase: CreateCarSpecificationsUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let specificationsRepositoryInMemory: SpecificationsRepositoryInMemory;

describe('Create Car Specification', () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    specificationsRepositoryInMemory = new SpecificationsRepositoryInMemory();
    createCarSpecificationUseCase = new CreateCarSpecificationsUseCase(
      carsRepositoryInMemory,
      specificationsRepositoryInMemory
    );
  });

  it('should not be able to add a new specification to a non-existent car', async () => {
    const car_id = '123';
    const specifications_id = ['654321'];

    await expect(
      createCarSpecificationUseCase.execute({
        car_id,
        specifications_id,
      })
    ).rejects.toEqual(new AppError('Car does not exists'));
  });

  it('should be able to add a new specification to the car', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Fusca',
      description: 'carro de passeio',
      daily_rate: 100,
      license_plate: 'ABC-1234',
      fine_amount: 60,
      brand: 'VW',
      category_id: 'id_category',
    });

    // criando uma especificação
    const specification1 = await specificationsRepositoryInMemory.create({
      name: 'spec1',
      description: 'spec1',
    });

    const specification2 = await specificationsRepositoryInMemory.create({
      name: 'spec2',
      description: 'spec2',
    });

    const specifications_id = [specification1.id, specification2.id];

    const specificationsCars = await createCarSpecificationUseCase.execute({
      car_id: car.id,
      specifications_id,
    });

    expect(specificationsCars).toHaveProperty('specifications');
    expect(specificationsCars.specifications.length).toBe(2);
  });
});
