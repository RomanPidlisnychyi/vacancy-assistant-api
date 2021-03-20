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
  status: {
    type: String,
    required: true,
    enum: ['interested', 'sent', 'accepted', 'rejected'],
    default: 'interested',
  },
  date: { type: Number, default: Date.now(), require: true },
});

const vacancyModel = mongoose.model('Vacancy', vacancySchema);

module.exports = vacancyModel;
