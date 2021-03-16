const { errorConfig } = require('./errorConfig');

module.exports.handlerErrors = (err, req, res, next) => {
  const { status } = err;

  return status
    ? res.status(status).json({ message: errorConfig(status) })
    : res.status(400).json(err);
};
