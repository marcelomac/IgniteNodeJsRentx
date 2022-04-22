import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { ResetPasswordUserUseCase } from './ResetPasswordUserUseCase';
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository';
import { SimpleConsoleLogger } from 'typeorm';

class ResetPasswordUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { token } = request.query;
    const { password } = request.body;

    console.log('query:');
    console.log(request.query);

    const resetPasswordUserUseCase = container.resolve(
      ResetPasswordUserUseCase
    );

    // ### não funciona o 'token.toString()' ??
    await resetPasswordUserUseCase.execute({ token: String(token), password });

    return response.send();
  }
}

export { ResetPasswordUserController };
