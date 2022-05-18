import { Request, Response } from 'express';
import { container, inject, injectable } from 'tsyringe';
import { ListSpecificationsUseCase } from './ListSpecificationsUseCase';

@injectable()
class ListSpecificationsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const listSpecificationsUseCase = container.resolve(ListSpecificationsUseCase);

    const list = await listSpecificationsUseCase.execute();

    return response.status(200).json(list);
  };
}

export { ListSpecificationsController }