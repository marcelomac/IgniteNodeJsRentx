import { Car } from '@modules/cars/infra/typeorm/entities/Car';
import { inject, injectable } from 'tsyringe';
import { ICarsRepository } from '../../repositories/ICarsRepository';

interface IRequest {
  category_id?: string;
  brand?: string;
  name?: string;
}

@injectable()
class ListAvailableCarsUseCase {
  constructor(
    @inject('CarsRepository')
    private carsRepository: ICarsRepository
  ) {}

  async execute({ category_id, brand, name }: IRequest): Promise<Car[]> {
    const cars = await this.carsRepository.findAvailable(
      brand,
      category_id,
      name
    );

    // console.log(cars);
    return cars;
  }
}

export { ListAvailableCarsUseCase };
