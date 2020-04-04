const { BAD_REQUEST } = require("http-status-codes");
const { validator, errorBody } = require("../../lib");

const validateMdw = async (req, res, schema, data) => {
  const [err, validData] = await validator.validate(schema, data);

  if (err) {
    const body = errorBody(validData.message);
    res.status(BAD_REQUEST).json(body);
    return null;
  }
  return validData;
};

module.exports = validateMdw;
