import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { RefreshTokenUseCase } from './RefreshTokenUseCase';

/*
AULA https://app.rocketseat.com.br/node/chapter-v-2/group/autenticacao-2/lesson/controller-refresh-token
*/

class RefreshTokenController {
  async handle(request: Request, response: Response): Promise<Response> {
    const token =
      request.body.token ||
      request.headers['x-access-token'] ||
      request.query.token;

    const refreshTokenUseCase = container.resolve(RefreshTokenUseCase);

    const refreshToken = await refreshTokenUseCase.execute(token);

    return response.json(refreshToken);
  }
}

export { RefreshTokenController };
