import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { UsersRepository } from '@modules/accounts/infra/typeorm/repositories/UsersRepository';
import { AppError } from '@shared/errors/AppErrors';

/**
 * interface para forçar a função verify() retornar um tipo (IPayload) que
 * contenha uma string 'sub'.
 * Para isso usa-se a expressão "as" para o tipo de retorno da função.
 */
interface IPayload {
  sub: string;
}

async function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('Token missing', 401);
  }

  const [, token] = authHeader.split(' ');

  try {
    /**
     * função Verify() do jsonwebtoken para verificar se o token é válido:
     * Retorna:
     *  {
          iat: 1636034137,
          exp: 1636120537,
          sub: '29a32bee-ec44-4eb0-bc21-1c7270215765'
        }
     */

    const { sub: user_id } = verify(
      token,
      'bb696c815a194f0893ba177f8df45c1d'  // hash aleatório gerado no site MD5
    ) as IPayload;

    const usersRepository = new UsersRepository();

    const user = await usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User does not exists!', 401);
    }

    
    /**
     * SECTION
     * ANCHOR Request recebe user_id
     * Passando o user_id para o request. Posteriormente será utilizado para validar
     * o usuário.
     * Ex:
     * LINK src\modules\accounts\useCases\updateUserAvatar\UpdateUserAvatarController.ts
     *
     * Aula do Ignite: https://app.rocketseat.com.br/node/continuando-a-aplicacao/group/avatar-de-usuario/lesson/adicionando-coluna-de-avatar
     * Devido ao Typescript, é necessário sobrescrever a tipagem do request.
     * Para isso precisa:
     *  - criar uma pasta com o nome "@types"
     *  - criar uma pasta com o nome da biblioteca que será sobrescrita. Ex: "express"
     *  - criar arquivo "index.d.tx" (extensão das tipagens)
     *  Ex: LINK src\@types\express\index.d.ts
     *
     * !SECTION
     */

    request.user = { id: user_id };

    next();
  } catch {
    throw new AppError('Invalid token!', 401);
  }
}

export { ensureAuthenticated };
