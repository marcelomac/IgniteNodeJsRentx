import { ICreateCarDTO } from '@modules/cars/dtos/ICreateCarsDTO';
import { Car } from '@modules/cars/infra/typeorm/entities/Car';
import { ICarsRepository } from '../ICarsRepository';

class CarsRepositoryInMemory implements ICarsRepository {
  cars: Car[] = [];
  async create({
    id,
    name,
    description,
    daily_rate,
    license_plate,
    fine_amount,
    brand,
    category_id,
  }: ICreateCarDTO): Promise<Car> {
    const car = new Car();
    
    Object.assign(car, {
      id,
      name,
      description,
      daily_rate,
      license_plate,
      fine_amount,
      brand,
      category_id,
    });
    
    this.cars.push(car);
    
    return car;
  }

  async findByLicensePlate(license_plate: string): Promise<Car> {
    return this.cars.find((car) => car.license_plate === license_plate);
  }
  
  async findAvailable(
    brand?: string,
    category_id?: string,
    name?: string
    ): Promise<Car[]> {
      const all = this.cars.filter((car) => {
        if (
          car.available === true ||
          (brand && car.brand === brand) ||
          (category_id && car.category_id === category_id) ||
          (name && car.name === name)
          ) {
            return car;
          }
        });
        return all;
      }
      
      async findById(car_id: string): Promise<Car> {
        return this.cars.find((car) => car.id === car_id);
      }

      async updateAvailable(id: string, available: boolean): Promise<void> {

        // findIndex() retorna o índice no array do primeiro elemento que satisfizer a função de teste
        const findIndex = this.cars.findIndex((car) => car.id === id);
        this.cars[findIndex].available = available;

        // OU:
        // find retorna o valor de um elemento encontrado no array em vez de seu índice.
        /*
        const car = this.cars.find((car) => car.id === id);
        car.available = available;
        */
      }
    }
    
    export { CarsRepositoryInMemory };
   
