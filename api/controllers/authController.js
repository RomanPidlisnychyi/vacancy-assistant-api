const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const userModel = require('../models/userModel');
const ErrorConstructor = require('../errors/ErrorConstructor');
const {
  isAccessTokenValid,
  isRefreshTokenValid,
  sendRecoveryEmail,
} = require('../validations/validations');
const numberGenerator = require('../helpers/numberGenerator');

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
    return next(new ErrorConstructor(401));
  }

  const isPassValid = bcrypt.compareSync(password, user.password);
  if (!isPassValid) {
    return next(new ErrorConstructor(401));
  }

  const { recoveryPassword } = user;

  if (recoveryPassword) {
    await userModel.findByIdAndUpdate(user._id, {
      $unset: { recoveryPassword },
    });
  }

  const accessTokenSecret = process.env.JWT_ACCESS_SECRET + user.password;

  const accessToken = jwt.sign({ id: user._id }, accessTokenSecret, {
    expiresIn: '1m',
  });

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
    tokens: {
      access: accessToken,
      refresh: refreshToken,
    },
  };

  return res.status(200).json(response);
};

const authorized = async (req, res, next) => {
  const { authorization } = req.headers;

  const token = authorization.split(' ')[1];
  const refreshToken = req.headers['x-refresh-token'];

  if (!token || !refreshToken) {
    return next(new ErrorConstructor(400));
  }

  const id = isRefreshTokenValid(refreshToken);
  if (!id) {
    return next(new ErrorConstructor(401));
  }

  const user = await userModel.findById(id);
  if (!user) {
    return next(new ErrorConstructor(404));
  }

  const { password } = user;

  const accessTokenSecret = process.env.JWT_ACCESS_SECRET + password;

  let isTokenValid = isAccessTokenValid(token, accessTokenSecret);

  req.user = user._doc;

  if (!isTokenValid) {
    const accessToken = jwt.sign({ id: id }, accessTokenSecret, {
      expiresIn: '1m',
    });

    req.user = user;
    req.token = accessToken;
  }

  next();
};

const current = async (req, res, next) => {
  const response = {
    user: {
      name: req.user.name,
      email: req.user.email,
    },
    access: req.token,
  };

  return res.status(200).json(response);
};

const refresh = async (req, res, next) => {
  return res.status(200).json({ access: req.token });
};

const setRecoveryPassword = async (req, res, next) => {
  const { email } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) {
    return next(new ErrorConstructor(404));
  }

  const recoveryPassword = numberGenerator();

  sendRecoveryEmail(email, recoveryPassword);

  await userModel.findByIdAndUpdate(user._id, { recoveryPassword });

  return res.status(201).json({ email });
};

const setNewPassword = async (req, res, next) => {
  const { email, recoveryPassword, password } = req.body;

  const hashPass = bcrypt.hashSync(password, 4);

  const user = await userModel.findOneAndUpdate(
    {
      $and: [{ email }, { recoveryPassword }],
    },
    { password: hashPass, $unset: { recoveryPassword } },
    { new: true }
  );

  if (!user) {
    return next(new ErrorConstructor(404));
  }

  return res.status(200).json({ name: user.name, email });
};

module.exports = {
  register,
  login,
  authorized,
  current,
  refresh,
  setRecoveryPassword,
  setNewPassword,
};
