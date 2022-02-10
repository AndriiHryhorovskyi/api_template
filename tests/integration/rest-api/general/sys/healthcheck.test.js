'use strict';

const url = '/api/v1/sys/healthcheck';

describe(`GET ${url}`, () => {
  test('Healthcheck', async () => {
    const { status, body } = await http.get(url);
    expect(status).toBe(200);
    expect(body).toEqual({});
  });
});
