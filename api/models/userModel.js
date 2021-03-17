const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, require: true },
  email: { type: String, require: true, unique: true, lowercase: true },
  password: { type: String, require: true },
  vacancies: [{ type: 'ObjectId', ref: 'Vacancy' }],
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
