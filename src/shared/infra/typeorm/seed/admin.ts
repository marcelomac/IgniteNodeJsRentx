/**
 * => Inserir um usuário administrador
 *
 * 1- criar uma conexão
 * 2- inserir o usuário
 *
 */
import { v4 as uuidv4 } from 'uuid';
import { hash } from 'bcryptjs';

import createConnection from '../index';
//import createConnection from '@shared/infra/typeorm';

async function create() {
  //const connection = await createConnection('localhost');
  const connection = await createConnection();
  const id = uuidv4();
  const password = await hash('admin', 8);

  await connection.query(
    `INSERT INTO USERS (id, name, email, password, driver_license, "isAdmin", created_at)
    VALUES ('${id}', 'admin', 'admin@rentx.com', '${password}', 'abc123456789', true, 'now()')`
  );
}

create().then(() => console.log('User admin created!'));
