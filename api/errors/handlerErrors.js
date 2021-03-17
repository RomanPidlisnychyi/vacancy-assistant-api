const { errorConfig } = require('./errorConfig');

module.exports.handlerErrors = (err, req, res, next) => {
  let { status } = err;

  if (err.code === 11000) {
    status = 409;
  }

  return status
    ? res.status(status).json({ message: errorConfig(status) })
    : res.status(400).json(err);
};
