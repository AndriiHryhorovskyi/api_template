'use strict';

const { app } = require('../helpers');

describe('/sys/', () => {
  const url = '/api/sys';

  test('should return Hi', async () => {
    const response = await app.get(url);

    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toBe('Hi');
  });

  test('should return sent data', async () => {
    const payload = { key: 'value' };
    const response = await app.get(`${url}/echo`).send({ payload });
    expect(response.body).toHaveProperty('data.payload.key', 'value');
  });
});
