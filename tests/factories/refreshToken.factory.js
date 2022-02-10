'use strict';

const {
  Types: { ObjectId },
} = require('mongoose');

module.exports = ({
  _id = ObjectId(),
  token = ObjectId().toString(),
  ...otherFields
} = {}) => ({
  _id,
  id: _id.toString(),
  token,
  ...otherFields,
});
