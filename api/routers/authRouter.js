const { Router } = require('express');
const { asyncWrapper } = require('../helpers/asyncWrapper');
const {
  register,
  login,
  authorized,
  current,
  recoveryPassword,
} = require('../controllers/authController');
const {
  createUserValidation,
  loginUserValidation,
  recoveryUserValidation,
} = require('../validations/validations');

const authRouter = Router();

authRouter.post('/register', createUserValidation, asyncWrapper(register));
authRouter.post('/login', loginUserValidation, asyncWrapper(login));
authRouter.get('/current', asyncWrapper(authorized), asyncWrapper(current));
authRouter.post(
  '/recovery',
  recoveryUserValidation,
  asyncWrapper(recoveryPassword)
);

module.exports = authRouter;
