import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import swaggerUI from 'swagger-ui-express';
import createConnection from '@shared/infra/typeorm';
import '@shared/container';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';

// importar CORS antes das rotas:
import cors from 'cors';

import { router } from './routes';
import swaggerFile from '../../../swagger.json';
import { AppError } from '@shared/errors/AppErrors';
import upload from '@config/upload';
import rateLimiter from '@shared/infra/http/middlewares/rateLimiter';

require('dotenv/config');

createConnection();
const app = express();

// importar o rateLimiter antes das rotas
app.use(rateLimiter);

// importar após rateLimiter
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app }),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

console.log('process.env.SENTRY_DSN: ', process.env.SENTRY_DSN);

// Configurações do Sentry
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

app.use(express.json());
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerFile));

/**
 * AULA (FINAL): https://app.rocketseat.com.br/node/chapter-vi-2/group/configuracao-aws/lesson/criando-url-de-acesso-do-avatar
 * Cria uma 'rota estática'. Ex: localhost:3333/avatar/avatar1.jpg
 */

app.use('/avatar', express.static(`${upload.tmpFolder}/avatar`));
app.use('/cars', express.static(`${upload.tmpFolder}/cars`));

/**
 * se precisar configurar as permissões de acesso da aplicação para apenas um domínio ou ip:
 * app.use(cors({
 *   origin: "domain.com"
 * }))
 */
app.use(cors());
app.use(router);

app.use(Sentry.Handlers.errorHandler());

/** Em middlewares de erro, o parâmetro "Error" precisa ser o primeiro.
 *  Precisa ficar detois das rotas. */
app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({ message: err.message });
    }

    // se for de qualquer outro tipo, retorna o status 500 (erro da aplicação)
    return response.status(500).json({
      status: 'error',
      message: `Internal server error - ${err.message}`,
    });
  }
);

export { app };
