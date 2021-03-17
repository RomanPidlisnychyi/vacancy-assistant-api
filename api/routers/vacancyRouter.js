const { Router } = require('express');
const { asyncWrapper } = require('../helpers/asyncWrapper');
const { authorized } = require('../controllers/authController');
const { getVacancy } = require('../controllers/vacancyController');

const vacancyRouter = Router();

vacancyRouter.get('/', asyncWrapper(authorized), asyncWrapper(getVacancy));

module.exports = vacancyRouter;
