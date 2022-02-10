'use strict';

const joi = require('joi');
const mongoose = require('mongoose');
const { InputError } = require('./errors');

const rules = {
  isObjectId: joi
    .string()
    .trim()
    .custom(value => {
      if (!mongoose.Types.ObjectId.isValid(value))
        throw new Error('invalid id');
      return value;
    }),
  isPassword: joi.string().min(8),
  isEmail: joi.string().trim().email({ minDomainSegments: 2 }),
  isPhoneNumber: joi
    .string()
    .trim()
    .pattern(/^[0-9]{12}$/),
};

async function validate(schema, data) {
  if (data === undefined)
    throw new Error('Data to validation are not received');
  if (!joi.isSchema(schema)) {
    throw new Error(`Invalid schema: ${JSON.stringify(schema)}`);
  }
  return schema
    .validateAsync(data, { abortEarly: true, stripUnknown: true })
    .catch(err => {
      throw new InputError({
        message: 'Invalid input data',
        description: err.details[0].message,
        field: err.details[0].path[0],
      });
    });
}

async function validateConfig(schema, data) {
  if (data === undefined)
    throw new Error('Data to validation are not received');
  if (!joi.isSchema(schema)) {
    throw new Error(`Invalid schema: ${JSON.stringify(schema)}`);
  }
  return schema.validateAsync(data, { allowUnknown: true, abortEarly: false });
}

module.exports = { validate, rules, validateConfig };
