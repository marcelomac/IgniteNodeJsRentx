import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository';
import { Rental } from '@modules/rentals/infra/entities/Rental';
import { IRentalsRepository } from '@modules/rentals/repositories/IRentalsRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import { AppError } from '@shared/errors/AppErrors';
import { inject, injectable } from 'tsyringe';

interface IRequest {
  car_id: string;
  user_id: string;
  expected_return_date: Date;
}

@injectable()
class CreateRentalUseCase {
  constructor(
    @inject('RentalsRepository')
    private rentalsRepository: IRentalsRepository,

    @inject('DayjsDateProvider')
    private dateProvider: IDateProvider,

    @inject('CarsRepository')
    private carsRepository: ICarsRepository
  ) {}

  async execute({
    car_id,
    user_id,
    expected_return_date,
  }: IRequest): Promise<Rental> {
    const minimumHour = 24;
    /*
    const carExists = await this.carsRepository.findById(car_id);

    if (carExists) {
      throw new AppError('Car not exists!');
    }
    */

    // Não deve ser possível cadastrar um novo aluguel caso já exista um aberto para o mesmo carro.
    const rentalOpenToCar = await this.rentalsRepository.findOpenRentalByCar(
      car_id
    );

    if (rentalOpenToCar) {
      throw new AppError('Car is unavailable');
    }

    // Não deve ser possível cadastrar um novo aluguel caso já exista um aberto para o mesmo usuário.
    const rentalOpenToUser = await this.rentalsRepository.findOpenRentalByUser(
      user_id
    );

    if (rentalOpenToUser) {
      throw new AppError("There's a rental in progress for user!");
    }

    // O aluguel deve ter duração mínima de 24 horas.
    const dateNow = this.dateProvider.dateNow();

    const compare = this.dateProvider.compareInHours(
      dateNow,
      expected_return_date
    );

    if (compare < minimumHour) {
      throw new AppError('Invalid return time!');
    }

    // Seta o status de "disponível" do carro como falso:
    this.carsRepository.updateAvailable(car_id, false);

    // Salva o aluguel do carro:
    const rental = await this.rentalsRepository.create({
      car_id,
      user_id,
      expected_return_date,
    });

    return rental;
  }
}

export { CreateRentalUseCase };
