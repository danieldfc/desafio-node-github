import request from 'supertest';
import bcrypt from 'bcryptjs';
import app from '../../src/app';

import factory from '../factories';
import truncate from '../util/truncate';

describe('User', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should be able to register', async () => {
    const user = await factory.attrs('User');

    const response = await request(app)
      .post('/users')
      .send(user);

    expect(response.body).toHaveProperty('id');
  });

  it('should not be able to register with duplicated email', async () => {
    const user = await factory.attrs('User');

    await request(app)
      .post('/users')
      .send(user);

    const response = await request(app)
      .post('/users')
      .send(user);

    expect(response.status).toBe(400);
  });

  it('should encrypt user password when new user created', async () => {
    const user = await factory.create('User', {
      password: '123456',
    });

    const comparePass = await bcrypt.compare('123456', user.password_hash);

    expect(comparePass).toBe(true);
  });

  it('should not encrypt user password when new user created', async () => {
    const response = await factory.create('User', {
      password: '123456',
    });

    const compareHash = await bcrypt.compare('12345', response.password_hash);

    expect(compareHash).toBe(false);
  });

  it('should be able to update with email and password', async () => {
    const user = await factory.attrs('User', {
      email: 'daniel@test.com',
      password: '123123',
    });

    const res = await request(app)
      .post('/users')
      .send(user);

    const req = await request(app)
      .post('/sessions')
      .send({
        email: user.email,
        password: user.password,
      });

    const response = await request(app)
      .put(`/users/${res.body.id}`)
      .set('Authorization', `Bearer ${req.body.token}`)
      .send({
        email: 'daniel1@test.com',
      });

    expect(response.body).toHaveProperty('id');
  });

  it('should not be able to update with email already exists', async () => {
    const user = await factory.attrs('User', {
      email: 'daniel@test.com',
      password: '123123',
    });

    const res = await request(app)
      .post('/users')
      .send(user);

    const userTwo = await factory.attrs('User', {
      email: 'carlos@test.com',
      password: '123123',
    });

    await request(app)
      .post('/users')
      .send(userTwo);

    const req = await request(app)
      .post('/sessions')
      .send({
        email: user.email,
        password: user.password,
      });

    const response = await request(app)
      .put(`/users/${res.body.id}`)
      .set('Authorization', `Bearer ${req.body.token}`)
      .send({ email: userTwo.email });

    expect(response.status).toBe(400);
  });

  xit('should not be able to update with oldPassword inexists', async () => {
    const user = await factory.create('User');

    const session = await request(app)
      .post('/sessions')
      .send({ email: user.email, password: user.email });

    const response = await request(app)
      .put('/users/:id')
      .set('Authorization', `Bearer ${session.body.token}`)
      .send({ email: user.email, oldPassword: user.password });

    expect(response.body).toHaveProperty('id');
  });
});
