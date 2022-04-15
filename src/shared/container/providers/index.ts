import { container } from 'tsyringe';
import { IDateProvider } from './DateProvider/IDateProvider';
import { DayjsDateProvider } from './DateProvider/implementations/DayjsDateProvider';
import { IMailProvider } from './MailProvider/IMailProvider';
import { EtherealMailProvider } from './MailProvider/implementations/EtherealMailProvider';

container.registerSingleton<IDateProvider>(
  'DayjsDateProvider',
  DayjsDateProvider
);

/**
 * Este provider precisa ser injetado assim que a aplicação é iniciada para que seja possível
 * criar o "client" (no EtherealMailProvider) antes de chamar o método "sendMail()". Para isso
 * use-se o "registerInstance".
 * Obs: Apesar de não ser um registerSingleton, o container também será inicializado somente
 * uma vez.
 */
container.registerInstance<IMailProvider>(
  'EtherealMailProvider',
  new EtherealMailProvider()
);
