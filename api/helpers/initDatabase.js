const mongoose = require('mongoose');

module.exports.initDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_KEY, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Database successfully conected!');
  } catch (err) {
    console.log('Database fail conection');
    process.exit(1);
  }
};
