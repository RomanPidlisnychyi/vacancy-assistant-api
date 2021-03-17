const getVacancy = (req, res, next) => {
  console.log('req.user', req.user);

  res.status(200).send();
};

module.exports = {
  getVacancy,
};
