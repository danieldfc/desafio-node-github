import request from 'supertest';
import app from '../../src/app';

import factory from '../factories';
import truncate from '../util/truncate';

describe('Session', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should be abled to access private router with authenticated', async () => {
    const user = await factory.create('User', {
      password: '123123',
    });

    const response = await request(app)
      .get('/dashboard')
      .set('Authorization', `Bearer ${user.generateToken()}`);

    expect(response.status).toBe(200);
  });

  it('should not be abled to access private router with jwt invalid', async () => {
    const response = await request(app)
      .post('/dashboard')
      .set('Authorization', 'Bearer 123123');

    expect(response.status).toBe(401);
  });

  it('should not be abled to access private router with jwt not found', async () => {
    const response = await request(app).post('/dashboard');

    expect(response.status).toBe(401);
  });

  it('should be able to session', async () => {
    const user = await factory.create('User', {
      cpf: '123.123.123-09',
      password: '123456',
      provider: true,
    });

    const response = await request(app)
      .post('/sessions')
      .send({
        email: user.email,
        password: user.password_hash,
      });

    expect(response.body).toHaveProperty('token');
  });

  it('should not be able with email invalid', async () => {
    const user = await factory.attrs('User', {
      cpf: '123.123.123-09',
      provider: true,
    });

    const response = await request(app)
      .post('/sessions')
      .send({
        email: 'asdasdasdasd',
        password: user.password_hash,
      });

    expect(response.status).toBe(401);
  });

  it('should not be able with password invalid', async () => {
    const user = await factory.attrs('User', {
      cpf: '123.123.123-09',
      provider: true,
    });

    const response = await request(app)
      .post('/sessions')
      .send({
        email: user.email,
        password: '123',
      });

    expect(response.status).toBe(401);
  });
});
