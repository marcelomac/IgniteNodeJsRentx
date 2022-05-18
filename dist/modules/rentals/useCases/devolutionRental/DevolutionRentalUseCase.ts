import { Car } from '@modules/cars/infra/typeorm/entities/Car';
import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository';
import { Rental } from '@modules/rentals/infra/entities/Rental';
import { IRentalsRepository } from '@modules/rentals/repositories/IRentalsRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import { AppError } from '@shared/errors/AppErrors';
import { inject, injectable } from 'tsyringe';

interface IRequest {
  id: string;
  user_id: string;
}

@injectable()
class DevolutionRentalUseCase {
  constructor(
    @inject('RentalsRepository')
    private rentalsRepository: IRentalsRepository,

    @inject('CarsRepository')
    private carsRepository: ICarsRepository,

    @inject('DayjsDateProvider')
    private dateProvider: IDateProvider
  ) {}

  async execute({ id, user_id }: IRequest): Promise<Rental> {
    const minimum_daily = 1;
    const rental = await this.rentalsRepository.findById(id);
    const car = await this.carsRepository.findById(rental.car_id);

    if (!rental) {
      throw new AppError('Rental does not exists!');
    }

    // Calcular o tempo total de aluguel:
    let daily = this.dateProvider.compareInDays(
      rental.start_date,
      this.dateProvider.dateNow()
    );

    daily = daily <= 0 ? minimum_daily : daily;

    // Ao realizar a devolução, deverá ser calculado o total do aluguel
    let total = 0;
    total += daily * car.daily_rate;

    // Verifica se houve atraso na devolução:
    // ** fn compareInDays(start_date: Date, end_date: Date): number
    const delay = this.dateProvider.compareInDays(
      rental.expected_return_date,
      this.dateProvider.dateNow()
    );

    // caso haja multa, deverá ser somada ao total do aluguel
    if (delay > 0) {
      const calculate_fine = delay * car.fine_amount;
      total += calculate_fine;
    }

    rental.end_date = this.dateProvider.dateNow();
    rental.total = total;

    await this.rentalsRepository.create(rental);

    // Ao realizar a devolução, o carro deverá ser liberado para outro aluguel
    this.carsRepository.updateAvailable(rental.car_id, true);

    // Ao realizar a devolução, o usuário deverá ser liberado para outro aluguel

    return rental;
  }
}

export { DevolutionRentalUseCase };
