const mongoose = require('mongoose');
const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true },
    countryCode: { type: String, required: true }, // Add countryCode field
    email: { type: String, required: true, unique: true },
    address: {
      city: { type: String, required: true },
      region: { type: String, required: true },
      address1: { type: String, required: true },
      address2: { type: String },
    },
    birthdate: { type: Date, required: true },
    gender: { type: String, enum: ['male', 'female', 'other'], required: true },
    role: { type: String, default: 'customer', enum: ['customer', 'admin', 'organizer'] },
    password: { type: String, required: true },
    resetToken: { type: String },
    resetTokenUsed: { type: Boolean, default: false },
    resetTokenExpires: { type: Date },
  },
  { timestamps: true }
);


module.exports = mongoose.model('User', userSchema);
