import { Connection, createConnection, getConnectionOptions } from 'typeorm';
require('dotenv/config');

interface IOptions {
  host: string;
}

// export default async (): Promise<Connection> => {
//   const defaultOptions = await getConnectionOptions();

//   return createConnection(
//     Object.assign(defaultOptions, {
//       database:
//         process.env.NODE_ENV === 'test'
//           ? 'rentx_test'
//           : defaultOptions.database,
//     })
//   );
// };



/**
 * Passa o parâmetro 'host' com o 'database_ignite' como default. Isso é devido ao conflito
 * do typeorm com o Docker.
 * Na chamada de createConnection() em /seed/admin é passado o valor 'localhost'

 * Usa-se o 'host' para identificar o conteiner no Docker.
 */

export default async (host = 'database_ignite'): Promise<Connection> => {
  const defaultOptions = await getConnectionOptions();

  return createConnection(
    Object.assign(defaultOptions, {
      host: process.env.NODE_ENV === 'test' ? 'localhost' : host,
      database:
        process.env.NODE_ENV === 'test'
          ? 'rentx_test'
          : defaultOptions.database,
    })
  );
};
