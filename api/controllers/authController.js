const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');
const ErrorConstructor = require('../errors/ErrorConstructor');
const {
  isAccessTokenValid,
  isRefreshTokenValid,
} = require('../validations/validations');

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

  let userId = isAccessTokenValid(token);

  req.userId = userId;
  req.token = token;

  if (!userId) {
    const refreshToken = req.headers['x-refresh-token'];
    userId = isRefreshTokenValid(refreshToken);
    const accessToken = jwt.sign(
      { id: userId },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: '1m' }
    );

    req.userId = userId;
    req.token = accessToken;
  }

  next();
};

const recoveryPassword = (req, res, next) => {};

module.exports = {
  register,
  login,
  authorized,
  recoveryPassword,
};
