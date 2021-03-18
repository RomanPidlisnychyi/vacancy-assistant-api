const addVacancy = (req, res, next) => {
  console.log('req.token', req.token);
  console.log('req.user', req.user);

  res.status(200).json({ accessToken: req.token });
};

module.exports = {
  addVacancy,
};
