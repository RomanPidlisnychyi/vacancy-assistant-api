const Joi = require('joi');
const jwt = require('jsonwebtoken');
const ErrorConstructor = require('../errors/ErrorConstructor');

const userCreate = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required(),
    password: Joi.string().required(),
  }).required();

  const result = schema.validate(req.body);

  result.error ? next(new ErrorConstructor(400)) : next();
};

const userLogin = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required(),
    password: Joi.string().required(),
  }).required();

  const result = schema.validate(req.body);

  result.error ? next(new ErrorConstructor(400)) : next();
};

const userRecovery = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required(),
  }).required();

  const result = schema.validate(req.body);

  result.error ? next(new ErrorConstructor(400)) : next();
};

const isAccessTokenValid = token => {
  let userId;
  try {
    userId = jwt.verify(token, process.env.JWT_ACCESS_SECRET).id;
  } catch (err) {
    const expiredAt = err.expiredAt;
    const currentDate = Date.now();
    const timeCurrentUserValid = +process.env.TIME_CURRENT_USER_VALID;

    if (!(timeCurrentUserValid > currentDate - expiredAt)) {
      throw new ErrorConstructor(401);
    }
  }

  return userId;
};

const isRefreshTokenValid = token => {
  let userId;
  try {
    userId = jwt.verify(token, process.env.JWT_REFRESH_SECRET).id;
  } catch (err) {
    throw new ErrorConstructor(401);
  }

  return userId;
};

module.exports = {
  userCreate,
  userLogin,
  userRecovery,
  isAccessTokenValid,
  isRefreshTokenValid,
};
