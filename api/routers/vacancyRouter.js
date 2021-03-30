const { Router } = require('express');
const { asyncWrapper } = require('../helpers/asyncWrapper');
const { authorized } = require('../controllers/authController');
const {
  getUserVacancy,
  createVacancy,
  updateVacancy,
  deleteVacancy,
} = require('../controllers/vacancyController');
const {
  createVacancyValidation,
  updateVacancyValidation,
} = require('../validations/validations');

const vacancyRouter = Router();

vacancyRouter.get('/', asyncWrapper(authorized), asyncWrapper(getUserVacancy));

vacancyRouter.post(
  '/',
  createVacancyValidation,
  asyncWrapper(authorized),
  asyncWrapper(createVacancy)
);

vacancyRouter.patch(
  '/:vacancyId',
  updateVacancyValidation,
  asyncWrapper(authorized),
  asyncWrapper(updateVacancy)
);

vacancyRouter.delete(
  '/:vacancyId',
  asyncWrapper(authorized),
  asyncWrapper(deleteVacancy)
);

module.exports = vacancyRouter;
