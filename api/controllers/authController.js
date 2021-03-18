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

  const accessTokenSecret = process.env.JWT_ACCESS_SECRET + user.password;
  console.log('accessTokenSecret', accessTokenSecret);

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
    token: {
      accessToken,
      refreshToken,
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

  req.user = user;

  if (!isTokenValid) {
    const accessToken = jwt.sign({ id: id }, accessTokenSecret, {
      expiresIn: '1m',
    });

    req.user = user;
    req.token = accessToken;
  }

  next();
};

const recoveryPassword = async (req, res, next) => {
  const { email } = req.body;

  const user = await userModel.findOne({ email });

  const newPassword = uuidv4();

  sendRecoveryEmail(email, newPassword);

  const hashPass = bcrypt.hashSync(newPassword, 4);

  await userModel.findByIdAndUpdate(user._id, { password: hashPass });

  return res
    .status(200)
    .json({ message: `Hi ${user.name}! We send new password on your email` });
};

module.exports = {
  register,
  login,
  authorized,
  recoveryPassword,
};
