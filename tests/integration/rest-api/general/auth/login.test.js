'use strict';

const url = '/api/v1/auth/login';

describe(`POST ${url}`, () => {
  test('Access token generated properly', async () => {
    const res = await http.get(url);
    expect(res.status).toBe(200);
    expect(res.body.data.accessToken).toBeTruthy();
    expect(res.body.meta.expiresIn).toBeTruthy();
    const { accessToken } = res.body.data;
    const jwtData = await app.libs.jwt.accessToken
      .verify(accessToken)
      .catch(() => null);
    expect(jwtData).toBeTruthy();
    const isValidObjectId = app.libs.mongoose.Types.ObjectId.isValid(
      jwtData.id,
    );
    expect(jwtData.id).toBeTruthy();
    expect(isValidObjectId).toBeTruthy();
    expect(jwtData.role).toBe(app.constants.ROLES.anonymous);
    expect(app.useCaseInstances.general.auth.login.execute).toBeCalled();
  });
});
