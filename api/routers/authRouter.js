const { Router } = require('express');
const { asyncWrapper } = require('../helpers/asyncWrapper');
const { register, login } = require('../controllers/authController');
const { userCreate, userLogin } = require('../validations/validations');

const authRouter = Router();

authRouter.post('/register', userCreate, asyncWrapper(register));
authRouter.post('/login', userLogin, asyncWrapper(login));

module.exports = authRouter;
