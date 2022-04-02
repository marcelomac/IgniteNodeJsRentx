import { hash } from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { Connection } from 'typeorm';
import { app } from '@shared/infra/http/app';
import request from 'supertest';
import createConnection from '@shared/infra/typeorm';

let connection: Connection;

describe('Create Category Controller', () => {
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

  it('should be able to create a new category', async () => {
    // autenticando o user admin na aplicação para criar a categoria:
    const responseToken = await request(app).post('/sessions').send({
      email: 'admin@rentx.com',
      password: 'admin',
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post('/categories')
      .send({
        name: 'Category Supertest2',
        description: 'Category Supertest descriptions2',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(201);
  });

  it('should not be able to create a category with existent name', async () => {
    // autenticando o user admin na aplicação para criar a categoria:
    const responseToken = await request(app).post('/sessions').send({
      email: 'admin@rentx.com',
      password: 'admin',
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post('/categories')
      .send({
        name: 'Category Supertest2',
        description: 'Category Supertest descriptions2',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(400);
  });
});
