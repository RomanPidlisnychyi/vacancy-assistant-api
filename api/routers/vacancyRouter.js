const { Router } = require('express');
const { asyncWrapper } = require('../helpers/asyncWrapper');
const { authorized } = require('../controllers/authController');
const { addVacancy } = require('../controllers/vacancyController');

const vacancyRouter = Router();

vacancyRouter.get('/', asyncWrapper(authorized), asyncWrapper(addVacancy));

module.exports = vacancyRouter;
