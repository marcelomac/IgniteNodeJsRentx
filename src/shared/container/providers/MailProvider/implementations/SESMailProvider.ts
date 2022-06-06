import nodemailer, { Transporter } from 'nodemailer';
import { SES } from 'aws-sdk';
import { injectable } from 'tsyringe';
import { IMailProvider } from '../IMailProvider';
import handlebars from 'handlebars';
import fs from 'fs';

/**
 * AULA: https://app.rocketseat.com.br/node/chapter-vi-2/group/configuracao-aws/lesson/criando-provider-do-ses-mail
 */

@injectable()
class SESMailProvider implements IMailProvider {
  private client: Transporter;

  constructor() {
    this.client = nodemailer.createTransport({
      SES: new SES({
        apiVersion: '2010-12-01',
        region: process.env.AWS_REGION,
      }),
    });
  }

  async sendMail(
    to: string,
    subject: string,
    variables: any,
    path: string
  ): Promise<void> {
    const templateFileContent = fs.readFileSync(path).toString('utf-8');
    const templateParse = handlebars.compile(templateFileContent);
    const templateHTML = templateParse(variables);

    await this.client.sendMail({
      from: 'Rentx <rentx@marcelomac.com>',
      to,
      subject,
      html: templateHTML,
    });
  }
}

export { SESMailProvider };
