const Joi = require('joi');
const ErrorConstructor = require('../errors/ErrorConstructor');

const userCreate = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required(),
    password: Joi.string().required(),
  });

  const result = schema.validate(req.body);

  result.error ? next(new ErrorConstructor(400)) : next();
};

module.exports = {
  userCreate,
};
