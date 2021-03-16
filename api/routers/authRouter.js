const { Router } = require('express');
const { asyncWrapper } = require('../helpers/asyncWrapper');
const { register } = require('../controllers/authController');
const { userCreate } = require('../validations/validations');

const authRouter = Router();

authRouter.post('/register', userCreate, asyncWrapper(register));

module.exports = authRouter;
