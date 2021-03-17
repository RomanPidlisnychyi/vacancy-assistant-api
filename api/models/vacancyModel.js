const mongoose = require('mongoose');
const { Schema } = mongoose;

const vacancySchema = new Schema({
  companyName: { type: String, require: true },
  URL: String,
  location: String,
  position: String,
  stack: String,
});

const vacancyModel = mongoose.model('Vacancy', vacancySchema);

module.exports = vacancyModel;
