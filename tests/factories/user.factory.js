'use strict';

const chance = require('chance').Chance();
const {
  Types: { ObjectId },
} = require('mongoose');

module.exports = ({
  _id = ObjectId(),
  phoneNumber = `${chance.phone({ formatted: false })}${chance.integer({
    min: 10,
    max: 99,
  })}`,
  fullName = chance.name(),
  bankCards = [chance.cc()],
  deliveryAddresses = [],
  email = `${chance.word()}_${chance.email()}`,
  ...otherFields
} = {}) => ({
  _id,
  id: _id.toString(),
  phoneNumber,
  fullName,
  bankCards,
  deliveryAddresses,
  email,
  ...otherFields,
});
