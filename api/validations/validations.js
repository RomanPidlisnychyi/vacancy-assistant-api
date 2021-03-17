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

const isAccessTokenValid = token => {
  let result;
  try {
    result = jwt.verify(token, process.env.JWT_ACCESS_SECRET).id;
  } catch (err) {
    const expiredAt = err.expiredAt;
    const currentDate = Date.now();
    const timeCurrentUserValid = +process.env.TIME_CURRENT_USER_VALID;

    if (!(timeCurrentUserValid > currentDate - expiredAt)) {
      throw new ErrorConstructor(401);
    }

    result = true;
  }

  return result;
};

module.exports = {
  userCreate,
  userLogin,
  isAccessTokenValid,
};
