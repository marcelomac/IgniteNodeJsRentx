import { inject, injectable } from 'tsyringe';
import { sign, verify } from 'jsonwebtoken';
import { IUsersTokensRepository } from '@modules/accounts/repositories/IUsersTokensRepository';
import auth from '@config/auth';
import { AppError } from '@shared/errors/AppErrors';
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';

/*
AULA https://app.rocketseat.com.br/node/chapter-v-2/group/autenticacao-2/lesson/criando-caso-de-uso-do-refresh-token
*/

interface IPayload {
  sub: string;
  email: string;
}

@injectable()
class RefreshTokenUseCase {
  constructor(
    @inject('UsersTokensRepository')
    private usersTokensRepository: IUsersTokensRepository,
    @inject('DayjsDateProvider')
    private dayJsDateProvider: IDateProvider
  ) {}

  async execute(token: string): Promise<string> {
    const { email, sub } = verify(token, auth.secret_refresh_token) as IPayload;
    const user_id = sub;

    const userToken =
      await this.usersTokensRepository.findByUserIdAndRefreshToken(
        user_id,
        token
      );

    if (!userToken) {
      throw new AppError('Refresh Token does not exists!');
    }

    // Caso exista o refresh token, o mesmo será removido para ser criado um novo:
    await this.usersTokensRepository.deleteById(userToken.id);

    const refresh_token = sign({ email }, auth.secret_refresh_token, {
      subject: user_id,
      expiresIn: auth.expires_in_refresh_token,
    });

    const refresh_token_expires_date = this.dayJsDateProvider.addDays(
      auth.expires_in_refresh_token_days
    );

    await this.usersTokensRepository.create({
      expires_date: refresh_token_expires_date,
      refresh_token: refresh_token,
      user_id: user_id,
    });

    return refresh_token;
  }
}

export { RefreshTokenUseCase };
