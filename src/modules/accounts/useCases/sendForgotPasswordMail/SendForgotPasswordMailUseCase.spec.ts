import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory';
import { UsersTokensRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UserTokensRepositoryInMemory';
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';
import { MailProviderInMemory } from '@shared/container/providers/MailProvider/in-memory/MailProviderInMemory';
import { AppError } from '@shared/errors/AppErrors';
import { SendForgotPasswordMailUseCase } from './SendForgotPasswordMailUseCase';

/**
 * AULA: https://app.rocketseat.com.br/node/chapter-v-2/group/testes-1/lesson/testando-envio-de-e-mail
 */

let sendForgotPasswordMailUseCase: SendForgotPasswordMailUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory;
let dateProvider: DayjsDateProvider;
let mailProvider: MailProviderInMemory;

describe('Send Forgot Mail', () => {
  beforeAll(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();
    dateProvider = new DayjsDateProvider();
    mailProvider = new MailProviderInMemory();

    sendForgotPasswordMailUseCase = new SendForgotPasswordMailUseCase(
      usersRepositoryInMemory,
      usersTokensRepositoryInMemory,
      dateProvider,
      mailProvider
    );
  });

  it('Should be able to send a forgot password mail to user', async () => {
    // Função do Jest que monitora uma classe e verifica se algum método foi chamado:
    // ### estudar jest  (spyOn)
    const sendMail = jest.spyOn(mailProvider, 'sendMail');

    await usersRepositoryInMemory.create({
      driver_license: '215466',
      email: 'testmail@test.com',
      name: 'Fulano Silva',
      password: '1234',
    });

    await sendForgotPasswordMailUseCase.execute('testmail@test.com');

    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to send an email if user does not exists', async () => {
    await expect(
      sendForgotPasswordMailUseCase.execute('outromail@test.com')
    ).rejects.toEqual(new AppError('User does not exists!'));
  });

  it('should be able to create an users token', async () => {
    // Verificar se foi criado o UserToken:
    const generateTokenMail = jest.spyOn(
      usersTokensRepositoryInMemory,
      'create'
    );

    usersRepositoryInMemory.create({
      driver_license: '215466',
      email: 'testmail@test.com',
      name: 'Fulano Silva',
      password: '1234',
    });

    await sendForgotPasswordMailUseCase.execute('testmail@test.com');

    expect(generateTokenMail).toBeCalled();
  });
});
