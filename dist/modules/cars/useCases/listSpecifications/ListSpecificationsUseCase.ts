import { Specification } from '@modules/cars/infra/typeorm/entities/Specification';
import { inject, injectable } from 'tsyringe';
import { ISpecificationsRepository } from '../../repositories/ISpecificationsRepository';

@injectable()
class ListSpecificationsUseCase {

  constructor(
    @inject('SpecificationsRepository')
    private specificationsRepository: ISpecificationsRepository) {}

  async execute(): Promise<Specification[]> {
    const specifications = await this.specificationsRepository.list();
    return specifications;

  }
}

export { ListSpecificationsUseCase }