const mongoose = require('mongoose');
const { Schema } = mongoose;

const vacancySchema = new Schema({
  userId: { type: 'ObjectId', require: true },
  companyName: { type: String, require: true },
  URL: String,
  location: String,
  position: String,
  stack: String,
  phone: String,
  favorite: {
    type: Boolean,
    required: true,
    default: false,
  },
  task: {
    type: Boolean,
    required: true,
    default: false,
  },
  status: {
    type: String,
    required: true,
    default: 'interested',
  },
  date: { type: Number, require: true },
});

const vacancyModel = mongoose.model('Vacancy', vacancySchema);

module.exports = vacancyModel;
