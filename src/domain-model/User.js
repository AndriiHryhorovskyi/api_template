'use strict';

/* eslint-disable func-names */

const getCommonRecources = require('./_common');

module.exports = appRecources => {
  const { phoneNumberRegExp, emailRegExp } = getCommonRecources(appRecources);
  const { mongo } = appRecources.infrastructure;
  const { mongoose, mongooseLeanVirtuals, xss } = appRecources.libs;
  const { Schema } = mongoose;

  const User = new Schema(
    {
      id: { type: String, required: true },
      phoneNumber: {
        type: String,
        trim: true,
        match: phoneNumberRegExp,
        unique: true,
      },
      email: { type: String, trim: true, match: emailRegExp },
    },
    { timestamps: true, versionKey: false, id: false },
  );

  User.index(
    { email: 1 },
    { unique: true, partialFilterExpression: { email: { $type: 'string' } } },
  );

  User.pre('validate', function (next) {
    this._id = this._id ?? mongoose.Types.ObjectId();
    this.id = this._id.toString();
    if ('fullName' in this) {
      this.fullName = xss(this.fullName);
    }
    next();
  });

  User.plugin(mongooseLeanVirtuals);

  return mongo.model('User', User);
};
