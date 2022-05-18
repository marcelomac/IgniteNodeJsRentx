import { Request, Response, NextFunction } from 'express';
import { UsersRepository } from '@modules/accounts/infra/typeorm/repositories/UsersRepository';
import { AppError } from '@shared/errors/AppErrors';

async function ensureAdmin(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const { id: user_id } = request.user;

  const usersRepository = new UsersRepository();

  const user = await usersRepository.findById(user_id);

  if (!user.isAdmin) {
    throw new AppError('User isn´t admin!');
  }

  next();
}

export { ensureAdmin };
