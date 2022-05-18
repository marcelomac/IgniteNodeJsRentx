import { inject, injectable } from 'tsyringe';
import { AppError } from '@shared/errors/AppErrors';

import { ICategoriesRepository } from '../../repositories/ICategoriesRepository';

interface IRequest {
  name: string;
  description: string;
}

/**
 * @ injectable() diz que a classe pode ser injetada em qualquer canto com o uso do 
 * container.resolver() passando como parâmetro o nome da classe a ser injetada
 */

@injectable()
class CreateCategoryUseCase {
  constructor(
    @inject('CategoriesRepository')
    private categoriesRepository: ICategoriesRepository
  ) {}

  async execute({ name, description }: IRequest): Promise<void> {
    const categoryAlreadyExists = await this.categoriesRepository.findByName(
      name
    );

    if (categoryAlreadyExists) {
      throw new AppError('Category already exists');
    }

    this.categoriesRepository.create({ name, description });
  }
}

// outra forma de exportar:
export default CreateCategoryUseCase;
