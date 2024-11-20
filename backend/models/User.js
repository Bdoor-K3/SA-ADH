const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    address: {
      city: { type: String, required: true },
      region: { type: String, required: true },
      address1: { type: String, required: true },
      address2: { type: String },
    },
    age: { type: Number, required: true },
    gender: { type: String, enum: ['male', 'female', 'other'], required: true },
    role: { type: String, default: 'customer', enum: ['customer', 'admin', 'organizer'] },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
