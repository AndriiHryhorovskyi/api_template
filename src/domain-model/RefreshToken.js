'use strict';

module.exports = ({ infrastructure, libs }) => {
  const { mongo } = infrastructure;
  const { mongoose, mongooseLeanVirtuals } = libs;
  const { Schema } = mongoose;

  const RefreshToken = new Schema(
    {
      token: { type: String, required: true, index: true },
      userId: {
        type: Schema.Types.ObjectId,
        required: true,
        index: true,
      },
    },
    { timestamps: true, versionKey: false, id: false },
  );

  RefreshToken.plugin(mongooseLeanVirtuals);

  return mongo.model('RefreshToken', RefreshToken);
};
