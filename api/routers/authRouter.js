const { Router } = require('express');
const { asyncWrapper } = require('../helpers/asyncWrapper');
const {
  register,
  login,
  recoveryPassword,
} = require('../controllers/authController');
const {
  userCreate,
  userLogin,
  userRecovery,
} = require('../validations/validations');

const authRouter = Router();

authRouter.post('/register', userCreate, asyncWrapper(register));
authRouter.post('/login', userLogin, asyncWrapper(login));
authRouter.post('/recovery', userRecovery, asyncWrapper(recoveryPassword));

module.exports = authRouter;
