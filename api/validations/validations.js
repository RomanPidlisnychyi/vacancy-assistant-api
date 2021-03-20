const Joi = require('joi');
const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail');
const ErrorConstructor = require('../errors/ErrorConstructor');

const createUserValidation = (req, res, next) => {
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

const loginUserValidation = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required(),
    password: Joi.string().required(),
  }).required();

  const result = schema.validate(req.body);

  result.error ? next(new ErrorConstructor(400)) : next();
};

const recoveryUserValidation = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required(),
  }).required();

  const result = schema.validate(req.body);

  result.error ? next(new ErrorConstructor(400)) : next();
};

const isAccessTokenValid = (token, accessTokenSecret) => {
  let userId;
  try {
    userId = jwt.verify(token, accessTokenSecret).id;
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

const sendRecoveryEmail = (email, newPassword) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: email, // Change to your recipient
    from: process.env.SENDGRID_USER, // Change to your verified sender
    subject: 'Sending with SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: `<strong>This is your new password: '${newPassword}'</strong>`,
  };

  try {
    sgMail.send(msg);
  } catch (err) {
    throw new ErrorConstructor(418);
  }
};

const createVacancyValidation = (req, res, next) => {
  const schema = Joi.object({
    companyName: Joi.string().required(),
    URL: Joi.string(),
    location: Joi.string(),
    position: Joi.string(),
    stack: Joi.string(),
    phone: Joi.string(),
    status: Joi.string(),
  }).required();

  const result = schema.validate(req.body);

  result.error ? next(new ErrorConstructor(400)) : next();
};

const updateVacancyValidation = (req, res, next) => {
  const schema = Joi.object({
    companyName: Joi.string(),
    URL: Joi.string(),
    location: Joi.string(),
    position: Joi.string(),
    stack: Joi.string(),
    phone: Joi.string(),
    status: Joi.string(),
  }).min(1);

  const result = schema.validate(req.body);

  result.error ? next(new ErrorConstructor(400)) : next();
};

module.exports = {
  createUserValidation,
  loginUserValidation,
  recoveryUserValidation,
  isAccessTokenValid,
  isRefreshTokenValid,
  sendRecoveryEmail,
  createVacancyValidation,
  updateVacancyValidation,
};
