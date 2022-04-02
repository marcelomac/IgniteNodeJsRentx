import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import swaggerUI from 'swagger-ui-express';

import createConnection from '@shared/infra/typeorm';

import '@shared/container';

import { router } from './routes';
import swaggerFile from '../../../swagger.json';
import { AppError } from '@shared/errors/AppErrors';

require('dotenv/config');

createConnection();

const app = express();

app.use(express.json());
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerFile));
app.use(router);

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
