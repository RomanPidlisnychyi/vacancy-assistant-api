require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');

const register = async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await userModel.create(req.body);

  return res.status(200).json(user);
};

module.exports = {
  register,
};
