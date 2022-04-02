import {
  ICarsRepository,
  ICreateCarDTO,
} from '@modules/cars/repositories/ICarsRepository';
import { getRepository, Repository } from 'typeorm';
import { Car } from '../entities/Car';

class CarsRepository implements ICarsRepository {
  private repository: Repository<Car>;

  constructor() {
    this.repository = getRepository(Car);
  }

  async create({
    id,
    name,
    description,
    daily_rate,
    license_plate,
    fine_amount,
    brand,
    category_id,
    specifications,
  }: ICreateCarDTO): Promise<Car> {
    const car = this.repository.create({
      id,
      name,
      description,
      daily_rate,
      license_plate,
      fine_amount,
      brand,
      category_id,
      specifications,
    });

    await this.repository.save(car);

    return car;
  }

  async findByLicensePlate(license_plate: string): Promise<Car> {
    const car = await this.repository.findOne({ license_plate });

    return car;
  }

  async findAvailable(
    brand?: string,
    category_id?: string,
    name?: string
  ): Promise<Car[]> {
    const carsQuery = this.repository.createQueryBuilder('c');

    if (brand) {
      carsQuery.andWhere('brand = :brand', { brand });
    }

    if (name) {
      carsQuery.andWhere('name = :name', { name });
    }

    if (category_id) {
      carsQuery.andWhere('category_id = :category_id', { category_id });
    }

    // carsQuery.andWhere('available = true');

    const cars = await carsQuery.getMany();

    // .leftJoinAndSelect('cars.category_id', 'categories');
    // .where('(available = :available)', {available: true})
    //   `(available = true) OR ((name = '${name})' OR (brand = '${brand})' OR (cars.category_id = '${category_id}'))`
    // )
    // .getOneOrFail();

    return cars;
  }

  async findById(car_id: string): Promise<Car> {
    const car = await this.repository.findOne(car_id);
    return car;
  }

  async updateAvailable(id: string, available: boolean): Promise<void> {
    // Opção usando QueryBuilder:
    await this.repository
      .createQueryBuilder()
      .update()
      .set({ available })
      .where('id = :id')
      .setParameters({ id })
      .execute();

    // Ou do modo tradicional:
    /*
    const car = await this.repository.findOne(id);
    car.available = available;
    return car;    
    */
  }
}

export { CarsRepository };
