'use strict';

const Base = require('../../_Base');

module.exports = ({ libs, constants, config }) => {
  const { joi, mongoose } = libs;
  const { ROLES } = constants;
  const { SESSION } = config;

  return class Login extends Base {
    static getValidationRules = async () => joi.object();

    async execute() {
      const accessToken = await libs.jwt.accessToken.issueToken({
        id: mongoose.Types.ObjectId().toString(),
        role: ROLES.anonymous,
      });
      return {
        data: { accessToken },
        meta: {
          expiresIn: SESSION.EXP,
        },
      };
    }

    async dumpResult(result) {
      return result;
    }
  };
};
