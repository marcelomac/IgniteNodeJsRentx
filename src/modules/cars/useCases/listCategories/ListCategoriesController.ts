import { Request, Response } from 'express';
import { container, injectable } from 'tsyringe';
import { ListCategoriesUseCase } from './ListCategoriesUseCase';

@injectable()
class ListCategoriesController {
  async handle(request: Request, response: Response): Promise<Response> {
    const listCategoriesUseCase = container.resolve(ListCategoriesUseCase);

    const list = await listCategoriesUseCase.execute();

    return response.status(200).json(list);
  }
}

export { ListCategoriesController };
