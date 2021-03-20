const ErrorConstructor = require('../errors/ErrorConstructor');
const vacancyModel = require('../models/vacancyModel');

const createVacancy = async (req, res, next) => {
  const {
    user: { _id: userId },
    token: access,
    body,
  } = req;

  const vacancy = await vacancyModel.create({ ...body, userId });

  res.status(200).json({ vacancy, access });
};

const updateVacancy = async (req, res, next) => {
  const { vacancyId } = req.params;

  if (!vacancyId) {
    return next(new ErrorConstructor(400));
  }

  const {
    user: { _id: userId },
    token: access,
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

  res.status(200).json({ vacancy, access });
};

const deleteVacancy = async (req, res, next) => {
  const { vacancyId } = req.params;

  if (!vacancyId) {
    return next(new ErrorConstructor(400));
  }

  const {
    user: { _id: userId },
    token: access,
  } = req;

  const vacancy = await vacancyModel.findOneAndDelete({
    $and: [{ userId }, { _id: vacancyId }],
  });

  if (!vacancy) {
    return next(new ErrorConstructor(404));
  }

  res.status(200).json({ access });
};

module.exports = {
  createVacancy,
  updateVacancy,
  deleteVacancy,
};
