const mongoose = require('mongoose');

module.exports.initDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_KEY, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });

    console.log('Database successfully conected!');
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};
