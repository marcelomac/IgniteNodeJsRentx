import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { ProfileUserUseCase } from './profileUserUseCase';
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository';

class ProfileUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;

    console.log('user: ', id);

    const profileUserUseCase = container.resolve(ProfileUserUseCase);

    const user = await profileUserUseCase.execute(id);

    return response.status(201).json(user);
  }
}

export { ProfileUserController };
