const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const dbUri = process.env.MONGO_URI ;
    if (!dbUri) {
      console.error('MONGO_URI is not defined in the .env file.');
      process.exit(1);
    }

    await mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
