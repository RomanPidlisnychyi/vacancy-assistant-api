const addVacancy = (req, res, next) => {
  console.log('req.token', req.token);
  console.log('req.userId', req.userId);

  res.status(200).json({ accessToken: req.token });
};

module.exports = {
  addVacancy,
};
