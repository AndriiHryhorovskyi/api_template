'use strict';

const url = '/api/v1/auth/logout';

describe(`GET ${url}`, () => {
  test('Error when user is unauthenticated', async () => {
    const res = await http.get(url);
    expect(res.status).toBe(401);
    expect(res.body).not.toHaveProperty('data');
    expect(app.useCaseInstances.general.auth.logout).toBeFalsy();
  });

  test('Loged in user can logout', async () => {
    const { headerName, headerValue } = testData.users.user.auth;
    const res = await http.get(url).set(headerName, headerValue);
    expect(res.status).toBe(204);
    expect(res.body).not.toHaveProperty('error');
    expect(res.body.data).toBeFalsy();
    expect(app.useCaseInstances.general.auth.logout.execute).toBeCalled();
    const refreshTokens = await app.domainModels.RefreshToken.find({}).lean();
    expect(refreshTokens).toHaveLength(testData.users.list.length - 1);
  });
});
