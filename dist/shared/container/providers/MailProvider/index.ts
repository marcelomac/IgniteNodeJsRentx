import { container } from 'tsyringe';
import { IMailProvider } from './IMailProvider';
import { EtherealMailProvider } from './implementations/EtherealMailProvider';
import { SESMailProvider } from './implementations/SESMailProvider';


const mailProvider = {
  ethereal: container.resolve(EtherealMailProvider),
  ses: container.resolve(SESMailProvider),
}

/**
 * Este provider precisa ser injetado assim que a aplicação é iniciada para que seja possível
 * criar o "client" (no EtherealMailProvider) antes de chamar o método "sendMail()". Para isso
 * use-se o "registerInstance".
 * Obs: Apesar de não ser um registerSingleton, o container também será inicializado somente
 * uma vez.
 */
container.registerInstance<IMailProvider>(
  'MailProvider',
  mailProvider[process.env.MAIL_PROVIDER]
);
