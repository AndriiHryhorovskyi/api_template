'use strict';

const Base = require('../../_Base');

module.exports = ({ domainModels, libs }) => {
  const { joi } = libs;
  const { RefreshToken } = domainModels;

  return class Logout extends Base {
    static getValidationRules = async () => joi.object({});

    async execute() {
      const { id: userId } = this.context.session;
      await RefreshToken.deleteMany({ userId });
      return null;
    }

    async dumpResult(result) {
      return {
        data: result,
      };
    }
  };
};
