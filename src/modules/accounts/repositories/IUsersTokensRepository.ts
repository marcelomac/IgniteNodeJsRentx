import { ICreateUserTokensDTO } from '../dtos/ICreateUserTokenDTO';
import { UserTokens } from '../infra/typeorm/entities/UserTokens';

interface IUsersTokensRepository {
  create({
    refresh_token,
    user_id,
    expires_date,
  }: ICreateUserTokensDTO): Promise<UserTokens>;
}

export { IUsersTokensRepository };
