'use strict';

const validator = require('../libs/validator');

module.exports = class Base {
  constructor(args) {
    if (!args.context) throw new Error('CONTEXT_REQUIRED');
    this.context = args.context;
  }

  run(params) {
    return this.validate(params)
      .then(cleanParams => this.execute(cleanParams))
      .then(result => this.dumpResult(result));
  }

  async validate(data) {
    const validationRules = await this.constructor.getValidationRules(data);
    return validator.validate(validationRules, data);
  }
};
