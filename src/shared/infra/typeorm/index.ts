import { Connection, createConnection, getConnectionOptions } from 'typeorm';
require('dotenv/config');

interface IOptions {
  host: string;
}

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
/*
export default async (): Promise<Connection> => {
  const defaultOptions = await getConnectionOptions();

  return createConnection(
    Object.assign(defaultOptions, {
      database:
        process.env.NODE_ENV === "test"
          ? "rentx_test"
          : defaultOptions.database,
    })
  );
};
;
*/

/*
interface IOptions {
  host: string;
}

export default async() getConnectionOptions().then((options) => {
  const newOptions = options as IOptions;
  newOptions.host = 'database_ignite'; //Essa opção deverá ser EXATAMENTE o nome dado ao service do banco de dados no Docker Compose;
  createConnection({
    ...options,
  });
});


/**
 * Passa o parâmetro 'host' com o 'database_ignite' como default. Isso é devido ao conflito
 * do typeorm com o Docker.
 * Na chamada de createConnection() em /seed/admin é passado o valor 'localhost'
 */
//export default async (host = 'database_ignite'): Promise<Connection> => {
/*
export default async (): Promise<Connection> => {
  const defaultOptions = await getConnectionOptions();
  /*
  return createConnection(
    Object.assign(defaultOptions, {
      host: process.env.HOST,
      database: 'rentx_test',
    })
  );

  return createConnection(
    Object.assign(defaultOptions, {
      database:
        process.env.NODE_ENV === 'test'
          ? 'rentx_test'
          : defaultOptions.database,
    })
  );
  /*
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
  */
