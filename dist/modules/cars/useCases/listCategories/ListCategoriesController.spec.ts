import { hash } from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { Connection } from 'typeorm';
import { app } from '@shared/infra/http/app';
import request from 'supertest';
import createConnection from '@shared/infra/typeorm';

let connection: Connection;

describe('List Categories Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();

    await connection.runMigrations();

    // usuário admin precisa estar autenticado para criar uma categoria:
    const id = uuidv4();
    const password = await hash('admin', 8);

    await connection.query(
      `INSERT INTO USERS (id, name, email, password, driver_license, "isAdmin", created_at)
      VALUES ('${id}', 'admin', 'admin@rentx.com', '${password}', 'abc123456789', true, 'now()')`
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to list all categories', async () => {
    // autenticando o user admin na aplicação para criar a categoria:
    const responseToken = await request(app).post('/sessions').send({
      email: 'admin@rentx.com',
      password: 'admin',
    });

    const { refresh_token } = responseToken.body;

    await request(app)
      .post('/categories')
      .send({
        name: 'Category One',
        description: 'Category One description',
      })
      .set({
        Authorization: `Bearer ${refresh_token}`,
      });

    const response = await request(app).get('/categories');

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0]).toHaveProperty('id'); // exemplo
    expect(response.body[0].name).toEqual('Category One'); // exemplo
  });
});
