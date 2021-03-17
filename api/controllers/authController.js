const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');
const ErrorConstructor = require('../errors/ErrorConstructor');
const { isAccessTokenValid } = require('../validations/validations');

const register = async (req, res, next) => {
  const { name, email, password } = req.body;

  const hashPass = bcrypt.hashSync(password, 4);

  await userModel.create({ ...req.body, password: hashPass });

  return res.status(201).json({ name, email });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) {
    next(new ErrorConstructor(401));
  }

  const isPassValid = bcrypt.compareSync(password, user.password);
  if (!isPassValid) {
    return next(new ErrorConstructor(401));
  }

  const accessToken = jwt.sign(
    { id: user._id },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: '1m' }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  const response = {
    user: {
      name: user.name,
      email,
    },
    token: {
      accessToken,
      refreshToken,
    },
  };

  return res.status(200).json(response);
};

const authorized = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return next(new ErrorConstructor(400));
  }

  const token = authorization.split(' ')[1];

  let userId;
  console.log('1');
  isAccessTokenValid(token);
  return res.status(200).send();
  try {
    userId = jwt.verify(token, process.env.JWT_ACCESS_SECRET).id;
  } catch (err) {
    const expiredAt = err.expiredAt;
    const currentDate = Date.now();
    const timeCurrentUserValid = +process.env.TIME_CURRENT_USER_VALID;

    if (!(timeCurrentUserValid > currentDate - expiredAt)) {
      return next(new ErrorConstructor(401));
    }
  }

  console.log('2');

  if (userId) {
    req.user.id = userId;
    return next();
  }

  console.log('3');

  const refreshToken = req.headers['x-refresh-token'];

  try {
    userId = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET).id;
  } catch (err) {
    return next(new ErrorConstructor(401));
  }

  req.user.id = userId;
  next();
};

module.exports = {
  register,
  login,
  authorized,
};
