import { instanceToInstance } from 'class-transformer';
import { IUserResponseDTO } from '../dtos/IUserResponseDTO';
import { User } from '../infra/typeorm/entities/User';

/**
 * AULA: https://app.rocketseat.com.br/node/chapter-vi-2/group/configuracao-aws/lesson/criando-url-de-acesso-do-avatar
 */
class UserMap {
  // método toDTO():
  static toDTO({
    email,
    name,
    id,
    avatar,
    driver_license,
    avatar_url,
  }: User): IUserResponseDTO {
    const user = instanceToInstance({
      email,
      name,
      id,
      avatar,
      driver_license,
      avatar_url,
    });
    return user;
  }
}

export { UserMap };
