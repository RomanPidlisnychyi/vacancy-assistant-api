const ErrorConstructor = require('../errors/ErrorConstructor');
const vacancyModel = require('../models/vacancyModel');
const statuses = require('../helpers/statuses');

const getUserVacancy = async (req, res, next) => {
  const {
    user: { _id: userId },
  } = req;

  const vacancies = await vacancyModel.find({ userId });

  res.status(200).json({ vacancies, statuses });
};

const createVacancy = async (req, res, next) => {
  const {
    user: { _id: userId },
    body,
  } = req;

  const vacancy = await vacancyModel.create({
    ...body,
    userId,
    date: Date.now(),
  });

  res.status(200).json(vacancy);
};

const updateVacancy = async (req, res, next) => {
  const { vacancyId } = req.params;

  if (!vacancyId) {
    return next(new ErrorConstructor(400));
  }

  const {
    user: { _id: userId },
    body,
  } = req;

  const vacancy = await vacancyModel.findOneAndUpdate(
    {
      $and: [{ userId }, { _id: vacancyId }],
    },
    { ...body },
    { new: true }
  );

  if (!vacancy) {
    return next(new ErrorConstructor(404));
  }

  res.status(200).json(vacancy);
};

const deleteVacancy = async (req, res, next) => {
  const { vacancyId } = req.params;

  if (!vacancyId) {
    return next(new ErrorConstructor(400));
  }

  const {
    user: { _id: userId },
  } = req;

  const vacancy = await vacancyModel.findOneAndDelete({
    $and: [{ userId }, { _id: vacancyId }],
  });

  if (!vacancy) {
    return next(new ErrorConstructor(404));
  }

  res.status(204).send();
};

module.exports = {
  getUserVacancy,
  createVacancy,
  updateVacancy,
  deleteVacancy,
};
