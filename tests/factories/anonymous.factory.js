'use strict';

const {
  Types: { ObjectId },
} = require('mongoose');

module.exports = ({ id = ObjectId().toString(), ...otherFields } = {}) => ({
  id,
  ...otherFields,
});
