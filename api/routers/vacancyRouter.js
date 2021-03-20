const { Router } = require('express');
const { asyncWrapper } = require('../helpers/asyncWrapper');
const { authorized } = require('../controllers/authController');
const {
  createVacancy,
  updateVacancy,
  deleteVacancy,
} = require('../controllers/vacancyController');
const {
  createVacancyValidation,
  updateVacancyValidation,
} = require('../validations/validations');

const vacancyRouter = Router();

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
