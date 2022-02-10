'use strict';

const baseUrl = '/api/v1/auth';
const refreshUrl = `${baseUrl}/refresh`;

describe(`Auth scenarious`, () => {
  test('Refresh tokens become invalid after logout', async () => {
    const {
      auth: { refreshToken, headerName, headerValue },
    } = testData.users.user;
    const logout = await http
      .get(`${baseUrl}/logout`)
      .set(headerName, headerValue);
    expect(logout.status).toBe(204);
    const res = await http.post(refreshUrl).send({ refreshToken });
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
    expect(res.body).not.toHaveProperty('data');
    const tokens = await app.domainModels.RefreshToken.find({});
    expect(tokens).toHaveLength(0);
  });
});
