import request from 'supertest';
import app from '../../../src/app';

import factory from '../../factories';
import truncate from '../../util/truncate';

describe('User', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should be able to list the providers', async () => {
    const user = await factory.create('User');

    const response = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${user.generateToken()}`)
      .send({ provider: true });

    expect(response.status).toBe(200);
  });
});
