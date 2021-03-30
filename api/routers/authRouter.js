const { Router } = require('express');
const { asyncWrapper } = require('../helpers/asyncWrapper');
const {
  register,
  login,
  authorized,
  current,
  refresh,
  setRecoveryPassword,
  setNewPassword,
} = require('../controllers/authController');
const {
  createUserValidation,
  loginUserValidation,
  setRecoveryPasswordValidation,
  setNewPasswordValidation,
} = require('../validations/validations');

const authRouter = Router();

authRouter.post('/register', createUserValidation, asyncWrapper(register));
authRouter.post('/login', loginUserValidation, asyncWrapper(login));
authRouter.get('/current', asyncWrapper(authorized), asyncWrapper(current));
authRouter.get('/refresh', asyncWrapper(authorized), asyncWrapper(refresh));
authRouter.post(
  '/setRecoveryPassword',
  setRecoveryPasswordValidation,
  asyncWrapper(setRecoveryPassword)
);
authRouter.patch(
  '/setNewPassword',
  setNewPasswordValidation,
  asyncWrapper(setNewPassword)
);

module.exports = authRouter;
