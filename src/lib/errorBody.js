const generateErrorBody = message => {
  return { error: { message } };
};

module.exports = generateErrorBody;
